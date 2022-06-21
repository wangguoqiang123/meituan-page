import Router from 'koa-router';
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import Email from '../dbs/config'

  let router = new Router({prefix: '/users'})

  let Store = new Redis().client //创建redis客户端

  router.post('/verify',async (ctx, next) => {
    const { username, email } = ctx.request.body
    const config = {
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
   const transporter = nodeMailer.createTransport(config)
   const mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: Email.smtp.user,
        // 主题
        subject: '激活验证码',
        to: email,//发送给谁
        subject: '美团注册码',
        html: `您的激活验证码为: ${Email.smtp.code()}, 一分钟内有效, 请谨慎保管.` ,
    }

    await transporter.sendMail(mail, (error, next) => {
      if (error) {
          return console.log(error)
      } 
    })
  })

export default router
