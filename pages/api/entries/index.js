import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body
    const revenue = data.revenue
    const impressions = data.impressions
    const eCPM = (revenue / impressions) * 1000

    const client = await prisma.clients.findFirst({
      where: {
        company: data.client_company,
      },
    })

    if (client) {
      const entry = await prisma.entries.create({
        data: {
          posted_at: data.posted_at,
          client_id: client.id,
          client_email: client.email,
          client_company: data.client_company,
          revenue,
          impressions,
          eCPM,
        },
      })

      if (entry) {
        return res.status(201).send({
          message: "Entry created successfully!",
        })
      }
    }
  }

  if (req.method === "GET") {
    const { index } = req.query
    const entries = await prisma.entries.findMany({
      take: 7,
      skip: index * 7,
      orderBy: {
        posted_at: "desc",
      },
    })

    if (entries) {
      return res.status(200).send(entries)
    }

    return res.status(404).send({
      message: "No entries found!",
    })
  }
}
