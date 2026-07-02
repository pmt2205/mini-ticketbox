'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

export function AdminRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.role === 'ADMIN' && pathname !== '/admin') {
      router.replace('/admin');
    }
  }, [pathname, router, user?.role]);

  return null;
}
