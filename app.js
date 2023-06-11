const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//const ejsMate = require("ejs-mate");
const { citySchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const engine = require("ejs-mate");
const City = require("./models/city")
const methodOveride = require("method-override");
const Review = require("./models/review.js");


mongoose.connect("mongodb://127.0.0.1:27017/CityExplorer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));

const validateCity = (req, res, next) => {
    const { error } = citySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/cities", catchAsync(async (req, res) => {
    const cities = await City.find({});
    res.render("cities/index", { cities });
}));

app.get("/cities/new", (req, res) => {
    res.render("cities/new");
});

app.post("/cities", validateCity, catchAsync(async (req, res) => {
    const { country, city, latitude, longitude, description, image } = req.body.city;
    const newCity = new City({ country, city, latitude, longitude, description, image });
    await newCity.save();
    res.redirect(`/cities/${newCity._id}`);
}));

app.get("/cities/:id", catchAsync(async (req, res) => {
    const city = await City.findById(req.params.id).populate("reviews");
    res.render("cities/details", { city });
}));

app.get("/cities/:id/edit", catchAsync(async (req, res) => {
    const city = await City.findById(req.params.id);
    res.render("cities/edit", { city });
}));

app.put("/cities/:id", validateCity, catchAsync(async (req, res) => {
    const city = await City.findByIdAndUpdate(req.params.id, req.body.city);
    res.redirect(`/cities/${city._id}`);
}));

app.delete("/cities/:id", catchAsync(async (req, res) => {
    await City.findByIdAndDelete(req.params.id);
    res.redirect("/cities");
}));

app.post("/cities/:id/reviews", validateReview, catchAsync( async(req, res) => {
    const city = await City.findById(req.params.id);
    const review = new Review(req.body.review);
    city.reviews.push(review);
    await review.save();
    await city.save();
    res.redirect(`/cities/${city._id}`);
}));

app.delete("/cities/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await City.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/cities/${id}`);
}));

app.all("*", (reg, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("Sucess port 3000");
});

