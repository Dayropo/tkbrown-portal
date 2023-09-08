import { models, model, Schema } from "mongoose"

const adminSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
)

const Admin = models.Admin || model("Admin", adminSchema)
export default Admin
