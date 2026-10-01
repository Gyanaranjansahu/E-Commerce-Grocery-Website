import mongoose from "mongoose";
async function connectDb(){
   try {
     await mongoose.connect("mongodb://localhost:27017/Ecommerse")
     console.log("mongodb connected successfully");
     
   } catch (error) {
     console.log("mongodb connected Unsuccessfully");
     
   }
}
export default connectDb