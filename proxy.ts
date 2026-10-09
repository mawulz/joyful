import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth"; 

export default async function proxy(request: NextRequest) {
    const session = await getSession()

    const isProfilePage = request.nextUrl.pathname.startsWith("/profile")
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard")
    if (isProfilePage && !session?.user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isDashboardPage && !session?.user) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
    
    const isSignInPage = request.nextUrl.pathname.startsWith("/login")
    const isSignUpPage = request.nextUrl.pathname.startsWith("/register")

    if((isSignUpPage || isSignInPage) && session?.user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}