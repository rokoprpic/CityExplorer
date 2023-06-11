 const mongoose =  require("mongoose");
 const Review = require("./review");
 const Schema = mongoose.Schema;


 const CitySchema = new Schema({
    country: String,
    city: String,
    latitude: Number,
    longitude: Number,
    description: String,
    image: String,
    reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review"
      }
    ]
 });

CitySchema.post("findOneAndDelete", async function(doc){
   if(doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
});

 module.exports = mongoose.model("City", CitySchema);