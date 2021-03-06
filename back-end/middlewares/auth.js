const tools = require("../utils/tools")

const isSignin = async function(req,res,next){
    res.set('Content-Type', 'application/json; charset=utf-8')

    // let token = req.get("X-Access-Token")
    let {token} = req.cookies 

    if(token){
      let {username} = await tools.verifyToken(token)
      // console.log(username)
      if (req.path === '/isSignin') {
        res.render("succ",{
          data:JSON.stringify({
            username
          })
        })
      }else{
        let decoded = await tools.verifyToken(token)
        if(decoded){
          next()
        }else{
          res.render("fail",{
            data:JSON.stringify({
              message:"token验证失败."
            })
          })
        }
      }
    }else{
      res.render("fail",{
        data:JSON.stringify({
          message:"没有权限."
        })
      })
    }
  }

module.exports = isSignin

