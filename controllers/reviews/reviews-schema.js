import mongoose from "mongoose";
const reviewsSchema = new mongoose.Schema(
    {
        text: String,
        movieId: String,
        movieName: String,
        movieUrl: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        username: String,
    },
    { collection: "reviews" }
);

export default reviewsSchema;