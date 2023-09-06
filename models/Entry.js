import { models, model, Schema } from "mongoose"
const Decimal = Schema.Types.Decimal128

const entrySchema = new Schema(
  {
    posted_at: {
      type: String,
      trim: true,
      required: true,
    },
    client_id: {
      type: String,
      trim: true,
      required: true,
    },
    client_email: {
      type: String,
      trim: true,
      required: true,
    },
    client_company: {
      type: String,
      trim: true,
    },
    impressions: {
      type: Number,
      required: true,
    },
    revenue: {
      type: Decimal,
      required: true,
    },
    eCPM: {
      type: Decimal,
      required: true,
    },
  },
  { timestamps: true }
)

const Entry = models.Entry || model("Entry", entrySchema)
export default Entry
