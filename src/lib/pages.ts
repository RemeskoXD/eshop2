import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const FALLBACK_FILE = path.join(process.cwd(), "data", "pages.json");

export type PageBlock = {
  id: string;
  type: "hero" | "text" | "image";
  content: any;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: PageBlock[];
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function getFallbackPages(): Promise<Page[]> {
  try {
    const data = await fs.readFile(FALLBACK_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}

async function saveFallbackPages(pages: Page[]) {
  await ensureDataDir();
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(pages, null, 2), "utf-8");
}

export async function getPages(): Promise<Page[]> {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });
    return pages.map(p => ({
      ...p,
      content: (p.content as any) || []
    }));
  } catch (e) {
    console.warn("Database unreachable for getPages, falling back to local file.");
    return getFallbackPages();
  }
}

export async function getPage(id: string): Promise<Page | null> {
  try {
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return null;
    return {
      ...page,
      content: (page.content as any) || []
    };
  } catch (e) {
    const pages = await getFallbackPages();
    return pages.find(p => p.id === id) || null;
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return null;
    return {
      ...page,
      content: (page.content as any) || []
    };
  } catch (e) {
    const pages = await getFallbackPages();
    return pages.find(p => p.slug === slug) || null;
  }
}

export async function createPage(data: { title: string; slug: string }): Promise<Page> {
  try {
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: [],
      }
    });
    return {
      ...page,
      content: []
    };
  } catch (e) {
    const pages = await getFallbackPages();
    const newPage: Page = {
      id: Math.random().toString(36).substring(2, 9),
      title: data.title,
      slug: data.slug,
      content: [],
      isDraft: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    pages.push(newPage);
    await saveFallbackPages(pages);
    return newPage;
  }
}

export async function updatePage(id: string, data: Partial<Page>): Promise<Page> {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content as any,
        isDraft: data.isDraft,
      }
    });
    return {
      ...page,
      content: (page.content as any) || []
    };
  } catch (e) {
    const pages = await getFallbackPages();
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Page not found");
    
    pages[index] = {
      ...pages[index],
      ...data,
      updatedAt: new Date(),
    };
    await saveFallbackPages(pages);
    return pages[index];
  }
}

export async function deletePage(id: string): Promise<void> {
  try {
    await prisma.page.delete({ where: { id } });
  } catch (e) {
    const pages = await getFallbackPages();
    const filtered = pages.filter(p => p.id !== id);
    await saveFallbackPages(filtered);
  }
}
