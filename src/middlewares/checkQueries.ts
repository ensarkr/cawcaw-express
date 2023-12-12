import { NextFunction, Request, Response } from "express";

function checkQueries_MW(queries: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (let i = 0; i < queries.length; i++) {
      if (req.query[queries[i]] === undefined) {
        res
          .status(400)
          .json({ status: false, message: queries[i] + " query must be defined." })
          .end();
        return;
      }
    }
    next();
  };
}

export { checkQueries_MW };
