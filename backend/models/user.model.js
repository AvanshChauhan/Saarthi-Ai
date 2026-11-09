import mongoose from "mongoose";
//two object one have the schema and the other one have timestamps and etc...
const userSchema=new mongoose.Schema({
    firebaseUID:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    profilePicture:{
        type:String,
        default:"https://i.pinimg.com/736x/15/e7/d4/15e7d4778be79bcdcdce2f52e75d1f51.jpg"
    },
    tokenUsageMonth:{
        type:String,
        default:""
    },
    tokensUsed:{
        type:Number,
        default:0,
        min:0
    }
},{timestamps:true})
// ye leta hai model ka naam kya hoga aur konse schema par based hai
const user=mongoose.model("user",userSchema)
export default user