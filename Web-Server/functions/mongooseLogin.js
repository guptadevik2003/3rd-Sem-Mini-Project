const mongoose = require('mongoose')

module.exports = ({ app, express }) => {
  express.mongooseLogin = async () => {

    mongoose.set('strictQuery', false)
    mongoose.Promise = global.Promise

    mongoose.connect(process.env.MONGODB_URI)

    mongoose.connection.on('connected', async () => {
      console.log(`Connected to Production Database.`)
    })

    mongoose.connection.on('disconnected', async () => {
      console.log(`Disconnected from Production Database.`)
    })

    mongoose.connection.on('err', async (error) => {
      console.log(error)
    })

  }
}
