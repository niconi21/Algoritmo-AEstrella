const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors())

app.use('/',express.static(path.resolve(__dirname, './public')))


app.listen( process.env.PORT || 3000,(error) => {
    console.log(`Server on port ${process.env.PORT || 3000}`);
})