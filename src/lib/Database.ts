
import mongoose  from "mongoose";

type ConnectionObject={
  isConnected?:number
}
 

const connection: ConnectionObject = {};

// Promise<void> indicates that the function returns a promise that resolves when the asynchronous operation is completed.


async function dbConnect(): Promise<void> {
    // Check if we have a connection to the database or if it's currently connecting
    if (connection.isConnected) {
      console.log('Already connected to the database');
      return;
    }
  
    try {
      // Attempt to connect to the database
      const db = await mongoose.connect(process.env.MONGODB_URL || '', {});
        console.log(db);
        
      connection.isConnected = db.connections[0].readyState;
  
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
  
      // Graceful exit in case of a connection error
      process.exit(1);
    }
  }
   export default dbConnect


   // Another Way import mongoose, { Connection } from "mongoose";

// const ConnectDb = async (): Promise<void> => {
//     try {
//         if (mongoose.connection.readyState !== 0) return; // Already connected
//         const db: Connection = await mongoose.connect(process.env.MONGODB_URL as string, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Database connected successfully.");
//     } catch (error) {
//         console.error("Error connecting to database:", error);
//         process.exit(1);
//     }
// };

// export default ConnectDb;
