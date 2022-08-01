import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { email, company } = req.query

  if (req.method === "GET") {
    if (email && company) {
      const client = await prisma.clients.findFirst({
        where: {
          email,
          company,
        },
        select: {
          email: true,
          company: true,
        },
      })

      if (client) {
        return res.status(200).send(client)
      }

      return res.status(404).send({
        message: "No clients found!",
      })
    }

    return res.status(400).send({
      message: "Bad Request!",
    })
  }
}
