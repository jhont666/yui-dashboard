import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose'; // npm install jose

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'yui-secret-key-2026');

export async function POST(req: Request) {
  try {
    const { telegramId, otp } = await req.json();
    if (!telegramId || !otp) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });

    const validOtp = await prisma.otp.findFirst({
      where: {
        telegramId: String(telegramId),
        code: otp.toUpperCase(),
        expiresAt: { gte: new Date() },
      },
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Kode OTP salah atau sudah kedaluwarsa 🥺' }, { status: 401 });
    }

    // Hapus OTP setelah berhasil (one-time use)
    await prisma.otp.delete({ where: { id: validOtp.id } });

    // Buat JWT Token (berlaku 7 hari)
    const token = await new SignJWT({ telegramId: String(telegramId) })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET);

    return NextResponse.json({ 
      success: true, 
      token,
      message: 'Login berhasil! Selamat datang kembali~ 🌸' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}