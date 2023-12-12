import { NextFunction, Request, Response } from "express";
import { decodeJWTPayload, verifyJWTSignature } from "../functions/jwt.js";
import { jwtBadResponse } from "../typings/http.js";

function validateJWT_MW(req: Request, res: Response, next: NextFunction) {
  const jwtToken = req.headers.authorization;

  if (jwtToken === undefined) {
    res
      .status(401)
      .json({
        status: false,
        message: "Token cannot be found.",
      } as jwtBadResponse)
      .end();
    return;
  }

  if (verifyJWTSignature(jwtToken)) {
    const payload = decodeJWTPayload(jwtToken);
    res.locals.userId = payload.userId;
    next();
    return;
  }

  res
    .status(401)
    .json({
      status: false,
      message: "Tampered or expired token.",
      actions: ["deleteJWT"],
    } as jwtBadResponse)
    .end();
  return;
}

function validateJWTPassThrough_MW(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtToken = req.headers.authorization;

  if (jwtToken !== undefined && verifyJWTSignature(jwtToken)) {
    const payload = decodeJWTPayload(jwtToken);
    res.locals.userId = payload.userId;
  }

  next();
  return;
}

export { validateJWT_MW, validateJWTPassThrough_MW };
