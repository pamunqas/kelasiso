import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();

    const lastModule = await prisma.module.findFirst({
      where: { courseId: params.id },
      orderBy: { order: 'desc' },
    });

    const module = await prisma.module.create({
      data: {
        title,
        order: lastModule ? lastModule.order + 1 : 1,
        courseId: params.id,
      },
      include: {
        lessons: true,
      },
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();

    const module = await prisma.module.update({
      where: { id: params.moduleId },
      data: { title },
    });

    return NextResponse.json({ module });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.module.delete({
      where: { id: params.moduleId },
    });

    return NextResponse.json({ message: 'Module deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}