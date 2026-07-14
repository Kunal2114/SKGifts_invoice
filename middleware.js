export { default } from 'next-auth/middleware';

// Only the dashboard pages need this — API routes check the session
// themselves (via requireSession) so they can return a clean 401 JSON
// response instead of an HTML redirect.
export const config = {
  matcher: ['/dashboard/:path*']
};
