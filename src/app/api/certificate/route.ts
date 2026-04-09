import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { randomUUID } from 'crypto';

function generateSecureCertNumber(): string {
  return `ISO27001-${Date.now()}-${randomUUID().split('-')[0].toUpperCase()}`;
}

async function calculateActualProgress(userId: string, courseId: string): Promise<number> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: { lessons: true },
      },
    },
  });

  if (!course || !course.modules.length) {
    return 0;
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  
  if (!allLessons.length) {
    return 0;
  }

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessons.map(l => l.id) },
      completed: true,
    },
  });

  return Math.round((completedLessons / allLessons.length) * 100);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Anda harus login' }, { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: 'ID kursus diperlukan' }, { status: 400 });
    }

    // Verify enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Anda belum terdaftar di kursus ini' }, { status: 400 });
    }

    // Calculate ACTUAL server-side progress (don't trust client data)
    const actualProgress = await calculateActualProgress(session.user.id, courseId);

    if (actualProgress < 100) {
      return NextResponse.json({ error: 'Kursus belum selesai' }, { status: 400 });
    }

    const existingCert = await prisma.certificate.findFirst({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    if (existingCert) {
      return NextResponse.json({ error: 'Sertifikat sudah ada' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    const certNumber = generateSecureCertNumber();
    
    const certificate = await prisma.certificate.create({
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

    return NextResponse.json({ 
      message: 'Sertifikat berhasil dibuat', 
      certificate: {
        id: certificate.id,
        certificateNumber: certNumber,
        courseTitle: course?.title,
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
