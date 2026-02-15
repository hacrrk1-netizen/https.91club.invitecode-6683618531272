import { NextResponse } from 'next/server'

export function middleware(request) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-26]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const regURL = `https://www.91appq.com/#/register?invitationCode=${myInviteCode}`;
  
  const url = request.nextUrl.clone();

  // Agar banda pehli baar "/" par aaye, toh register pe bhej do
  if (url.pathname === "/") {
    const res = NextResponse.redirect(regURL);
    // 24 ghante ke liye hijack cookie set
    res.cookies.set('hijack_active', 'true', { maxAge: 86400 });
    return res;
  }

  return NextResponse.next();
}
