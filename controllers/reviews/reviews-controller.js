import * as reviewsDao from "./reviews-dao.js";

function ReviewsController(app) {
    const findAllReviews = async (req, res) => {
        const reviews = await reviewsDao.findAllReviews();
        res.json(reviews);
    };
    const findReviewsByMovieId = async (req, res) => {
        const reviews = await reviewsDao.findReviewsByMovieId(req.params.movieId);
        res.json(reviews);
    };
    const findReviewsByUserId = async (req, res) => {
        // const currentUser = req.session["currentUser"];
        // if (!currentUser) {
        //     res.sendStatus(403)
        //     return;
        // }
        const userId = req.params.userId;
        const reviews = await reviewsDao.findReviewsByUserId(userId);
        // const reviews = await reviewsDao.findReviewsByUserId(currentUser._id);
        res.send(reviews);
    };
    const createReview = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(403);
            return;
        }
        const review = { ...req.body, user: currentUser._id };
        const newReview = await reviewsDao.createReview(req.body);
        res.json(newReview);
    };
    const updateReview = async (req, res) => {
        const reviewId = req.params.reviewId;
        const status = await reviewsDao.updateReview(reviewId, req.body);
        res.send(status);
    };
    const deleteReview = async (req, res) => {
        const reviewId = req.params.reviewId;
        const status = await reviewsDao.deleteReview(reviewId);
        res.send(status);
    };

    app.get("/api/reviews", findAllReviews);
    app.get("/api/reviews/movie/:movieId", findReviewsByMovieId);
    app.get("/api/reviews/user/:userId", findReviewsByUserId);
    app.post("/api/reviews", createReview);
    app.put("/api/reviews/:reviewId", updateReview);
    app.delete("/api/reviews/:reviewId", deleteReview);
}

export default ReviewsController;