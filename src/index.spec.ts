import { compose } from "throwback";
import { get } from "./index";
import { Request, Response } from "servie/dist/node";
import { send } from "servie-send";
import { finalhandler } from "servie-finalhandler";

describe("servie-route", () => {
  it("should match a route", async () => {
    const app = compose([
      get<Request, Response>("/test", req => send(req, "hello world"))
    ]);

    const req = new Request("/test", { method: "get" });
    const res = await app(req, finalhandler(req));

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("hello world");
  });

  it("should not match when path does not equal", async () => {
    const app = compose([
      get<Request, Response>("/test", req => send(req, "hello world"))
    ]);

    const req = new Request("/", { method: "get" });
    const res = await app(req, finalhandler(req));

    expect(res.status).toEqual(404);
  });

  it("should not match when method does not equal", async () => {
    const app = compose([
      get<Request, Response>("/test", req => send(req, "hello world"))
    ]);

    const req = new Request("/test", { method: "delete" });
    const res = await app(req, finalhandler(req));

    expect(res.status).toBe(404);
  });

  it("should work with parameters", async () => {
    const animals = ["rabbit", "dog", "cat"];

    const app = compose([
      get("/pets", function() {
        return new Response(animals.join("\n"));
      }),
      get("/pets/:id", function(req) {
        return new Response(animals[Number(req.params[0])]);
      })
    ]);

    const req = new Request("/pets/1", { method: "get" });
    const res = await app(req, finalhandler(req));

    expect(await res.text()).toEqual("dog");
  });
});
