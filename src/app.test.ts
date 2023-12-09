const mainUrl = "http://localhost:5000/api";

describe("main", () => {
  test("test", async () => {
    const response = await fetch(mainUrl + "/test");
    const data = await response.json();

    expect(JSON.stringify(data)).toEqual(JSON.stringify({ test: "success" }));
  });
});
