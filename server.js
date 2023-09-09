const express = require('express');
const dotenv = require('dotenv');
const app = require('./app');
require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');
 
dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE;
// const DB = process.env.DATABASE;
const DB = 'mongodb+srv://hazemz:hazem106611@cluster0.ueeunya.mongodb.net/test?retryWrites=true&w=majority';

console.log(DB);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,

  })
  .then(() => {
    console.log('db connection successfully');
  }).catch(error => {
    console.error('🔥🔥 Error connecting to MongoDB:', error);
  });


// const testTour = new Tour ({
//   name : 'qwee',

// });
// testTour.save()
// .then((doc) => {
// console.log(doc);
// }).catch((err) => {
//   console.log("ËRROr:",err);
// });


 
const port = 3000;
const server = app.listen(port, () => {
  console.log('app running');
});
process.on('unhandledRejection', (err) => {
  console.log(err.message,err.name);
  // server.close(()=>{
  //   process.exit(1);
  // });
  });