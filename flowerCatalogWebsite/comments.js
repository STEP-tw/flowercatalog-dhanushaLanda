const Comments = function(comments){
  this.comments = comments;
}

const addComment = function(newComment){
  newComment.date = new Date().toLocaleString();
  this.comments.unshift(newComment);
}

const getAllComments = function(){
  return this.comments;
}

const map = function(mapperFunction){
  return this.comments.map(mapperFunction);
}

Comments.prototype = {
  addComment:addComment,
  getAllComments:getAllComments,
  map:map
}
module.exports=Comments;
