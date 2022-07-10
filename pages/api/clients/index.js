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

    const checkClient = await prisma.clients.findUnique({
      where: {
        email: data.email,
      },
    })

    if (checkClient) {
      return res.status(400).send({
        message: "User already exists! Create a new user account",
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
    const { index } = req.query
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
}
