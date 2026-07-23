import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{ type :String, required:true}, 
    name:{type :String, required:true},
    email:{type :String, required:true, unique: true},
    imaageUrl : {type :String, required:true},
    CartItems : {type : Object, default : {}}

}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user',userSchema)

export default User