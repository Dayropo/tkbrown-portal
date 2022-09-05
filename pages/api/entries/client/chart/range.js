import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { company, from, to } = req.query

    const entry =
      //   await prisma.$queryRaw`SELECT * FROM entries WHERE client_company = ${company} AND posted_at > now() - INTERVAL 7 day`
      await prisma.$queryRaw`SELECT * FROM entries WHERE client_company = ${company} AND posted_at BETWEEN ${from} AND ${to}`

    if (entry) {
      return res.status(200).send(entry)
    }

    return res.status(404).send({
      message: "No entries for this client!",
    })
  }
}
