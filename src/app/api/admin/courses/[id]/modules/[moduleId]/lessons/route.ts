import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

const SKIP_AUTH = true;

export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    if (!SKIP_AUTH) {
      const session = await auth();
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    console.log('POST lessons - body:', body);

    const { title, type, content, videoUrl } = body;

    if (!title) {
      return NextResponse.json({ error: 'Judul diperlukan' }, { status: 400 });
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'desc' },
    });

    const lesson = await prisma.lesson.create({
      data: {
        title,
        type: type || 'TEXT',
        content: content || '',
        videoUrl: videoUrl || '',
        order: lastLesson ? lastLesson.order + 1 : 1,
        moduleId: params.moduleId,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan: ' + String(error) }, { status: 500 });
  }
}