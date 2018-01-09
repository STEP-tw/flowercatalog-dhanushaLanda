let fs = require('fs');
let queryString = require('querystring');


const addCommentDetails = function(date,name,comment){
  return `<p>DateAndTime : ${date}</p><p>Name : ${name}</p><p>Comment : ${comment}</p><hr>\n`;
}

const getDateNameComment = function(query){
  let nameAndComment = queryString.parse(query);
  let date = new Date().toLocaleString();
  return addCommentDetails(date,nameAndComment['name'],nameAndComment['comment']);
}

const storeDetails = function(query){
  let fileName = './public/feedBackDetails.html';
  let newFeedBack =  getDateNameComment(query);
  return fs.readFile(fileName,(err,data)=>{
    if(err) throw err;
    let finalFileContent = newFeedBack + data;
    fs.writeFile(fileName,finalFileContent,(err,data)=>{
      if(err) throw err;
    });
  });
}
exports.storeDetails = storeDetails;
