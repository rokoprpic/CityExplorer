const mongoose =  require("mongoose");
const City = require("../models/city")
const cities = require("../models/citiesdb");

mongoose.connect("mongodb://127.0.0.1:27017/CityExplorer", {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    try {
        await City.deleteMany({});
        await City.insertMany(cities);
        console.log("Data seeded successfully");
      } catch (error) {
        console.error("Error seeding data:", error);
      } finally {
        mongoose.connection.close();
        console.log("Database connection closed");
      }
};

seedDB();