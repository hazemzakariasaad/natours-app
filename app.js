const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const tourRouter =require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
// console.log(proccess.env.NODE_ENV);
app.use(morgan('dev')); 
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello, world from Middleware!");
  console.log(req.headers)
  next();
})

// app.get('/api/v1/tours',getAllTours);
// app.get ('/api/v1/tours/:id',getTours);
// app.post('/api/v1/tours',createTour);    
// app.delete ('/api/v1/tours/:id ',deleteTour)


app.use ('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status:"fail",
  //   message:`cant fine ${req.originalUrl}on server `
  // }); 
  ////////////////////////////////////////////////////////////////
// const err = new Error (`cant fine ${req.originalUrl}on server `)
// err.status = 'fail';
// err.statuscode=404;
// just send an error to next that go direct 
//to global middleware avoid other middleware
// in stack 
next(new AppError(`cant find ${req.originalUrl} on server `,404));

}); 

// it global handle error middleware here
app.use(globalErrorHandler)
module.exports = app;

