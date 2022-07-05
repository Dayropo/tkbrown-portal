import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const data = req.body
    const { clientId } = req.query

    const client = await prisma.clients.findUnique({
      where: {
        id: clientId,
      },
    })

    if (client) {
      const paypal = await prisma.billings.findUnique({
        where: {
          paypal_email: data.paypal_email,
        },
      })

      if (!paypal) {
        const billing = await prisma.billings.create({
          data,
        })

        if (billing) {
          return res.status(201).send({
            message: "Billing details added successfully!",
          })
        }
      }

      const billing = await prisma.billings.update({
        where: {
          paypal_email: data.paypal_email,
        },
        data,
      })

      if (billing) {
        return res.status(204).send({
          message: "Billing details updated successfully!",
        })
      }
    }

    return res.status(400).send({
      message: "Bad request!",
    })
  }
}
