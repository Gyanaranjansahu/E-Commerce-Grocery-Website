import mongoose from "mongoose"

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["Fruits","Vegetables","Dairy","Meat","Beverages","Snacks"]
    },
    image:{
        type:String,
        required:true
    },
    quantity:{
        type:Number
    }
},
{timestamps:true}
)

const ProductModel=mongoose.model("product",ProductSchema)
export default ProductModel