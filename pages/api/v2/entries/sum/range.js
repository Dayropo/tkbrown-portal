import Client from "models/Client"
import Entry from "models/Entry"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "GET") {
      const { email, company, from, to } = req.query

      const client = await Client.findOne({ email, company })

      if (client) {
        const entries = await Entry.aggregate([
          {
            $match: {
              client_email: email,
              client_company: company,
              posted_at: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: "$client_company",
              total_revenue: {
                $sum: "$revenue",
              },
              total_impressions: {
                $sum: "$impressions",
              },
            },
          },
        ])

        return res.status(200).send({
          total_revenue: entries[0].total_revenue,
          total_impressions: entries[0].total_impressions,
        })
      }

      return res.status(400).send({
        message: "Bad Request",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
