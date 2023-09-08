import { models, model, Schema } from "mongoose"

const invoiceSchema = new Schema(
  {
    invoice_number: {
      type: String,
      trim: true,
      required: true,
    },
    period: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: String,
      trim: true,
      required: true,
    },
    client_email: {
      type: String,
      trim: true,
      required: true,
    },
    client_domain: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
)

const Invoice = models.Invoice || model("Invoice", invoiceSchema)
export default Invoice
