import { models, model, Schema } from "mongoose"

const clientSchema = new Schema(
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
      default: "user",
      trim: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
)

const Client = models.Client || model("Client", clientSchema)
export default Client
