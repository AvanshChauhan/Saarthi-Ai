import mongoose from "mongoose"
const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database is connected")
    } catch (error) {
        throw new Error("Could not connect to MongoDB", { cause: error })
    }
}
export default connectDb
