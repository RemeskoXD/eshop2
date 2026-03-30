import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmails } from "@/lib/order-emails";

type RequestItem = {
  name: string;
  unitPrice: number;
  quantity: number;
  config: Record<string, string>;
};

type OrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  postalCode: string;
  items: RequestItem[];
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload.items?.length) {
      return NextResponse.json({ error: "Košík je prázdný." }, { status: 400 });
    }

    if (!payload.acceptTerms || !payload.acceptPrivacy) {
      return NextResponse.json(
        { error: "Musíte souhlasit s obchodními podmínkami a se zpracováním údajů." },
        { status: 400 },
      );
    }

    const totalPrice = payload.items.reduce(
      (sum, item) => sum + Math.round(item.unitPrice) * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        street: payload.street,
        city: payload.city,
        postalCode: payload.postalCode,
        totalPrice,
        items: {
          create: payload.items.map((item) => ({
            name: item.name,
            unitPrice: Math.round(item.unitPrice),
            quantity: item.quantity,
            configs: {
              create: Object.entries(item.config).map(([key, value]) => ({
                key,
                value,
              })),
            },
          })),
        },
      },
    });

    const now = new Date();
    const year = now.getFullYear();
    const shortId = order.id.slice(-6).toUpperCase();
    const orderNumber = `QAPI-${year}-${shortId}`;
    const variableSymbol = order.id.replace(/\D/g, "");

    try {
      await prisma.$executeRaw`
        UPDATE "Order"
        SET
          "orderNumber" = ${orderNumber},
          "variableSymbol" = ${variableSymbol}
        WHERE "id" = ${order.id};
      `;
    } catch {
      // Volitelné sloupce z migrace nemusí existovat — čísla použijeme stejně z výpočtu výše.
    }

    void sendOrderEmails({
      orderNumber,
      variableSymbol,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      street: payload.street,
      city: payload.city,
      postalCode: payload.postalCode,
      totalPrice,
      items: payload.items,
    }).catch((err) => {
      console.error("[orders] sendOrderEmails failed:", err);
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber,
      variableSymbol,
    });
  } catch {
    return NextResponse.json(
      { error: "Objednávku se nepodařilo uložit." },
      { status: 500 },
    );
  }
}
