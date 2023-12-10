import { decodeJWTPayload, verifyJWTSignature } from "../functions/jwt.js";
function validateJWT_MW(req, res, next) {
    const jwtToken = req.headers.authorization;
    if (jwtToken === undefined) {
        res
            .status(401)
            .json({
            status: false,
            message: "Token cannot be found.",
        })
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
    })
        .end();
    return;
}
export { validateJWT_MW };
