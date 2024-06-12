const jwt = require("jsonwebtoken");


let validateToken= (req, res, next) => {

    console.log(req.headers.authorization);

    if(req.headers.authorization == undefined){
        res.json("No token provided")
        return
    }

    let token = req.headers.authorization.split(' ')[1]

    try {
        let payload = jwt.verify(token, '1234')
        console.log(payload);
        next()
        
    } catch (error) {

        res.json('Invalid token')
        
        
    }

}

module.exports=validateToken