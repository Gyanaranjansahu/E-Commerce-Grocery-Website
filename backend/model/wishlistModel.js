import mongoose, { mongo } from "mongoose";
const wishSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    products:[
      {
         productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        }
      }
    ]
});

const wishlistModel=mongoose.model("wishlist",wishSchema);
export default wishlistModel;