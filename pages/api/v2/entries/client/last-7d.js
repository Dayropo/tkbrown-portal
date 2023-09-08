import Entry from "models/Entry"
import dbConnect from "utils/dbConnect"
import { addDays, format, startOfDay, endOfDay } from "date-fns"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "GET") {
      const { company } = req.query
      const from = format(startOfDay(addDays(new Date(), -6)), "yyyy-MM-dd")
      const to = format(endOfDay(new Date()), "yyyy-MM-dd")

      const entry = await Entry.find({
        client_company: company,
        posted_at: { $gte: from, $lte: to },
      })
        .limit(7)
        .sort({ posted_at: -1 })

      if (entry) {
        return res.status(200).send(entry)
      }

      return res.status(404).send({
        message: "No entries for this client!",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
