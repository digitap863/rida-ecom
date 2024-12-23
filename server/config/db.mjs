import 'dotenv/config'
import mongoose from "mongoose";
import colors from "colors"


export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,{dbName:"rida-ecom"});
        console.log(`MONGODB connected ${mongoose.connection.host}`.bgBlue.white);
    } catch (error) {
        console.log(`mongodb server issue ${error}`.bgRed.white)
        
    }
};