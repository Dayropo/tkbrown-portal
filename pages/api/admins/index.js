import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function createAdmin(req, res) {
  const data = req.body
  const password = uuidv4()
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)

  if (req.method === "POST") {
    const checkAdmin = await prisma.admins.findUnique({
      where: {
        email: data.email,
      },
    })

    if (checkAdmin) {
      return res.status(400).send({
        message:
          "Admin already exists! Proceed to login or create an account with a new email address",
      })
    }

    const admin = await prisma.admins.create({
      email: data.email,
      password: hashPassword,
    })
    return res.status(201).send({
      email: admin.email,
      password: password,
    })
  }
}
