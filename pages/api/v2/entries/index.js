import Client from "models/Client"
import Entry from "models/Entry"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "POST") {
      const data = req.body
      const revenue = data.revenue
      const impressions = data.impressions
      const eCPM = (revenue / impressions) * 1000

      const client = await Client.findOne({ company: data.client_company })

      if (client) {
        const entry = await Entry.create({
          posted_at: data.posted_at,
          client_id: client.id,
          client_email: client.email,
          client_company: data.client_company,
          revenue,
          impressions,
          eCPM,
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
      const entries = await Entry.find({})
        .limit(7)
        .skip(index * 7)
        .sort({ posted_at: -1 })

      if (entries) {
        return res.status(200).send(entries)
      }

      return res.status(404).send({
        message: "No entries found!",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
