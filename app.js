import express from 'express'
import cors from 'cors'
import UserController from "./controllers/users/users-controller.js";
import mongoose from "mongoose";
import session from "express-session";
import ReviewsController from "./controllers/reviews/reviews-controller.js";

const app = express();
app.use(
    session({
        secret: "somesecret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

UserController(app)
ReviewsController(app)

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING
mongoose.connect(CONNECTION_STRING)

app.listen(process.env.PORT || 4000);