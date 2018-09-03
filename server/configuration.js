const dotenv = require('dotenv')

switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({
      path: 'production.env'
    })
    break
  case 'test':
    dotenv.config({
      path: 'test.env'
    })
    break
  default:
    dotenv.config()
}
dotenv.config()

module.exports = {
  MONGO: process.env.MLAB || 'himitsu'
}
