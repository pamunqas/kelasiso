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

    const { lessonId, completed } = await req.json();

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

    // Update lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: { completed: completed === 'true' },
      create: {
        userId: session.user.id,
        lessonId,
        completed: completed === 'true',
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