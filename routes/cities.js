const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const City = require("../models/city");

const { citySchema } = require("../schemas.js");

const validateCity = (req, res, next) => {
    const { error } = citySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const cities = await City.find({});
    res.render("cities/index", { cities });
}));

router.get("/new", (req, res) => {
    res.render("cities/new");
});

router.post("/", validateCity, catchAsync(async (req, res) => {
    const { country, city, latitude, longitude, description, image } = req.body.city;
    const newCity = new City({ country, city, latitude, longitude, description, image });
    await newCity.save();
    res.redirect(`/cities/${newCity._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const city = await City.findById(req.params.id).populate("reviews");
    res.render("cities/details", { city });
}));

router.get("/:id/edit", catchAsync(async (req, res) => {
    const city = await City.findById(req.params.id);
    res.render("cities/edit", { city });
}));

router.put("/:id", validateCity, catchAsync(async (req, res) => {
    const city = await City.findByIdAndUpdate(req.params.id, req.body.city);
    res.redirect(`/cities/${city._id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
    await City.findByIdAndDelete(req.params.id);
    res.redirect("/cities");
}));

module.exports = router;