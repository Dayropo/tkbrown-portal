import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { company } = req.query

    const entry = await prisma.entries.findMany({
      where: {
        client_company: company,
      },
      take: 30,
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