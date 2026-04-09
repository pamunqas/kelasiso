import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

const SKIP_AUTH = true;

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    if (!SKIP_AUTH) {
      const session = await auth();
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Pelajaran tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    if (!SKIP_AUTH) {
      const session = await auth();
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { title, type, content, videoUrl } = await request.json();

    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
      },
    });

    return NextResponse.json({ lesson });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    if (!SKIP_AUTH) {
      const session = await auth();
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await prisma.lesson.delete({
      where: { id: params.lessonId },
    });

    return NextResponse.json({ message: 'Lesson deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}