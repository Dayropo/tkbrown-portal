import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import cuid from "cuid"
import dbConnect from "utils/dbConnect"
import Client from "models/Client"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "POST") {
      const data = req.body
      const id = cuid()
      const password = uuidv4()

      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(password, salt)

      const checkClient = await Client.findOne({ email: data.email })

      if (checkClient) {
        const checkDomain = await Client.findOne({
          email: data.email,
          company: data.company,
        })

        if (checkDomain) {
          return res.status(400).send({
            message:
              "Domain name already exists for this user! Create a new account",
          })
        }

        const client = await Client.create({
          email: checkClient.email,
          company: data.company,
          password: checkClient.password,
        })

        return res.status(201).send({
          email: client.email,
          company: client.company,
        })
      }

      const client = await Client.create({
        email: data.email,
        company: data.company,
        password: hashPassword,
      })

      return res.status(201).send({
        email: client.email,
        company: client.company,
        password: password,
      })
    }

    if (req.method === "GET") {
      const { email, index } = req.query

      if (email) {
        const client = await Client.find({ email }, "email company")

        if (client) {
          return res.status(200).send(client)
        }

        return res.status(404).send({
          message: "No clients found!",
        })
      }

      if (index) {
        const clients = await Client.find({})
          .limit(5)
          .skip(index * 5)

        if (clients) {
          return res.status(200).send(clients)
        }

        return res.status(404).send({
          message: "No clients found!",
        })
      }
    }

    if (req.method === "PUT") {
      const { email } = req.query
      const data = req.body

      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(data.password, salt)

      const client = await Client.findOne({ email })

      if (client) {
        const updatePassword = await Client.updateOne(
          { email },
          { password: hashPassword }
        )

        if (updatePassword) {
          return res.status(201).send({
            message: "Password updated successfully!",
          })
        }

        return res.status(400).send({
          message: "Bad Request!",
        })
      }

      return res.status(404).send({
        message: "This client does not exist!",
      })
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
