'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface UserNavProps {
  userName: string;
  currentPage?: string;
}

export default function UserNav({ userName, currentPage }: UserNavProps) {
  const isAdmin = currentPage === 'admin';
  
  return (
    <nav className="flex gap-4 items-center">
      {!isAdmin && (
        <>
          <Link 
            href="/dashboard" 
            className={`text-blue-600 hover:underline ${currentPage === 'dashboard' ? 'font-bold' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/courses" 
            className={`text-blue-600 hover:underline ${currentPage === 'courses' ? 'font-bold' : ''}`}
          >
            Kursus
          </Link>
          <Link 
            href="/certificates" 
            className={`text-blue-600 hover:underline ${currentPage === 'certificates' ? 'font-bold' : ''}`}
          >
            Sertifikat
          </Link>
        </>
      )}
      <span className="text-gray-600">{userName}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-red-600 hover:underline"
      >
        Keluar
      </button>
    </nav>
  );
}