import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { clientId, index } = req.query

    if (index) {
      const entry = await prisma.entries.findMany({
        where: {
          client_id: clientId,
        },
        take: 7,
        skip: index * 7,
        orderBy: {
          posted_at: "asc",
        },
      })

      if (entry) {
        return res.status(200).send(entry)
      }

      return res.status(404).send({
        message: "No entries for this client!",
      })
    }

    const entry = await prisma.entries.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: {
        posted_at: "asc",
      },
    })

    if (entry) {
      return res.status(200).send(entry)
    }

    return res.status(404).send({
      message: "No entries for this client!",
    })
  }
}
