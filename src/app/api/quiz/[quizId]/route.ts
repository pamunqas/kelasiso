import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Kuis tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz, questions: quiz.questions });
  } catch (error) {
    console.error('Quiz error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}