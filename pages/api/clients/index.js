import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import cuid from "cuid"

const prisma = new PrismaClient()

export default async function clientHandler(req, res) {
  const { email, index } = req.query
  if (req.method === "POST") {
    const data = req.body
    const id = cuid()
    const password = uuidv4()

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const checkClient = await prisma.clients.findFirst({
      where: {
        email: data.email,
      },
    })

    if (checkClient) {
      const checkDomain = await prisma.clients.findFirst({
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

      const client = await prisma.clients.create({
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

    const client = await prisma.clients.create({
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
    if (index) {
      const clients = await prisma.clients.findMany({
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

    if (email) {
      const client = await prisma.clients.findMany({
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

  if (req.method === "PUT") {
    if (email) {
      const data = req.body

      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(data.password, salt)

      const client = await prisma.clients.findFirst({
        where: {
          email,
        },
      })

      if (client) {
        const updatePassword = await prisma.clients.updateMany({
          where: {
            email,
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
}
