import { PrismaClient } from "@prisma/client"
import { withIronSessionApiRoute } from "iron-session/next"
import bcrypt from "bcrypt"
import { sessionOptions } from "../../lib/session"

const prisma = new PrismaClient()

async function login(req, res) {
  const data = req.body
  if (req.method === "POST") {
    const admin = await prisma.admins.findUnique({
      where: {
        email: data.email,
      },
    })
    if (admin) {
      if (admin.password === data.password) {
        req.session.user = {
          email: admin.email,
          role: admin.role,
          id: admin.id,
        }
        await req.session.save()
        return res.status(200).send({
          admin: true,
          message: "Admin logged in successfully!",
        })
      }

      return res.status(400).send({
        message: "Invalid Email or Password",
      })
    }

    if (!admin) {
      // const client = await prisma.clients.findUnique({
      const client = await prisma.clients_test.findFirst({
        where: {
          email: req.body.email,
        },
      })
      if (client) {
        const match = await bcrypt.compare(data.password, client.password)
        if (match) {
          req.session.user = {
            email: client.email,
            role: client.role,
            id: client.id,
          }
          await req.session.save()
          return res.status(200).send({
            id: client.id,
            user: true,
            message: "Client logged in successfully!",
          })
        }

        return res.status(400).send({
          message: "Invalid Email or Password",
        })
      }
    }

    return res.status(400).send({
      message: "Invalid Email or Password!",
    })
  }
}

export default withIronSessionApiRoute(login, sessionOptions)
