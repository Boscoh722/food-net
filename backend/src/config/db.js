import mongoose from 'mongoose';

// Ensure your MongoDB connection string is correct
// You'll likely need to load this from an environment file (.env)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnet_db';

/**
 * Establishes a connection to the MongoDB database.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            // These options are now deprecated in Mongoose 6+ but harmless to leave out
            // if you are using an older version:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        // Exit process with failure
        process.exit(1); 
    }
};

// This uses the ES Module default export, matching your 'import connectDB from...'
export default connectDB;
