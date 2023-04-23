import mongoose from "mongoose";
import reviewsSchema from "./reviews-schema.js";
const reviewsModel = mongoose.model("reviews", reviewsSchema);

export default reviewsModel;