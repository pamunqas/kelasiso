import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ role: null });
  }
  
  return NextResponse.json({ 
    role: session.user.role,
    name: session.user.name 
  });
}