import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import cuid from "cuid"

const prisma = new PrismaClient()

export default async function clientHandler(req, res) {
  if (req.method === "POST") {
    const data = req.body
    const id = cuid()
    const password = uuidv4()

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const checkClient = await prisma.clients_test.findFirst({
      where: {
        email: data.email,
      },
    })

    if (checkClient) {
      const checkDomain = await prisma.clients_test.findFirst({
        where: {
          company: data.company,
        },
      })

      if (checkDomain) {
        return res.status(400).send({
          message:
            "Domain name already exists for this user! Create a new account",
        })
      }

      const client = await prisma.clients_test.create({
        data: {
          id,
          email: checkClient.email,
          company: data.company,
          password: checkClient.password,
        },
      })
      return res.status(201).send({
        email: client.email,
        company: client.company,
      })
    }

    const client = await prisma.clients_test.create({
      data: {
        id,
        email: data.email,
        company: data.company,
        password: hashPassword,
      },
    })
    return res.status(201).send({
      email: client.email,
      company: client.company,
      password: password,
    })
  }

  if (req.method === "GET") {
    if (req.query.index) {
      const { index } = req.query
      const clients = await prisma.clients_test.findMany({
        take: 5,
        skip: index * 5,
      })

      if (clients) {
        return res.status(200).send(clients)
      }

      return res.status(404).send({
        message: "No clients found!",
      })
    }

    if (req.query.email) {
      const { email } = req.query
      const client = await prisma.clients_test.findMany({
        where: {
          email: email,
        },
        select: {
          email: true,
          company: true,
        },
      })

      if (client) {
        return res.status(200).send(client)
      }

      return res.status(404).send({
        message: "No clients found!",
      })
    }
  }
}