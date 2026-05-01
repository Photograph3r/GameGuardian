import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '1337204989819130959';

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'gameguardian',
  path: 'auth/callback',
});

const DISCOVERY = {
  authorizationEndpoint: 'https://apis.roblox.com/oauth/v1/authorize',
  tokenEndpoint: 'https://apis.roblox.com/oauth/v1/token',
  revocationEndpoint: 'https://apis.roblox.com/oauth/v1/token/revoke',
};

export interface RobloxTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export interface RobloxUser {
  sub: string;
  name: string;
  nickname: string;
  preferred_username: string;
  profile: string;
  picture: string;
}

export async function generateCodeVerifier(): Promise<string> {
  const random = await Crypto.getRandomBytesAsync(32);
  return btoa(String.fromCharCode(...random))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<RobloxTokens> {
  const response = await fetch('https://apis.roblox.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      code_verifier: codeVerifier,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
  };
}

export async function fetchRobloxUser(accessToken: string): Promise<RobloxUser> {
  const response = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error('Failed to fetch Roblox user info');
  return response.json();
}

export { CLIENT_ID, REDIRECT_URI, DISCOVERY };