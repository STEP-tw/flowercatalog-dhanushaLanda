
const isIncomleteComment = function(commentDetail) {
  return commentDetail.name==""|| commentDetail.comment=="";
}

const getCommentDetails = function(){
  let name = document.getElementById('name').value;
  let comment = document.getElementById('comment').value;
  document.getElementById('commentForm').reset();
  return {
    name:name,
    comment:comment
  }
}

const prependComment = function(commentDetail) {
  let newComment = document.createElement('p');
  let commentInnerHTML = [
    `${new Date().toLocaleString()  }`,
    `${commentDetail.name }`,
    `${commentDetail.comment  }`
  ].join(' ')
  newComment.innerHTML=commentInnerHTML;
  let comments = document.getElementById('newComments');
  comments.prepend(newComment);
}

const recordComment = function() {
  let commentDetail = getCommentDetails();
  console.log(commentDetail);
  if(isIncomleteComment(commentDetail)) return;
  let req = new XMLHttpRequest();
  req.open('POST','/submitForm');
  req.onload=()=>{prependComment(commentDetail)};
  let commentData = `name=${commentDetail.name}&comment=${commentDetail.comment}`
  req.send(commentData);
}

const showUserName = function(name){
  let userName = document.getElementById("name");
  userName.innerHtml = name;

}

const removeCommentsPrivilage = function(){
  let commentButton = document.getElementById('commentButton');
  commentButton.onclick = null;
  let loginStatus = document.getElementById('login_status');
  loginStatus.innerHTML = "Please login to comment.";
}

const displayComments = function(){
  let serverResponse = JSON.parse(this.responseText);
  let comments = serverResponse.comments;
  let commentsDiv = document.getElementById('newComments');
  commentsDiv.innerHtml = comments;
}

const requestComment = function(){
  let req = new XMLHttpRequest();
  req.onload = displayComments;
  req.open('GET',"/comments");
  req.send();
}

const loadGustBookPage = function(){
  let commentButton = document.getElementById('commentButton');
  commentButton.onclick = recordComment;
  requestComment();
}

window.onload=loadGustBookPage;
