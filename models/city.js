 const mongoose =  require("mongoose");
 const Schema = mongoose.Schema;

 const CitySchema = new Schema({
    country: String,
    city: String,
    latitude: Number,
    longitude: Number,
    description: String,
    image: String
 });

 module.exports = mongoose.model("City", CitySchema);