import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

  category:{
    type : String ,
    required : true ,
  } , 

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const  Post  = mongoose.model('Post', PostSchema);
export default  Post
