const express = require("express");
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const City = require("../models/city");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync( async(req, res) => {
    const city = await City.findById(req.params.id);
    const review = new Review(req.body.review);
    city.reviews.push(review);
    await review.save();
    await city.save();
    res.redirect(`/cities/${city._id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await City.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/cities/${id}`);
}));

module.exports = router;