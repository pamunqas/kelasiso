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

    const courseId = quiz.lesson.module.course.id;

    // Verify user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Anda belum terdaftar di kursus ini' },
        { status: 403 }
      );
    }

    // Check if user can access this quiz (lesson must be unlocked)
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: quiz.lessonId,
        },
      },
    });

    // User can only access quiz if previous lesson is completed or it's the first lesson
    const allLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
      },
      orderBy: [{ module: { order: 'asc' } }, { order: 'asc' }],
    });

    const currentLessonIndex = allLessons.findIndex(l => l.id === quiz.lessonId);
    
    if (currentLessonIndex > 0) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      const previousProgress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: previousLesson.id,
          },
        },
      });

      if (!previousProgress?.completed) {
        return NextResponse.json(
          { error: 'Anda harus menyelesaikan pelajaran sebelumnya terlebih dahulu' },
          { status: 403 }
        );
      }
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
