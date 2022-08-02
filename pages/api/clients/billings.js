import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const billings = await prisma.billings.findMany()
    if (billings) {
      return res.status(200).send(billings)
    }

    return res.status(404).send({
      message: "No data found!",
    })
  }
}
