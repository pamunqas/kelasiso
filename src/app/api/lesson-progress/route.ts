import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { randomUUID } from 'crypto';

function generateSecureCertNumber(): string {
  return `ISO27001-${Date.now()}-${randomUUID().split('-')[0].toUpperCase()}`;
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

    let lessonId: string;
    let completed: boolean;
    
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await req.json();
      lessonId = body.lessonId;
      completed = body.completed;
    } else {
      const formData = await req.formData();
      lessonId = formData.get('lessonId') as string;
      const completedValue = formData.get('completed') as string;
      completed = completedValue === 'true';
    }

    if (!lessonId) {
      return NextResponse.json(
        { error: 'ID pelajaran diperlukan' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Pelajaran tidak ditemukan' },
        { status: 404 }
      );
    }

    const courseId = lesson.module.course.id;

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

    // Update lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: { completed },
      create: {
        userId: session.user.id,
        lessonId,
        completed,
      },
    });

    // Calculate overall course progress
    const allLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
      },
    });

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

    // Update enrollment progress
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      data: { progress: progressPercent },
    });

    // Generate certificate if 100% and not already generated
    if (progressPercent >= 100) {
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

        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId,
            },
          },
          data: { completedAt: new Date() },
        });
      }
    }

    return NextResponse.json(
      { message: 'Progress updated', progress, courseProgress: progressPercent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lesson progress error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}