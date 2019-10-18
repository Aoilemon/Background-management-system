var express = require('express');
var router = express.Router();
var articleModel = require("../db/articleModel")
var multiparty = require("multiparty")
var fs = require("fs")

/* GET home page. */
router.post('/write', (req, res, next) => {
    let {title,content,username,id} = req.body
    let createTime = Date.now()
    if(id){
        articleModel.updateOne({"_id":id},{title,content,username,createTime}).then(docs=>{
           res.redirect("/")
        }).catch(err=>{
            res.redirect("/write")
        })
    }else{
        let username = req.session.username
        articleModel.insertMany({title,content,createTime,username}).then((data)=>{
            res.redirect("/")
        }).catch((err)=>{
            res.redirect("/write")
        })
    }
});


router.post("/upload",(req,res,next)=>{
    var form = new multiparty.Form()
    form.parse(req,(err,field,files)=>{
        if(err){
            // res.send(err)
            console.log("文件上传失败")
        }else{
            // res.send(files)
            var file = files.filedata[0]
            var read = fs.createReadStream(file.path)
            var write = fs.createWriteStream("./public/imgs/"+ file.originalFilename)
            read.pipe(write)
            write.on("close",()=>{
                res.send({err:0,msg:"/imgs/"+file.originalFilename})
            })
            
        }
    })
})

router.get("/delete",(req,res,next)=>{
    let id = req.query.id
    articleModel.deleteOne({"_id":id}).then(data=>{ 
        res.redirect("/")
    }).catch(err=>{
        res.redirect("/")
    })
})




module.exports = router;
