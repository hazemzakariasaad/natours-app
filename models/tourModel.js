const mongoose = require('mongoose');
const slugify = require('slugify')
const validator= require('validator');
const tourschema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [4, 'A tour name must have more or equal then 4 characters'],
        validate: [validator.isAlpha, 'Tour name must only contain characters']
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
       enum:{
        values:['easy', 'medium', 'difficult'],
        message:'tour must have a difficulty Not like this'
       },
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        // min: [1, 'Rating must be above 1.0'],
        // max: [5, 'Rating must be below 5.0']
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price']
      },
      priceDiscount: {
        type: Number,
        validate:{
          validator: function(value) {
            //value here pricediscound
            return value< this.price
          },
          message: 'discound price must less than regular price'
        },
        // validate: {
        //   validator: function(val) {
        //     // this only points to current doc on NEW document creation
        //     return val < this.price;
        //   },
        //   message: 'Discount price ({VALUE}) should be below regular price'
        // } 
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
      },
      description: {
        type: String,
        trim: true
      },
      imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates: [Date],
      secretTour:{
        type:Boolean,
        default: false,
      },
    },
    {
      toJSON:{virtuals: true},
      toObject:{virtuals: true},
    });
  tourschema.virtual('durationweeks').get(function(){
  return this.duration/7 
});
// it document middle ware functionb as it works when .save() and .create() 
//save hook is called 
//tthisd here points to current document
tourschema.pre('save' , function(next){
  this.slug = slugify(this.name ,{lower : true});
  next();
});
//query middleware function
//this here points to query object
tourschema.pre(/^find/, function(next){ 
  this.find({secretTour:{$ne:true}});
  next();
})
tourschema.post(/^find/, function(docs,next){
  // console.log(docs);
  next();
});
//aggregation middleware function
tourschema.pre('aggregate', function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
  next();
  //array that contains all the aggragte objects
 });

  const Tour = new mongoose.model('Tour',tourschema);
module.exports = Tour ; 


