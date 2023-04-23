import express,{Application} from 'express';
import mongoose from 'mongoose';
import {MainApp} from "./MainApp"
import dot from "dotenv"
import db from "./config/db"

dot.config()

const port: number = 8080
const app: Application = express();

const server = app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})

MainApp(app)
db()
app.set("view engine", "ejs")



process.on("uncaughtExpection", (err: Error) => {
    console.log("shutting down server")
    console.log(err)
    process.exit(1);
})

process.on("unhandledRejection", (reason:Error) => {
    console.log("shutting down: unhandled rejection")
    console.log(reason)
    process.exit(1);

    server.close(() => {
        process.exit(1)
    })
})