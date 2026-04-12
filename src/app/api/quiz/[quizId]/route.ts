import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
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
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Kuis tidak ditemukan' },
        { status: 404 }
      );
    }

    // Return questions (without correct answers)
    const questions = quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options),
    }));

    return NextResponse.json({ quiz: { id: quiz.id, title: quiz.title, lessonId: quiz.lessonId }, questions });
  } catch (error) {
    console.error('Quiz error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
