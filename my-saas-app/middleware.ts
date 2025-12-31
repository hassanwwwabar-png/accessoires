import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('mysaas_userId')?.value;
  const userRole = request.cookies.get('mysaas_role')?.value;
  
  // ✅ جلب حالة الاشتراك
  const subscriptionStatus = request.cookies.get('mysaas_status')?.value;
  
  const { pathname } = request.nextUrl;

  // 1. حماية صفحات الأدمن
  if (pathname.startsWith('/saas-admin')) {
    const isAdmin = userRole === 'super_admin' || userRole === 'admin' || userRole === 'superadmin';
    if (!userId || !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. حماية صفحات الطبيب (Dashboard)
  if (pathname.startsWith('/dashboard')) {
    
    // أ) إذا لم يسجل دخول أصلاً
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ب) ✅✅ إذا كان الحساب موقوفاً (INACTIVE)
    if (subscriptionStatus !== 'ACTIVE') {
      // الصفحات المسموح بها فقط للموقوفين
      const allowedPaths = [
        '/dashboard/subscription', // للدفع
        '/dashboard/support',      // للمراسلة
        '/dashboard/settings',     // لتسجيل الخروج إذا أراد
      ];

      // هل المسار الحالي هو أحد المسارات المسموحة؟
      const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

      // إذا كان يحاول دخول صفحة ممنوعة (مثل المرضى)، نوجهه لصفحة الاشتراك
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard/subscription', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/saas-admin/:path*', 
    '/onboarding/:path*',
    '/login', 
    '/register'
  ],
};