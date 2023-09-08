import Entry from "models/Entry"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "GET") {
      const { company } = req.query

      const entry = await Entry.find({ client_company: company })
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
