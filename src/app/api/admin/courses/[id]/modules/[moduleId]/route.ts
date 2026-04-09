import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
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
    await prisma.module.delete({
      where: { id: params.moduleId },
    });

    return NextResponse.json({ message: 'Module deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}