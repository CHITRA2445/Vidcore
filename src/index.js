import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path:"./.env"

})
const port=process.env.port||8001;
connectDB()
.then(()=>{
    app.listen(port,()=> {
        console.log(`server is listening on ${port}`)
    })

})
.catch((err)=> {
    console.log("mongodb connection error" , err)
})












/*app.listen(port,()=> {
    console.log(`server is listening on ${port}`)
})*/
