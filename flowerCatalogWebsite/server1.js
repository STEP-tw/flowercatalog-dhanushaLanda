const fs = require('fs');
const http = require('http');
let webApp = require('./webapp');

const CommentHandler = require('./commentsHandler.js');
let commentHandler = new CommentHandler('./comments.json');
commentHandler.loadComments();

let indexContent = fs.readFileSync('public/index.html',"utf8");
let registeredUsers = ["dhanu","pavani","aditi"];
let session = {};

const loadUser = function(req,res){
  let sessionid = req.cookies.sessionid;
  let user = session[sessionid];
  if(user){
    req.user = user;
  }
}


const redirectLoggedInUserToGuestBook = function(req,res){
  if(req.url=='/guestBook.html' && !req.user) res.redirect('./feedBackDetails.html');
};

const fileNotFound = function(fileName){
  return !fs.existsSync(fileName);
};

const getContentType = function(filePath) {
  let fileExtension = filePath.slice(filePath.lastIndexOf('.'));
  let contentTypes = {
      '.html':'text/html',
      '.css':'text/css',
      '.js':'text/javascript',
      '.png':'image/png',
      '.gif':'image/gif',
      '.jpg':'image/jpg',
      '.pdf':'application/pdf'
  }
  return contentTypes[fileExtension];
}

const getResourcePath = function(resource){
  if(resource == '/')
    return resource = './public/index.html';
  return './public'+resource;
}

const serveResource = function(resource,res,content){
  let resourceType = getContentType(resource);
  res.setHeader('content-type',resourceType);
  res.write(content);
  res.end();
}

const fileHandler = function(req,res){
  let resource = getResourcePath(req.url);
  if(fileNotFound(resource)){
    console.log('no filee');
    return;
  }
  let content = fs.readFileSync(resource);
  serveResource(resource,res,content);
}

const respondLoginFailed = function(res){
  res.redirect('/login.html')
}

const storeComments = function(req,res){
  commentHandler.storeComments(req.body);
  req.statusCode = 200;
  res.end();
}

const getLogedUserName = function(session,sessionid){
  return session[sessionid];
}

const toHtmlTable = function(commentRecord) {
  return `<p>${commentRecord.date} ${commentRecord.name} ${commentRecord.comment}</p>`;
}

const processComments = function(req,res){
  let  serverResponse={};
  let sessionid = req.cookies.sessionid;
  serverResponse.userName =getLogedUserName(session,sessionid);
  console.log(commentHandler.comments);
  serverResponse.comments = commentHandler.mapComments(toHtmlTable).join('<br/>');
  console.log(serverResponse);
  res.write(JSON.stringify(serverResponse));
  res.end();
}

let app = webApp.create();

app.use(loadUser);

app.use(redirectLoggedInUserToGuestBook);

app.use(fileHandler);

app.get('/comments',processComments);

app.post('/login',(req,res)=>{
  let userName = req.body.userName;
  if(!registeredUsers.includes(userName)) return respondLoginFailed(res);
  let sessionid = new Date().getTime();
  session[sessionid] = userName;
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  res.redirect('/guestBook.html');
  res.end();
});

app.post('/submitForm',storeComments);

let PORT = 8888;
let server = http.createServer(app);
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
