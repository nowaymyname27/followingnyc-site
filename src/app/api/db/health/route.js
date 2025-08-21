import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.photo.count();
  return Response.json({ ok: true, photos: count });
}
