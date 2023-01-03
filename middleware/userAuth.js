const jwt = require('jsonwebtoken');


const userAuth = (req, res, next)=>{
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)

    console.log("helooooooooo",token);
    if (!token){
        return res.status(403).send("Access denied!")
    }

    try {
        const decode = jwt.verify(token, "shhhhh" ); //it'll give us decode value
        console.log("++"+decode);
        req.user =decode; // here you can name req.xyz...to any name
    } catch (error) {
        console.log(error)
        res.status(401).send("Token is invalid or session expired");
    }
 
    return next(); 
}

module.exports = userAuth;