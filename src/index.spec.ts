import { get, path, method, params } from "./index";
import { Request, Response } from "servie/dist/node";
import { send } from "servie-send";
import { finalhandler } from "servie-finalhandler";

describe("servie-route", () => {
  describe("using path", () => {
    const app = path<Request, Response>("/test", req =>
      send(req, "hello world")
    );

    it("should match", async () => {
      const req = new Request("/test", { method: "test" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(200);
    });

    it("should not match", async () => {
      const req = new Request("/other", { method: "test" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(404);
    });
  });

  describe("using method", () => {
    const app = method<Request, Response>("POST", req =>
      send(req, "hello world")
    );

    it("should match", async () => {
      const req = new Request("/test", { method: "post" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(200);
    });

    it("should not match", async () => {
      const req = new Request("/other", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(404);
    });
  });

  describe("using shorthand", () => {
    const app = get<Request, Response>("/test", req =>
      send(req, "hello world")
    );

    it("should match", async () => {
      const req = new Request("/test", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(200);
    });

    it("should not match on invalid path", async () => {
      const req = new Request("/", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toEqual(404);
    });

    it("should not match on invalid method", async () => {
      const req = new Request("/test", { method: "delete" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toBe(404);
    });
  });

  describe("parameters", () => {
    const app = get<Request, Response, { id: string }>("/:id", req => {
      return new Response(req[params].id);
    });

    it("should expose parameters", async () => {
      const req = new Request("/1", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(await res.text()).toEqual("1");
    });

    it("should decode parameters", async () => {
      const req = new Request("/caf%C3%A9", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(await res.text()).toEqual("café");
    });
  });

  describe("unicode paths", () => {
    const app = get("/café", req => {
      return new Response(req.url);
    });

    it("should match", async () => {
      const req = new Request("/caf%C3%A9", { method: "get" });
      const res = await app(req, finalhandler(req));

      expect(res.status).toEqual(200);
      expect(await res.text()).toEqual("/caf%C3%A9");
    });
  });
});
