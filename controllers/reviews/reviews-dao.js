import reviewsModel from "./reviews-model.js";

export const findAllReviews = async () => {
    return reviewsModel.find();
};

export const findReviewsByMovieId = async (movieId) => {
    return reviewsModel.find({ movieId: movieId });
};

export const findReviewsByUserId = async (userId) => {
    return reviewsModel.find({ user: userId });
};

export const createReview = async (review) => {
    return reviewsModel.create(review);
};

export const deleteReview = async (reviewId) => {
    return reviewsModel.deleteOne({ _id: reviewId });
};

export const updateReview = async (reviewId, review) => {
    return reviewsModel.updateOne({ _id: reviewId }, { $set: review });
};