const mongoose = require('mongoose'),
  configuration = require('./configuration')

const dbURL = {
  mlab: process.env.MONGO || configuration.MONGO,
  local: 'mongodb://localhost:27017/chatdemo'
}
mongoose.connect(dbURL.mlab, {
  useNewUrlParser: true
})

const db = mongoose.connection

const handle = {
  error: () => console.log('❌ Error Connecting to the Database'),
  open: () => console.log('✅ Connecte to DB')
}
db.on('error', handle.error)
db.once('open', handle.open)
