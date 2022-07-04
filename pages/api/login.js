import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function login(req, res) {
  const data = req.body
  if (req.method === "POST") {
    const admin = await prisma.admins.findUnique({
      where: {
        email: data.email,
      },
    })
    if (admin) {
      if (admin.password === data.password) {
        return res.status(200).send({
          role: admin.role,
        })
      }
      return res.status(400).send({
        message: "Invalid Email or Password",
      })
    }

    if (!admin) {
      const client = await prisma.clients.findUnique({
        where: {
          email: req.body.email,
        },
      })
      if (client) {
        const match = await bcrypt.compare(data.password, client.password)
        if (match) {
          return res.status(200).send({
            role: client.role,
            id: client.id,
          })
        }
        return res.status(400).send({
          message: "Invalid Email or Password",
        })
      }
    }
  }
}
