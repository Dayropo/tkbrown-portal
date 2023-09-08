import { models, model, Schema } from "mongoose"

const billingSchema = new Schema(
  {
    client_company: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    billing_email: {
      type: String,
      trim: true,
      required: true,
    },
    bank_name: {
      type: String,
      trim: true,
    },
    account_number: {
      type: String,
      trim: true,
    },
    bank_swift: {
      type: String,
      trim: true,
    },
    bank_address: {
      type: String,
      trim: true,
    },
    paypal_email: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

const Billing = models.Billing || model("Billing", billingSchema)
export default Billing
