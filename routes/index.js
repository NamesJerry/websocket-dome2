var express = require("express");
var router = express.Router();
var socket = require("express-ws")(router);
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

var clintArr={};
// router.clintArr=clintArr;

router.ws("/ws/:id", (ws, req) => {
     var uk;
      if(uk == req.params.id){
         ws.send(JSON.stringify({succeed:false,msg:'此账号已经上线，请重新选择账号登陆！'}));
         return;
      }
     if (!clintArr[req.params.id]) {
       clintArr[req.params.id] = [];
       uk=req.params.id;
     }
     clintArr[req.params.id].push(ws);
     ws.on("close", () => {
          clintArr[req.params.id]=clintArr[req.params.id].filter(clint=>{
               return clint != ws;
          })
          console.log(clintArr[req.params.id].length);
          if(clintArr[req.params.id].length == 0){
                delete clintArr[req.params.id]; 
          }
     });
   });
router.post("/chat", (req, res) => {
  const { from, to, message } = req.body;
   var result={ succeed:true};
  if (clintArr[to]) {
    clintArr[to].forEach((ws) => {
     ws.send(JSON.stringify({
          from,
          message:message
     }));
    });
  }else{
       result.succeed=false;
       result.msg='对方不在线';
  }
   res.send(result);
});

module.exports = router;
