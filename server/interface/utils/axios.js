const axios = require('axios')

const instance = axios.create({
    baseUrl: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    timeout: 1000,
    header: {
        
    }
})

module.exports = instance