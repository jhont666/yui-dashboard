import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { telegramId, name } = await req.json();
    if (!telegramId) return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });

    // 1. Simpan/Update User
    await prisma.user.upsert({
      where: { telegramId: String(telegramId) },
      update: { name: name || 'Kak' },
      create: { telegramId: String(telegramId), name: name || 'Kak' },
    });

    // 2. Generate OTP 6 karakter alphanumeric
    const otpCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // 3. Simpan OTP (hapus yang lama jika ada)
    await prisma.otp.deleteMany({ where: { telegramId: String(telegramId) } });
    await prisma.otp.create({
      data: { code: otpCode, telegramId: String(telegramId), expiresAt },
    });

    return NextResponse.json({ success: true, otp: otpCode });
  } catch (error) {
    console.error('Generate OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}