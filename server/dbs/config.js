module.exports = { //连接数据库
    dbs: 'mongodb://127.0.0.1:27017/meituan',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return  6379
        }
    },
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        get user() {
            return '2581395033@qq.com'
        },
        get pass() {
            return 'jirfwgxloxhnecfh'
        },
        get code() {// 设置验证码
            return () => {
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        get expire() {// 设置过期时间 60 秒
            return () => {
                return new Date().getTime() + 60 * 1000 
            }
        }
    }
}