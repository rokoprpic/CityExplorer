//const ejsMate = require("ejs-mate");
// const { citySchema, reviewSchema } = require("./schemas.js");
// const catchAsync = require("./utils/catchAsync");
// const City = require("./models/city");
// const Review = require("./models/review.js");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const engine = require("ejs-mate");
const methodOveride = require("method-override");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");


const cities = require("./routes/cities.js");
const reviews = require("./routes/reviews.js");


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
app.use(cookieParser());
app.use(flash());

app.use("/cities", cities);
app.use("/cities/:id/reviews", reviews);


app.get("/", (req, res) => {
    res.render("home");
});

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

