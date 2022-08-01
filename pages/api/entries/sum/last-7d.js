import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email, company } = req.query

    const client = await prisma.clients.findFirst({
      where: {
        email,
        company,
      },
    })

    if (client) {
      const total_revenue =
        await prisma.$queryRaw`SELECT SUM(revenue) AS 'total_revenue' FROM entries WHERE client_email = ${email} AND client_company = ${company} AND posted_at > now() - INTERVAL 7 day`
      const total_impressions =
        await prisma.$queryRaw`SELECT SUM(impressions) AS 'total_impressions' FROM entries WHERE client_email = ${email} AND client_company = ${company} AND posted_at > now() - INTERVAL 7 day`

      return res.status(200).send({
        total_revenue: total_revenue[0].total_revenue,
        total_impressions: total_impressions[0].total_impressions,
      })
    }

    return res.status(400).send({
      message: "Bad Request",
    })
  }
}
