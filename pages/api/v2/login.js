import { withIronSessionApiRoute } from "iron-session/next"
import bcrypt from "bcrypt"
import dbConnect from "utils/dbConnect"
import Admin from "models/Admin"
import Client from "models/Client"
import { sessionOptions } from "lib/session"

async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "POST") {
      const data = req.body
      const admin = await Admin.findOne({ email: data.email })

      if (admin) {
        if (admin.password == data.password) {
          req.session.user = {
            email: admin.email,
            role: admin.role,
            id: admin._id.toString(),
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
        const client = await Client.findOne({ email: data.email })

        if (client) {
          const match = await bcrypt.compare(data.password, client.password)
          if (match) {
            req.session.user = {
              email: client.email,
              role: client.role,
              id: client._id.toString(),
            }
            await req.session.save()
            return res.status(200).send({
              id: client._id.toString(),
              user: true,
              message: "Client logged in successfully!",
            })
          }

          return res.status(400).send({
            message: "Invalid Email or Password",
          })
        }
      }
    }
  } catch (error) {
    return { message: "Invalid Email or Password!" }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
