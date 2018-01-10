let fs = require('fs');
const Comments = require('./comments.js');
const Commenthandler = function(storagePath){
  this.storagePath = storagePath;
  this.comments;
}

const loadComments = function(){
  let filePath = this.storagePath;
  let commentHandler = this;
  fs.readFile(filePath,'utf8',(err,comments)=>{
    if(err) throw err;
    if(comments=="")
      return commentHandler.comments = new Comments([]);
    comments = JSON.parse(comments);
    commentHandler.comments = new Comments(comments);
  })
}

const storeComments = function(comment){
  this.comments.addComment(comment);
  console.log(this.comments);
  let allComments = this.comments.getAllComments();
  fs.writeFile(this.storagePath,JSON.parse(allComments),(err)=>{
    if(err) throw err;
  });
}

const mapComments = function(mapperFunction){
  return this.comments.map(mapperFunction);
}

Commenthandler.prototype =  {
  loadComments:loadComments,
  storeComments:storeComments,
  mapComments:mapComments
}
module.exports=Commenthandler;
