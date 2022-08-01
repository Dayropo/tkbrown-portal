import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { company } = req.query

    // const entry = await prisma.entries.findMany({
    //   where: {
    //     client_company: company,
    //   },
    //   orderBy: {
    //     posted_at: "asc",
    //   },
    // })

    const entry =
      await prisma.$queryRaw`SELECT * FROM entries WHERE client_company = ${company} AND MONTH(posted_at) = (MONTH(CURRENT_DATE()) - 1) AND YEAR(posted_at) = YEAR(CURRENT_DATE())`

    if (entry) {
      return res.status(200).send(entry)
    }

    return res.status(404).send({
      message: "No entries for this client!",
    })
  }
}
