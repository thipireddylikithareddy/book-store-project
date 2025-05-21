import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import bookRoute from "./routes/bookRoutes.js";

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
    return response.status(234).send('welcome to Mern');
});

app.use('/books', bookRoute);

mongoose
.connect(mongoDBURL)
.then(() => {
    console.log('App connected to databse');
    app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`)
})
})
.catch((error) => {
    console.log(error);
});
