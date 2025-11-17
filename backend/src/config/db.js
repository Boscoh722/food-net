import mongoose from 'mongoose';

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_LOCAL;


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
          
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
       
        process.exit(1); 
    }
};

export default connectDB;
