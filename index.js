const session = require('express-session')
const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUnitnitialized: false,
    cookie:{
      secure: false,
      maxAge: 1000 * 60 * 60 *24
    }
}))
const port = 3001
var morgan = require('morgan');
const routes = require('./src/routes')
const db = require('./src/db/mysql.js')
const path = require('path')
const cors = require('cors');
app.use(cors());
app.options('*', cors());
//config
const bodyParser = require('body-parser');
// dùng để lấy json
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


routes(app)
db.connect();
//kết nối db
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:3001/`)
})