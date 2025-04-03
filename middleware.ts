import { authMiddleware } from "next-firebase-auth-edge";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: "AIzaSyDIj7POTzuqY0fB9a5oca58wJzHSQj56Yc",
    cookieName: "AuthToken",
    cookieSignatureKeys: [
      "8bdcb6411da851f7e200af8a77657454373947274d700ffd7882d9ab2e49f3be",
    ],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: false, // Set this to true on HTTPS environments
      sameSite: "lax" as const,
      maxAge: 12 * 60 * 60 * 24, // Twelve days
    },
    serviceAccount: {
      projectId: "test-b9fb4",
      clientEmail: "firebase-adminsdk-mcpjl@test-b9fb4.iam.gserviceaccount.com",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCW0SJUWLg5nIjo\nM6ByQCHAtKVOkBAFLwYLfCnO8WCSh0MQfC26vaSthlJCrHrvh19sA+o12agxIEgk\nj/GqpF20yAgc8a6nGRZFHNbm39McSn/kZqsx0mn7/dRNquv1gIBCrBhOeCoLWU4r\n5J71UsRZlMbEiy8+OtL1D0WJ2EBzVoRvhnxES8H6csTmnNbxEUBF+BASr3fEQX3c\n0DymF9oDx8BWyPa+0mPK+0vBuySoTfGqyBz47630ujO1NHvor1qvMGaxYZVQv5PG\nC6/jQOKbkTfKbjM4Z3i8ZzDrI6jWdE/RwATAihZ6WYcYmUbc7YNvUpkv3VgLd8nx\n5Tyd3WQ9AgMBAAECggEAHPruUxFiQxXIfAARpGqc4cQEoNJPdcOJsJLJEN4yja2G\nrkgCXIgc+QgezfeJPvY/GIkvC+55Yok+u6HaUQ05AWhPoMozIqJQNHMce2xGi4Do\nTuoImvABFB48GbmOklQBMW6S1B9Eiv475nTNs7vWBZWwVSuepiFVEKiA1wJSLidG\nEqA7Yvj3szoY2yfBo+q/cOofwsefo1p/zg+Kn088Jbe56wY90Xt6qWduinTHhVrG\n+jrGFhkXbpe1T/6/hta5JkwjsUZFIm9gSj7cNqUL071l+Y64qjnY1lBIHt0YmYvL\nO4LEXzzy3FzPSGJdjYz6Zik5Us57IunrQPnANzcDUQKBgQDC840Jw5qfxC+Dg5j6\nlCokraqwjd3zI/XtBfi0iuYPtU5VL+pEWrW/mObeup2iHNoJiDsxFpZa7VlNXjZ4\nisx2pJjLRKQQjo0HJAEoPfhLd+L19AkWvGIJm2H/KrtmAn+Ojx3Vc8gARj8NcFc/\nywCwpkBUSbYZV1ZNopdNZcMRTQKBgQDGC4G2iZvfK5Gs6JCiObJDFaPz/SeKBhd4\nneUpxoo8FdT4OGzfFquJXqHuwrGWUk2/sQrB9aWmzvG0o1BVFb79vGnmJ030D/K2\nuGjQR1sw/7SA99N22u8eC8zXJSpYwmUAnhiLPBUXKGAlzxzQEXt5OJHiwM3OcpIc\nhQg8HKEmsQKBgELrFx6i5hCxZx3drkVVVqIAevbfu7AaR/B0fEp84zvBIIJdUCzm\ndjyuX5FUvYdIIA/lk2vmNPZBQsYr8Mav3j9bgJdFmIuWYxJwaXVG0FQXcvC6M+R6\nBa0GiTztjiYV9XMZ7UO32o89jacvSMO9Cx+X8bz9EGTidd1wUj9fDvaBAoGAFdeX\nCsbKhiaL/oH30ayDWJq+Zl55SeO6GvdvGthmzpGp12aBu2kIqjHhsi+O3oFdSdMA\n2Lt69ZbFWaLZbUjks59gHp4fHtfTcQuNo8r658CL691pWSZ0UOAES4Yx0XA/K35E\nPrb1rIQrdoANMXV8JLZ0gIm7KRXBv5t8eQS/UUECgYA+zntWCpSx+4IsbepnAh7D\nK4Z4LMmjpVGi3QFoSRD/kweVgMXLkkRYbiraW9bTw/O2a2LjIDXti/3w9QNbg5sC\nCO7WAC+JECKjXILXng2vWZU0neeyzhGxbpYDtiOSJlnjqAJVkZAu1AxMi3kd4rH7\nb/08BzPr42j7uVK37ZCtPg==\n-----END PRIVATE KEY-----\n",
    },
  });
}

export const config = {
  matcher: [
    "/api/login",
    "/api/logout",
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
  ],
};
