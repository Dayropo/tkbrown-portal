import Invoice from "models/Invoice"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "POST") {
      const data = req.body

      const checkInvoice = await Invoice.findOne({
        invoice_number: data.invoice_number,
      })

      if (checkInvoice) {
        return res.status(400).send({
          message: "Invoice with this invoice number already exists.",
        })
      }

      const invoice = await Invoice.create({
        invoice_number: data.invoice_number,
        period: data.period,
        amount: data.amount,
        client_email: data.client_email,
        client_domain: data.client_domain,
        status: data.status,
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

    if (req.method === "GET") {
      const { client_email, client_domain, index } = req.query

      if (client_email && client_domain) {
        const invoices = await Invoice.find({ client_email, client_domain })
          .limit(5)
          .skip(index * 5)

        if (invoices) {
          return res.status(200).send(invoices)
        }

        return res.status(404).send({
          message: "No invoices for this domain!",
        })
      }

      if (index) {
        const invoices = await Invoice.find({})
          .limit(5)
          .skip(index * 5)

        if (invoices) {
          return res.status(200).send(invoices)
        }

        return res.status(404).send({
          message: "No clients found!",
        })
      }
    }

    if (req.method === "PUT") {
      const data = req.body

      const checkInvoice = await Invoice.findOne({
        _id: data._id,
      })

      if (checkInvoice) {
        const invoice = await Invoice.updateOne(
          { _id: checkInvoice._id },
          {
            invoice_number: data.invoice_number,
            period: data.period,
            amount: data.amount,
            client_email: data.client_email,
            client_domain: data.client_domain,
            status: data.status,
          }
        )

        if (invoice) {
          return res.status(201).send({
            message: "Invoice updated successfully.",
          })
        }

        return res.status(500).send({
          message: "An error occurred. Please try again later.",
        })
      }

      return res.status(400).send({
        message: "Bad request!",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
