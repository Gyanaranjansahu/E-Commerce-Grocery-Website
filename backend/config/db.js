import mongoose from "mongoose";
async function connectDb(){
   try {
     await mongoose.connect(process.env.MONGODB_URL)
     console.log("mongodb connected successfully");
     
   } catch (error) {
     console.log("mongodb connected Unsuccessfully");
     
   }
}
export default connectDb