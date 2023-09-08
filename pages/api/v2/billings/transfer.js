import Billing from "models/Billing"
import Client from "models/Client"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "PUT") {
      const data = req.body

      const client = await Client.findOne({ company: data.client_company })

      if (client) {
        const clientCompany = await Billing.findOne({
          client_company: client.company,
        })

        if (clientCompany) {
          const billing = await Billing.updateOne(
            { client_company: client.company },
            {
              account_number: data.account_number,
              billing_email: data.billing_email,
              bank_name: data.bank_name,
              bank_swift: data.bank_swift,
              bank_address: data.bank_address,
            }
          )

          if (billing) {
            return res.status(200).send({
              message: "Billing details updated successfully!",
            })
          }

          return res.status(400).send({
            message: "Bad request!",
          })
        }

        const billing = await Billing.create(data)

        if (billing) {
          return res.status(201).send({
            message: "Billing details added successfully!",
          })
        }

        return res.status(400).send({
          message: "Bad request!",
        })
      }
    }
  } catch (error) {
    return { message: "This client does not exist!" }
  }
}
