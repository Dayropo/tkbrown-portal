import Client from "models/Client"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "GET") {
      const { email, company } = req.query

      const client = await Client.findOne({ email, company }, "email company")

      if (client) {
        return res.status(200).send(client)
      }

      return res.status(404).send({
        message: "No clients found!",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
