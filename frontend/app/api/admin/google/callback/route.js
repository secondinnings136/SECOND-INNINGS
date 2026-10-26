import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/admin?google_error=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${origin}/admin?google_error=${encodeURIComponent('Missing Google OAuth code or state')}`
    );
  }

  const backendApiBase = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  ).replace(/\/+$/, '');

  try {
    const callbackUrl = `${backendApiBase}/admin/google/callback?code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(state)}&format=json`;

    const resp = await fetch(callbackUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok || !data.success) {
      const errMsg = data.error || 'Failed to complete Google Calendar OAuth handshake';
      return NextResponse.redirect(
        `${origin}/admin?google_error=${encodeURIComponent(errMsg)}`
      );
    }

    const emailParam = data.data?.connectedEmail || '';
    return NextResponse.redirect(
      `${origin}/admin?google_connected=true&email=${encodeURIComponent(emailParam)}`
    );
  } catch (err) {
    return NextResponse.redirect(
      `${origin}/admin?google_error=${encodeURIComponent(
        err.message || 'Network error contacting backend OAuth callback'
      )}`
    );
  }
}
