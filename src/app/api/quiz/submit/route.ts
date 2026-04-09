import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { randomUUID } from 'crypto';

function generateSecureCertNumber(): string {
  return `ISO27001-${Date.now()}-${randomUUID().split('-')[0].toUpperCase()}`;
}

async function calculateScoreServerSide(quizId: string, answers: Record<string, string>): Promise<number> {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true,
    },
  });

  if (!quiz || !quiz.questions.length) {
    return 0;
  }

  let correctCount = 0;
  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      correctCount++;
    }
  }

  return Math.round((correctCount / quiz.questions.length) * 100);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
    }

    const { quizId, answers } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

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

    // Calculate score server-side (ignore client-provided score)
    const calculatedScore = await calculateScoreServerSide(quizId, answers);

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score: calculatedScore,
        answers: JSON.stringify(answers),
      },
    });

    // Auto-complete lesson if score >= 70
    if (calculatedScore >= 70) {
      const lessonId = quiz.lessonId;
      
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId,
          },
        },
        update: { completed: true },
        create: {
          userId: session.user.id,
          lessonId,
          completed: true,
        },
      });

      // Calculate and update course progress
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

      const progressPercent = allLessons.length > 0 
        ? (completedLessons / allLessons.length) * 100 
        : 0;

      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        data: { progress: progressPercent },
      });

      // Generate certificate if all lessons completed
      if (allLessons.length > 0 && completedLessons >= allLessons.length) {
        const existingCert = await prisma.certificate.findFirst({
          where: {
            userId: session.user.id,
            courseId,
          },
        });

        if (!existingCert) {
          const certNumber = generateSecureCertNumber();
          
          await prisma.certificate.create({
            data: {
              userId: session.user.id,
              courseId,
              certificateNumber: certNumber,
            },
          });
        }

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
      { message: 'Jawaban submitted', attempt, score: calculatedScore },
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
