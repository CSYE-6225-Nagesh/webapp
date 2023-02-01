import request from "supertest";
import app from "./server.js";

describe("Check APIs", function () {
  const mockApp = request(app);
  test("Check if API is working", async function () {
    const response = await mockApp.get("/healthz");
    expect(response.status).toEqual(200);
  });

  test("Check if GET user API is working", async function () {
    const response = await mockApp.get("/v1/user/1");
    expect(response.status).toEqual(403);
  });

  test("Check if POST user API sending bad request", async function () {
    const response = await mockApp.post("/v1/user");
    expect(response.status).toEqual(400);
  });

  test("Check if POST user API sending bad request", async function () {
    const response = await mockApp.put("/v1/user/1");
    expect(response.status).toEqual(401);
  });
});
