import mongoose from "mongoose"

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database Connection Established!")
  } catch (error) {
    console.log(error)
  }
}

export default connectToMongoDB
