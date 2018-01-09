const fs = require('fs');
const http = require('http');
const storeDetails = require('./feedBackDetails.js').storeDetails;

let webApp = require('./webapp');
let indexContent = fs.readFileSync('public/index.html',"utf8");
let registeredUsers = ["dhanu"];
let session = {};
const loadUser = function(req,res){
  let sessionid = req.cookies.sessionid;
  let user = session[sessionid];
  if(user){
    req.user = user;
  }
}

const redirectToLoginPost = function(req,res){
  if(req.url == '/login.html' && req.method == "POST") res.redirect('/login')
}

const redirectLoggedInUserToGuestBook = function(req,res){
  console.log(registeredUsers);
  if(req.url=='/guestBook.html' && !req.user){
    // handleGuestBook();

    res.redirect('/login.html');
  }

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

const serveForGuestBook = function(req,res){
  res.redirect('/login');
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
  res.redirect('/login')
}

let app = webApp.create();

app.use(loadUser);

app.use(redirectToLoginPost);

app.use(redirectLoggedInUserToGuestBook);

app.use(fileHandler);


const processLoginRequest = function(req,res) {
  let username = req.body.username;
  if(!registeredUsers.includes(username)) return respondLoginFailed(res);
  let sessionid = new Date().getTime();
  session[sessionid] = username;
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  responseWithGuestBook(res);
}

app.post('/login',(req,res)=>{
  let userName = req.body.userName;
  if(!registeredUsers.includes(userName)) return respondLoginFailed(res);
  let sessionid = new Date().getTime();
  session[sessionid] = userName;
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  res.redirect('/guestBook.html');
  res.end();
});

app.post('/guestBook',(req,res)=>{
  if(req.url == '/guestBook.html' && req.method=='POST'){
    console.log(req.body);
    let text = req.body;
    storeDetails(req.body);
    res.redirect('guestBook.html');
  }
});
let PORT = 8888;
let server = http.createServer(app);
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
