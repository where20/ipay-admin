'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://www.easy-mock.com/mock/5bdd1f38217bf75be9bd98f7/api"',
  // BASE_API: '"https://api-dev"' //注入本地api的根路径
  BASE_API: '"http://192.168.1.103:8081"'
})
