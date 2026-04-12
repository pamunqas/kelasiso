import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true },
            },
          },
        },
        questions: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Kuis tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Kuis tidak ditemukan' }, { status: 404 });
    }

    // Delete existing questions
    await prisma.question.deleteMany({
      where: { quizId: params.quizId },
    });

    // Create new questions
    for (const q of questions) {
      await prisma.question.create({
        data: {
          quizId: params.quizId,
          text: q.text,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
        },
      });
    }

    return NextResponse.json({ message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('Quiz update error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
