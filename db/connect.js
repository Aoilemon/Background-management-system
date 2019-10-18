var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/aoi")
var db = mongoose.connection
db.on("error",(err)=>{
    console.log("数据库连接出错")
})
db.once("open",()=>{
    console.log("数据库连接成功")
})