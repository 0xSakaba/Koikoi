import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/users/me/spending:
 *   get:
 *     description: Get user's spending wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: hello world
 */
export function GET() {
  return NextResponse.json({ success: true });
}
