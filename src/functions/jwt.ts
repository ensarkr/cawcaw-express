import "dotenv/config";
import { user } from "../typings/database.js";
import crypto from "crypto";

function createJWT(user: user) {
  // * 2 months
  const expirationTimeInMS = 60 * 60 * 24 * 60;

  const issuer = "express";
  const subject = user.username;
  const issuedAt = Date.now();
  const expirationTime = issuedAt + expirationTimeInMS;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: issuer,
    sub: subject,
    iat: issuedAt,
    exp: expirationTime,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  };

  const secretKey = process.env.JWT_SECRET as string;

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64"
  );

  const signatureInput = encodedHeader + "." + encodedPayload;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureInput)
    .digest("base64");

  const token = signatureInput + "." + signature;

  return token;
}

function verifyJWTSignature(token: string): boolean {
  const secretKey = process.env.JWT_SECRET as string;

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  const signatureInput = encodedHeader + "." + encodedPayload;

  const correctSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureInput)
    .digest("base64");

  if (
    correctSignature === signature &&
    decodeJWTPayload(token).exp > Date.now()
  ) {
    return true;
  }

  return false;
}

function decodeJWTPayload(token: string) {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  return JSON.parse(
    Buffer.from(encodedPayload, "base64").toString("utf-8")
  ) as {
    iss: string;
    sub: string;
    iat: number;
    exp: number;
    userId: number;
    username: string;
    displayName: string;
  };
}

export { createJWT, verifyJWTSignature, decodeJWTPayload };
