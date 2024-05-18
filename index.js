const express= require('express')
const app= express()
const cors = require('cors');

require('dotenv').config()
const PORT=process.env?.PORT || 8000

require('express-async-errors')
const {dbConnection}=require('./src/configs/dbConnection')
dbConnection()
app.use(cors())

app.use(express.json())
app.use(require('./src/middlewares/authentication'))
app.use(require('./src/middlewares/queryHandler'))
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to RENT API',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        },
    
    })
})
app.use(require('./src/routes/index'))
app.use(require('./src/middlewares/errorHandler'))


app.listen(PORT,()=> console.log(`http://:${PORT}`))

// require('./src/helpers/sync')() // !!! It clear database.