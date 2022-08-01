import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const data = req.body

    const client = await prisma.clients.findFirst({
      where: {
        company: data.company,
      },
    })

    if (client) {
      const clientCompany = await prisma.billings.findFirst({
        where: {
          client_company: data.company,
        },
      })

      if (clientCompany) {
        const billing =
          await prisma.$queryRaw`UPDATE billings SET billing_email = ${data.billing_email}, paypal_email = ${data.paypal_email} WHERE client_company = ${data.client_company}`

        if (billing) {
          return res.status(200).send({
            message: "Billing details updated successfully!",
          })
        }

        return res.status(400).send({
          message: "Bad request!",
        })
      }

      const billing = await prisma.billings.create({
        data,
      })

      if (billing) {
        return res.status(201).send({
          message: "Billing details added successfully!",
        })
      }

      return res.status(400).send({
        message: "Bad request!",
      })
    }

    return res.status(404).send({
      message: "This client does not exist!",
    })
  }
}
