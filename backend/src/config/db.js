import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://boscoh:Boscoh@foodnet.2padhe1.mongodb.net/foodnet_db?appName=foodNet';

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
