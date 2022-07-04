import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { clientId } = req.query

    const client = await prisma.clients.findUnique({
      where: {
        id: clientId,
      },
    })

    return res.status(200).send(client)
  }
}
