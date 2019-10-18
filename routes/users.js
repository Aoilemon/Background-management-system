var express = require('express');
var router = express.Router();
var userModel = require("../db/userModel")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('hello express');
});

router.post('/login', (req, res, next)=>{
  let { username, password } = req.body
   userModel.find({username,password}).then((docs)=>{
      if(docs.length > 0){
        req.session.username = username
        req.session.isLogin = true
        res.redirect("/")
      }else{
        // res.send("用户不存在或密码错误")
        res.redirect('/login')
      }
   }).catch((err)=>{
    //  res.send("aa")
      // res.redirect("/login")
      res.send(err)
   })
})
router.post("/regist",(req,res,next)=>{
  let { username, password, password2 } = req.body
  userModel.find({username}).then((docs)=>{
      if(docs.length > 0){
        res.send("用户名已存在")
      }else{
        let createTime = Date.now()
        userModel.insertMany({username,password,createTime}).then((data)=>{
          res.redirect("/login")
        }).catch((err)=>{
          // res.send("出错")
          res.redirect("/")
        })
      }
  })
})
router.get("/logout",(req,res,next)=>{
  req.session.username = null
  req.session.isLogin = false
  res.redirect("/login")
})

module.exports = router;
