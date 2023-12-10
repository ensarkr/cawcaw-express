import { sql } from "@vercel/postgres";
import "dotenv/config";

const mainUrl = "http://localhost:5000/api";

describe("main", () => {
  test("express is working", async () => {
    const response = await fetch(mainUrl + "/test");
    const data = await response.json();

    expect(JSON.stringify(data)).toEqual(JSON.stringify({ test: "success" }));
  });

  test("database is working", async () => {
    const response = await sql`SELECT * FROM cawcaw_users`;

    expect(response.fields.length > 0).toEqual(true);
  });
});
