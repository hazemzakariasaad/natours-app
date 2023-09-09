//all funtion for authentication here 
const User = require('../models/userModel');
require('dotenv').config();
const {promisify} = require('util');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const catchasync = require('../utils/catchAsync');


exports.signUp = catchasync(async(req,res,next) => {
    const newUser = await User.create({
        name : req.body.name ,
        email : req.body.email,
        password : req.body.password,
        confirmpassword : req.body.confirmpassword,
        role: req.body.role
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      
    res.status(201).json({
        status: 'success',
        token ,
        User : newUser,
    })
});
exports.login = catchasync(async(req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    //check if password and email exists
    if (!email || !password){
        return next(new AppError('please provide email and password ',
        400));
    }
    //check if password correct and user exists
    const user = await User.findOne(
        { email: email}).select('+password')
    // const correct = await user
    // .correctpassword(password,user.password);
const correct= await bcrypt.compare(password,user.password)
    if(!user||!correct){
        return next(new AppError('incorrect email or password',401))
    }
    //if eeverything ok send token to client 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      ;
    res.status(200).json({
        status:'success',
        token: token,
    })
});

exports.protect = catchasync(async(req, res,next) => {
    //1) getting token and checking if it exists
    let token ;
    if(
     req.headers.authorization && 
     req.headers.authorization.startsWith('Bearer')){
     token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
     return next(new AppError('You not login please log in',401));
    }
    //2) verification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET); 
    console.log(decoded);
    //verify use to check that the token is valid
    //promisify function is being used to convert 
    //a callback-based function into 
    //a Promise-based function. 
    
    //3) check if user still exits
const currUser = await User.findById(decoded.id);
if(!currUser){
  return next(new AppError('the user no longer exits',401));
}
    //4) if user changed password after token was issued 
    req.user = currUser;
    //custom property be added to request
    next();
})
exports.restrictTo = (...roles) => {
return (req, res,next) => {
//admin and lead-guide 
if (!roles.includes( req.user.role)){
    return next(new AppError('you dont have a permission to do this action',403));
}
next();
}};

exports.forgetPassword = catchasync(async(req, res, next) => {
    const user = await User
    .findOne({email:req.body.email});
    if (!user){
        next(new AppError('no user with email ',404));
    }
    const restToken = user.createResetToken();
    await user.save({validateBeforeSave:false});
});
exports.resetPassword = catchasync(async(req, res, next) =>{

});
exports.updatePassword = catchasync(async(req, res, next) =>{
    const user = await User
    .findById(req.user._id).select('+password');
    if(!(req.body.password === user.password)){
        next(new AppError('your current password is wrong',401))
    }
    user.password = req.body.password
    user.confirmpassword=req.body.confirmpassword
    await user.save({validateBeforeSave:false})
})
