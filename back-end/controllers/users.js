// var succView = require("../views/succ.art")

const usersModel = require("../models/users")

const tools = require("../utils/tools")

const middleware  = require("../middlewares/auth")

const signup = async function(req, res, next) {
    console.log(req.body)
    let {username,password} = req.body

    //加密
    let hash = await tools.encrypt(password)

    let result = await usersModel.save({
      username,
      password:hash
    })
    res.set('Content-Type', 'application/json; charset=utf-8')
    console.log(result)

    if(result){
      res.render("succ",{
        data : JSON.stringify({
          message:"注册成功."
        })
      })
    }else{
      res.render("fail",{
        data : JSON.stringify({
          message:"注册失败."
        })
      })
    }
  }
const hasSame = async function(req,res,next){
  res.set('Content-Type', 'application/json; charset=utf-8')
  let { username } = req.body
  
  let result = await usersModel.findOne({username})
  if(result){
    res.render("fail",{
      data : JSON.stringify({
        message:"该用户名已存在."
      })
    })
  }else{
    next()
  }
}

const signin = async function(req,res,next){
  res.set('Content-Type', 'application/json; charset=utf-8')
  let { username , password } = req.body

  let result = await usersModel.findOne({username})
  if(result){

      let compareResult = await tools.compare(password, result.password)
      if(compareResult){
        //登录成功设置token
        let token = await tools.generateToken(username)
        //向headers 添加自定义的字段
        // res.header("X-Access-Token",token)
        res.cookie('token',token)

        res.render("succ",{
          data:JSON.stringify({
            message:"登录成功.",
            username
          })
        })
      }else{
        res.render("fail",{
          data:JSON.stringify({
            message:"用户名或密码错误."
          })
        })
      }
  }else{
    res.render("fail",{
      data:JSON.stringify({
        message:"用户名或密码错误."
      })
    })
  }
}
const isSignin = middleware

signout = function(req,res,next){
  res.set('Content-Type', 'application/json; charset=utf-8')
  // req.session = null
  res.cookie('token','')
  res.render("succ",{
    data:JSON.stringify({
      message:"注销成功."
    })
  })
}
module.exports = {
    signup,
    hasSame,
    signin,
    isSignin,
    signout
}