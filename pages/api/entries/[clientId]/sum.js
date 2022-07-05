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

    if (client) {
      const total_revenue =
        await prisma.$queryRaw`SELECT SUM(revenue) AS 'total_revenue' FROM entries WHERE client_id = ${clientId}`
      const total_impressions =
        await prisma.$queryRaw`SELECT SUM(impressions) AS 'total_impressions' FROM entries WHERE client_id = ${clientId}`

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
