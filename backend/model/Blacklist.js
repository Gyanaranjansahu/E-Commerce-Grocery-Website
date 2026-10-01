import mongoose from "mongoose"
const Blacklist=new mongoose.Schema({
    token:{
        type:String
    }
})
const listed=mongoose.model("blacklist",Blacklist)

export default listed