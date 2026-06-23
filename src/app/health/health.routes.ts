import { Router } from "express";
import { pingDB } from "../../common/knex/knex.js";

export const healthRoutes = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Checks if the API server and database are running correctly.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: DB down
 */
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