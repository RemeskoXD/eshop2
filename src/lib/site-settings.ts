import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const FALLBACK_FILE = path.join(process.cwd(), "data", "site-settings.json");

export type SiteSettings = {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  primaryColor: "#5D5754",
  accentColor: "#D9C5B2",
  backgroundColor: "#F9F8F6",
  textColor: "#333333",
};

async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  } catch (e) {
    // ignore
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    });
    if (settings) {
      return {
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        backgroundColor: settings.backgroundColor,
        textColor: settings.textColor,
      };
    }
  } catch (e) {
    console.warn("Database unreachable for getSiteSettings, falling back to local file.");
  }

  try {
    const data = await fs.readFile(FALLBACK_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...settings };

  let dbSuccess = false;
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: updated,
      create: { id: "global", ...updated },
    });
    dbSuccess = true;
  } catch (e) {
    console.warn("Database unreachable for updateSiteSettings, falling back to local file.");
  }

  if (!dbSuccess) {
    await ensureDataDir();
    await fs.writeFile(FALLBACK_FILE, JSON.stringify(updated, null, 2), "utf-8");
  }

  return updated;
}
