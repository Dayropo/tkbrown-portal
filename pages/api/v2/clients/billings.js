import Billing from "models/Billing"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "GET") {
      const billings = await Billing.find()

      if (billings) {
        return res.status(200).send(billings)
      }
    }
  } catch (error) {
    return { message: "No data found!" }
  }
}
