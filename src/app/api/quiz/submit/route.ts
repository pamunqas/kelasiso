import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
    }

    const { quizId, answers, score } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        answers: JSON.stringify(answers),
      },
    });

    // Check if course is completed (100% progress) and generate certificate
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true },
            },
          },
        },
      },
    });

    if (quiz && score >= 70) {
      const courseId = quiz.lesson.module.course.id;
      
      // Check all lessons completed
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      });

      const allLessons = course?.modules.flatMap(m => m.lessons) || [];
      
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessons.map(l => l.id) },
          completed: true,
        },
      });

      if (allLessons.length > 0 && completedLessons >= allLessons.length) {
        // Generate certificate
        const certNumber = `ISO27001-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        await prisma.certificate.create({
          data: {
            userId: session.user.id,
            courseId,
            certificateNumber: certNumber,
          },
        });

        // Mark enrollment as completed
        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId,
            },
          },
          data: {
            completedAt: new Date(),
            progress: 100,
          },
        });
      }
    }

    return NextResponse.json(
      { message: 'Jawaban submitted', attempt },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}