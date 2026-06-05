import {Router} from "express";

import {pingDB} from "../../common/knex/knex.js";

export const healthRoutes = Router();

healthRoutes.get("/", async (_req, res) => {
  try {
    await pingDB();
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("DB health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "DB down",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});