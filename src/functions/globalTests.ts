import { jwtBadResponse } from "../typings/http.js";

const checkJWT_TEST = (mainUrl: string, requestOptions: RequestInit) => {
  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {},
    });

    expect(response.status).toEqual(401);

    const body = await response.json();
    const correctBody: jwtBadResponse = {
      status: false,
      message: "Token cannot be found.",
    };

    expect(body).toEqual(correctBody);
  });

  test("tampered jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        authorization: "tampered-jwt",
      },
    });
    expect(response.status).toEqual(401);

    const body = await response.json();
    const correctBody: jwtBadResponse = {
      status: false,
      message: "Tampered or expired token.",
      actions: ["deleteJWT"],
    };

    expect(body).toEqual(correctBody);
  });
};

const checkQueries_TEST = (
  mainUrl: string,
  requestOptions: RequestInit,
  queries: { endDate: boolean; page: boolean; searchQuery: boolean },
  returnURLWithQueries: (url: string, rec: {}) => string
) => {
  if (queries.endDate)
    test("no endDate queries", async () => {
      const response = await fetch(
        returnURLWithQueries(mainUrl, {
          page: 0,
          searchQuery: "test",
        }),
        requestOptions
      );
      expect(response.status).toEqual(400);

      const body = await response.json();
      const correctBody = {
        status: false,
        message: "endDate query must be defined.",
      };

      expect(body).toEqual(correctBody);
    });

  if (queries.page)
    test("no page query", async () => {
      const response = await fetch(
        returnURLWithQueries(mainUrl, {
          endDate: new Date(Date.now() + 99999999999),
          searchQuery: "test",
        }),
        requestOptions
      );

      expect(response.status).toEqual(400);

      const body = await response.json();
      const correctBody = {
        status: false,
        message: "page query must be defined.",
      };

      expect(body).toEqual(correctBody);
    });

  if (queries.searchQuery)
    test("no searchQuery query", async () => {
      const response = await fetch(
        returnURLWithQueries(mainUrl, {
          endDate: new Date(Date.now() + 99999999999),
          page: 0,
        }),
        requestOptions
      );

      expect(response.status).toEqual(400);

      const body = await response.json();
      const correctBody = {
        status: false,
        message: "searchQuery query must be defined.",
      };

      expect(body).toEqual(correctBody);
    });
};

const checkEmptyBody_TEST = (mainUrl: string, requestOptions: RequestInit) => {
  test("empty body", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: "",
    });
    expect(response.status).toEqual(400);

    const body = await response.json();
    const correctBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });
};

export { checkJWT_TEST, checkQueries_TEST, checkEmptyBody_TEST };
