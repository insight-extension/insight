import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";

import { fallbackLanguage, applicationLanguages, cookieName } from "@repo/i18n";

acceptLanguage.languages(applicationLanguages);

export const config = {
  // matcher: '/:language*'
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export function middleware(request: NextRequest) {
  let language;

  if (request.cookies.has(cookieName)) {
    language = acceptLanguage.get(request.cookies.get(cookieName)!.value);
  }

  if (!language) {
    language = acceptLanguage.get(request.headers.get("Accept-Language"));
  }

  if (!language) {
    language = fallbackLanguage;
  }

  // Redirect if language in path is not supported
  if (
    !applicationLanguages.some((applicationLanguage) =>
      request.nextUrl.pathname.startsWith(`/${applicationLanguage}`)
    ) &&
    !request.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${language}${request.nextUrl.pathname}`, request.url)
    );
  }

  if (request.headers.has("referer")) {
    const response = NextResponse.next();

    const refererUrl = new URL(request.headers.get("referer")!);
    const languageInReferer = applicationLanguages.find((applicationLanguage) =>
      refererUrl.pathname.startsWith(`/${applicationLanguage}`)
    );

    if (languageInReferer) {
      response.cookies.set(cookieName, languageInReferer);
    }

    return response;
  }

  return NextResponse.next();
}
