const login = require('./login');
function route(app){
    app.use('/', login)
}





module.exports = route