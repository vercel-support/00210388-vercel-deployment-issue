import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

interface CustomClaims {
  onboarded: boolean;
}

// TODO: still need a better fix for the API endpoints
export default authMiddleware({
  publicRoutes: ['/auth/sign-in', '/auth/sign-up'],
  ignoredRoutes: ['/api/cron(.*)', '/api/webhooks(.*)', '/en/api/cron(.*)', '/api/admin(.*)'],
  apiRoutes: ['/api/(.*)'],
  async afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    if (auth.userId && !(auth.isPublicRoute || auth.isApiRoute)) {
      const claims = auth.sessionClaims;
      const metadata = claims && (claims.public_metadata as CustomClaims | undefined);
      const onboarded = metadata && metadata.onboarded;
      const registerUrl = new URL('/auth/register?onboard=profession', req.url);
      if (!onboarded && req.url != registerUrl.toString()) {
        return Response.redirect(registerUrl);
      }
    }
  },
});
