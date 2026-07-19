import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{ type :Sting, required:true}, 
    name:{type :Sting, required:true},
    email:{type :Sting, required:true, unique: true},
    imaageUrl : {type :Sting, required:true},
    CartItems : {type : Object, default : {}}

}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user',userSchema)

export default User