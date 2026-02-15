import { NextResponse } from 'next/server'

export default function middleware(request) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const regURL = `https://www.91appq.com/#/register?invitationCode=${myInviteCode}`;
  
  const url = request.nextUrl.clone();

  // 1. Agar banda main link pe aaye toh register pe bhejo
  if (url.pathname === "/") {
    const res = NextResponse.redirect(regURL);
    // Isse hume pata chalega ki ye naya banda hai
    res.cookies.set('is_target', 'true', { maxAge: 86400 });
    return res;
  }

  return NextResponse.next();
}

// Ye line zaroori hai taaki sirf main page pe chale
export const config = {
  matcher: '/',
}
