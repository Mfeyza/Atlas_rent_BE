const express= require('express')
const app= express()

require('dotenv').config()
// const HOST=process.env?.HOST || '127.0.0.1'
const PORT=process.env?.PORT || 8000

require('express-async-errors')
const {dbConnection}=require('./src/configs/dbConnection')
dbConnection()
app.use(express.json())
app.use(require('./src/middlewares/authentication'))
app.use(require('./src/middlewares/queryHandler'))
app.all('/',(req,res)=>{
    res.send('welcome')
    user:req.user
})
app.use(require('./src/routes/index'))
app.use(require('./src/middlewares/errorHandler'))


app.listen(PORT,()=> console.log(`http://:${PORT}`))