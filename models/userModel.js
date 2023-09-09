const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('express/lib/response');
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have a name '],
  },
  email: {
    type: String,
    required: [true, 'Must have a email'],
    unique: true,
    validate : [validator.isEmail, 'Must a provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'Must have a role'],
    enum: ['admin', 'user', 'lead-guide', 'guide'],
    default:'user' 
  },  
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Must have a password'],
    select:false 
  },
  confirmpassword: {
    type: String,
    required: [true, 'Must have a confirm password'],
   validate:{
     validator: function(el){
        return el===this.password
    },
    message: 'password not match with confirm password'
  },
},


});
userschema.pre('save', async function(next){
  if (!this.isModified('password'))return next();
  //only when password is new if password is Updated not been hash again 
this.password =await bcrypt.hash(this.password,12);
//delete password confirmation
this.confirmpassword = undefined ;
next();
});
userschema.methods.correctpassword =async function(canpass,userpass){
  return await bcrypt.compare(canpass,userpass)
}
userschema.methods.createResetToken = async function (){
 const restToken = crypto.randomBytes(32).toString('hex');
 this.passwordResetToken = crypto
 .createHash('sha256')
 .update(restToken)
 .digest('hex');
 this.passwordResetExpires = Date.now() +10*1000*60;

  console.log(this.passwordResetToken,restToken);
 return restToken;

}
const User = mongoose.model('User',userschema) ;

module.exports = User;