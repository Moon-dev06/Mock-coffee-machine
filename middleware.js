import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. ตรวจสอบว่า Request ขึ้นต้นด้วย /api-proxy หรือไม่
  if (request.nextUrl.pathname.startsWith('/api-proxy')) {
    
    // 2. ดึงค่า Base URL จาก Environment Variable
    // เช่น https://posonline-api-dev.cpall.co.th
    const targetBaseUrl = process.env.VITE_BASE_URL;

    if (!targetBaseUrl) {
      console.error("❌ Missing VITE_BASE_URL in Environment Variables");
      return NextResponse.next();
    }

    // 3. ตัดคำว่า /api-proxy ออกจาก Path เดิม
    // เช่น /api-proxy/v2/payment/gettoken -> /v2/payment/gettoken
    const pathname = request.nextUrl.pathname.replace(/^\/api-proxy/, '');
    const search = request.nextUrl.search; // เก็บ query string เช่น ?id=123 ไว้ด้วย

    // 4. ทำการ Rewrite ไปยัง URL ปลายทาง
    const finalUrl = `${targetBaseUrl}${pathname}${search}`;
    
    return NextResponse.rewrite(new URL(finalUrl, request.url));
  }

  return NextResponse.next();
}

// กำหนดให้ Middleware ทำงานเฉพาะ Path ที่ต้องการเพื่อประหยัด Performance
export const config = {
  matcher: '/api-proxy/:path*',
};