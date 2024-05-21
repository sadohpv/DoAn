import { NextResponse, type NextRequest } from "next/server";
import { privateRoutes, publicRoutes } from "./utility/routes/routes";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const privateRouters = privateRoutes;
    const publicRouters = publicRoutes;


    if (publicRouters.includes(path)) {
        //If is public path
        return NextResponse.next();
    } else {
        if (request.cookies.get("accessToken")) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
    // matcher: ["/", "/:user*"],
};
