import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  //post
  if (req.method === "POST") {
    const data = req.body

    // check if invoice exists
    const checkInvoice = await prisma.invoices.findFirst({
      where: {
        invoice_number: data.invoice_number,
      },
    })

    if (checkInvoice) {
      return res.status(400).send({
        message: "Invoice with this invoice number already exists.",
      })
    }

    const invoice = await prisma.invoices.create({
      data: {
        invoice_number: data.invoice_number,
        period: data.period,
        amount: data.amount,
        client_email: data.client_email,
        client_domain: data.client_domain,
        status: data.status,
      },
    })

    if (invoice) {
      return res.status(201).send({
        message: "Invoice created successfully.",
      })
    }

    return res.status(500).send({
      message: "An error occurred. Please try again later.",
    })
  }

  //get
  if (req.method === "GET") {
    const { client_email, client_domain, index } = req.query

    if (client_email && client_domain) {
      const invoice = await prisma.invoices.findMany({
        where: {
          client_email,
          client_domain,
        },
        take: 5,
        skip: index * 5,
      })

      if (invoice) {
        return res.status(200).send(invoice)
      }

      return res.status(404).send({
        message: "No invoices for this domain!",
      })
    }

    if (index) {
      const invoice = await prisma.invoices.findMany({
        take: 5,
        skip: index * 5,
      })

      if (invoice) {
        return res.status(200).send(invoice)
      }

      return res.status(404).send({
        message: "No clients found!",
      })
    }
  }

  //put
  if (req.method === "PUT") {
    const data = req.body

    const invoice = await prisma.invoices.update({
      where: {
        id: data.id,
      },
      data: {
        invoice_number: data.invoice_number,
        period: data.period,
        amount: data.amount,
        client_email: data.client_email,
        client_domain: data.client_domain,
        status: data.status,
      },
    })

    if (invoice) {
      return res.status(201).send({
        message: "Invoice updated successfully.",
      })
    }

    return res.status(500).send({
      message: "An error occurred. Please try again later.",
    })
  }
}
