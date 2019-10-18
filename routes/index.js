var express = require('express');
var router = express.Router();
var articleModel = require("../db/articleModel")
var moment = require("moment")
/* GET home page. */
router.get('/', function(req, res, next) {
    var size = parseInt(req.query.size || 5)
    var page = parseInt(req.query.page || 1)
    let username = req.session.username
    articleModel.find().count().then((total)=>{
        var pages = Math.ceil(total/size)
        articleModel.find().sort({"createTime":-1}).limit(size).skip((page-1)*size).then((docs)=>{
            var arr = docs.slice()
            for(let i = 0;i < arr.length;i ++){
               arr[i].createTimeZH = moment(arr[i].createTime).format("YYYY-MM-DD HH:mm:ss")
            }
            res.render("index",{data:{list:arr,total:pages,username:username}})
        }).catch((err)=>{
            res.redirect("/")
        })
    }).catch((err)=>{
        res.redirect("/")
    })

})

router.get("/login",function(req,res,next){
  res.render("login",{})
})
router.get("/regist",function(req,res,next){
  res.render("regist",{})
})

router.get('/write', (req, res, next) => {
  var id = req.query.id
  let username = req.session.username
  if(id){
    articleModel.find({'_id':id}).then(docs=>{
      res.render('write',{docs:docs})
    }).catch(err=>{
      res.redirect("/")
    })
  }else{
    var docs = [{
      _id:'',
      username:req.session.username,
      title:'',
      content:''
    }]
    res.render("write",{docs:docs})
  } 
});


router.get("/detail",(req,res,next)=>{
    var id = req.query.id
    console.log(id)
    articleModel.find({"_id":id}).then((docs)=>{
      docs.createTimeZH = moment(docs.createTime).format("YYYY-MM-DD HH:mm:ss")
      res.render("detail",{docs:docs})
    }).catch(err=>{
      res.send(err)
    })
})

module.exports = router;
