import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSecret, generateURI } from 'otplib';
import * as QRCode from "qrcode";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const secret = generateSecret();
    const otpauth = generateURI({
      issuer: "OKU CLINIC",
      label: session.user.email!,
      secret: secret
    });

    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Save secret to user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret }
    });

    return NextResponse.json({ qrCodeUrl, secret });
  } catch (error) {
    console.error("[2FA_SETUP_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
