import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import dbConnect from "utils/dbConnect"
import Admin from "models/Admin"

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === "POST") {
      const data = req.body
      const password = uuidv4()
      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(password, salt)

      const checkAdmin = await Admin.findOne({
        email: data.email,
      })

      if (checkAdmin) {
        return res.status(400).send({
          message:
            "Admin already exists! Proceed to login or create an account with a new email address",
        })
      }

      const admin = await Admin.create({
        email: data.email,
        password: hashPassword,
      })

      if (admin) {
        return res.status(201).send({
          email: admin.email,
          password: password,
        })
      }
    }
  } catch (error) {
    return { message: "Bad request!" }
  }
}
