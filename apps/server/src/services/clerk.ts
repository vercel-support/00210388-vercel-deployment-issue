import jwt from "jsonwebtoken";
import jwkToPem from 'jwk-to-pem';

 
export async function validateToken(token: string) {
  const kid = getKeyIdFromToken(token);
  const publicKey = (await getJWKS())[kid];
  if (token === undefined) {
    throw new Error("No token provided");
  }
  if (publicKey === undefined) {
    throw new Error("No public key provided");
  }
  try {
    const decoded = jwt.verify(token, publicKey) as jwt.JwtPayload;
    const exp = decoded["exp"]
    if (exp && exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }
    return decoded["sub"]
  } catch (error) {
    throw new Error("Invalid token");
  }
}

let jwksCache: Record<string, string> | null = null;

export async function getJWKS() {
    if (jwksCache) {
        return jwksCache;
    }
    const secretKey = process.env.CLERK_SECRET_KEY;
    const response = await fetch(
        `https://api.clerk.com/v1/jwks`,
        {
        headers: {
            Authorization: `Bearer ${secretKey}`,
        },
        }
    );
    const jwks = await response.json();
    let publicKeys: Record<string, string> = {};
    for (const jwk of jwks.keys) {
        const kid = jwk.kid as string;
        publicKeys[kid] = jwkToPem(jwk);
    }
    jwksCache = publicKeys;
    return publicKeys;
}

export function getKeyIdFromToken(token: string) {
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header.kid;
    if (!kid) {
        throw new Error("No kid in token");
    }
    return kid
}
    
