import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { company } = req.query

    // const entry = await prisma.entries.findMany({
    //   where: {
    //     client_company: company,
    //   },
    //   take: 7,
    //   orderBy: {
    //     posted_at: "desc",
    //   },
    // })

    const entry =
      await prisma.$queryRaw`SELECT * FROM entries WHERE client_company = ${company} AND MONTH(posted_at) = MONTH(CURRENT_DATE()) AND YEAR(posted_at) = YEAR(CURRENT_DATE()) ORDER BY posted_at DESC LIMIT 7`

    if (entry) {
      return res.status(200).send(entry)
    }

    return res.status(404).send({
      message: "No entries for this client!",
    })
  }
}
