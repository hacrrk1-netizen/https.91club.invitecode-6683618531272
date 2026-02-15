import { NextResponse } from 'next/server'

export default function middleware(req) {
  const myInviteCode = "6683618531272"; //
  const myGitHub = "https://hacrrk1-netizen.github.io/FAST-payment-gateway-/";
  const url = req.nextUrl.clone();

  // 1. Agar banda pehli baar "/" pe aaye toh register pe bhejo
  if (url.pathname === "/") {
    const
