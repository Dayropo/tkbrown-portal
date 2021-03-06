import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { clientId } = req.query

    const client = await prisma.clients.findUnique({
      where: {
        id: clientId,
      },
    })

    if (client) {
      return res.status(200).send(client)
    }

    return res.status(404).send({
      message: "This client does not exist!",
    })
  }

  if (req.method === "PUT") {
    const { clientId } = req.query
    const data = req.body

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(data.password, salt)

    const client = await prisma.clients.findUnique({
      where: {
        id: clientId,
      },
    })

    if (client) {
      const updatePassword = await prisma.clients.update({
        where: {
          id: clientId,
        },
        data: {
          password: hashPassword,
        },
      })

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
}
