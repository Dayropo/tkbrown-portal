import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { clientId } = req.query

    const entry = await prisma.entries.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: {
        posted_at: "asc",
      },
    })

    return res.status(200).send(entry)
  }
}
