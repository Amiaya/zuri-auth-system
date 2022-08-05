const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(()=> console.log('DB connection successful!'))



// server
const port = process.env.PORT || 5500
app.listen(port, () => {
    console.log(`App listening to ${port}....`)
})