import mongoose,{ConnectOptions,Mongoose} from "mongoose"



const MONGODB_URI = process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/authSocial";

const connectMongoose = async (): Promise<Mongoose>  => {
    try
    {
        const conn = await mongoose.connect(MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn
    } catch (error)
    {
        console.log(`error ${error.message}`)
        process.exit()
        
    }
}


export default connectMongoose;

