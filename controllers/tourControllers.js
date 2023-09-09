const fs = require('fs');
const express = require('express');
const Tour = require('./../models/tourModel');
const catchasync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/appError');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   );

// exports.checkID = (req,res,next,val) => {
//   if(req.params.id*1 > tours.length){
//     return res.status(404).json({
//       status:"fail",
//       message:"Invalid"
//     })
//   }
//   next();
// };
exports.alias = (req, res, next) => {
  req.query.sort = '-price';
  req.query.fields = 'name,price,summary,difficulty';
  req.query.limit = '5';
  next();
};
exports.getAllTours =catchasync( async (req, res,next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tour = await features.query;
    // const tour = await Tour.find();
    res.status(200).json({
      status: 'succuss',
      numtours :tour.length,
      data: {
        tour,
      },
    });

    // console.log(req.query.sort.split(',').join(' '));
    //paginatio
    // will excude the query here
    
});
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTourStats = async (req, res) =>{
  try{
  const stats = await Tour.aggregate([
    {
      $match:{ratingsAverage: { $gte:4.5 }}
    },
    {
      $group:{
        _id:'$difficulty',
        numTours:{$sum: 1},
        avgrating:{$avg:'$ratingsAverage'},
        minprice :{$min:'$price'},
        maxprice :{$max:'$price'},

      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    numtours:stats.length,
   data: stats
  })
  }
  catch(err){
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
  }}
exports.getTour = catchasync( async (req, res,next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour){
     return next(new AppError('No Tour found in this id',404));
    }
    

    res.status(200).json({
      status: 'succuss',
      data: {
        tour,
      },
    });
  
});
exports.createTour = catchasync (async (req, res,next) => {
    const newtour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newtour,
      },
    });
  
});
exports.updateTour = catchasync(async (req, res,next) => { 
  
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour){
     return next(new AppError('No Tour found in this id',404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  
});
exports.deleteTour =catchasync( async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour){
      return next(new AppError('No Tour found in this id',404));
     }
    res.status(200).json({
      message: 'done',
    });
  
});
exports.checkbody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'bad request',
    });
  }
  next();
};
