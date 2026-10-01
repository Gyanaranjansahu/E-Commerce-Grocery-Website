import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"Email Must be Required"],
    },
    password:{
        type:String,
        required:[true,"password must be required"]
    },
    phone:{
        type:String,
        required:true
    },
    flat:{
        type:String,
        required:[true,"Enter Flat/Vila/House No,Apartment"]
    },
    landmark:{
        type:String,
        required:[true," Enter Area/Landmark "]
    },
    city:{
        type:String,
        required:[true," Enter City "]
    },
    pin:{
type:String,
        required:[true," Enter Pin "]
    }
    ,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    profileImage:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
},

{timestamps:true}

)



const UserModel=mongoose.model("user",UserSchema)

export default UserModel