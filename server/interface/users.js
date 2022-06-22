import Router from 'koa-router';
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import Email from '../dbs/config'
import axios from 'axios';
import User from '../dbs/models/users'
import Passport from './utils/possport'

  let router = new Router({prefix: '/users'})

  let Store = new Redis().client //创建redis客户端


  router.post('/signup', async (ctx, next) => {
    const {username, password, email, code} = ctx.request.body

    if(code) {
      const saveCode = await Store.hget(`nodemail${username}`,'code');
      const saveExpire = await Store.hget(`nodemail${username}`,'expire')


      // code  未输入验证码  输入验证码 => 验证码输入对错与否 => 验证码输入是否超时
      if(code === saveCode) {//输入验证码正确
        if(saveExpire > new Date().getTime()) {//如果超时
          ctx.body = {
            code: -1,
            msg: '验证码已过期,请重新获取'
          }
        }
      }else {
        ctx.body = {
          code: -1,
          msg: '您的验证码输入错误,请核对后重新输入'
        }
      }
    }else {
      ctx.body = {
        code: -1,
        msg: '请输入验证码'
      }
    }


    // 判断user是否存在
    let user = await User.find({ username })
    if(user.length) {
      ctx.body = {
        code: -1,
        msg: '用户名已存在'
      }
      return
    }


    let nuser = await User.create({ username, password, email }) 
    if(nuser) {
      let res = await axios.post('/users/sigin', {username, password})
      if(res && res.data.code == 0) {
        ctx.body = {
          code: 0,
          msg: '注册成功',
          user: res.data.user
        }
      }else {
        ctx.body = {
          code: -1,
          msg: 'error'
        }
      }
    }else {
      ctx.body = {
        code: -1,
        msg: '注册失败'
      }
    }
    


  })


  router.post('/signin', async (ctx, next) => {
    return Passport.authenticate('local', function(err, user, info, status) {
      if(err) {
        ctx.body = {
          code: -1,
          msg: err
        }
      }else {
        if(user) {
          ctx.body = {
            code: 0,
            msg: '登录成功'
          }
        }else {
          ctx.body = {
            code: 1,
            msg: info
          }
        }
      }
    })(ctx,next)
  })

  router.post('/verify',async (ctx, next) => {
    let username = ctx.request.body.username
    const saveExpire = Store.hget(`nodemail${username}`,'expire')
    console.log(ctx.request.body)
    if(saveExpire && new Date().getTime() < saveExpire) {
      ctx.body = {
        code: -1,
        msg: '请求频繁,一分钟请求一次'
      }
      return false
    }

    
    let config = {
      // 163邮箱 为smtp.163.com
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          // 发件人邮箱账号
          user: Email.smtp.user,
          //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
          pass: Email.smtp.pass
      }
   }
   let transporter = nodeMailer.createTransport(config)

   let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    username: ctx.request.body.username,
    email: ctx.request.body.email
   }

   let mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: Email.smtp.user,
        // 主题
        subject: '激活验证码',
        to: ko.email,//发送给谁
        subject: '美团注册码',
        html: `您的激活验证码为: ${ko.code}, 一分钟内有效, 请谨慎保管.` ,
    }

    await transporter.sendMail(mail, (error, next) => {
      if (error) {
          return console.log(error)
      } else {
        Store.hmset(`nodemail:${ko.mail}`,'code', ko.code, 'expire', ko.expire, 'email', ko.email)
      }
    })
  })


  router.post('/exit', async (ctx, next) => {

  })

  router.post('/getUser', async (ctx, next) => {

  })

export default router
