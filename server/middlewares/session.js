const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const {User, asrUser, reqUser} = require('../models/base-user')


const session = async(req, res, next)=>{
    try{
        if (req.method==='OPTIONS'){
            next()
        } else if (req.headers.authorization){
            const authToken = req.headers.authorization.includes('Bearer') ? req.headers.authorization.split(' ')[1] : req.headers.authorization
            const payload = authToken ? jwt.verify(authToken, SECRET_KEY) : undefined
            if (payload){
                let sessionUser = await User.findOne({_id : payload._id})
                if (sessionUser){
                    // add found user to request object for verification at controller handlers
                    req.user = sessionUser
                    // pass modified req obj to next handler
                    next()
                } else {
                    res.status(400).json({
                        status : 'User not found'
                    })
                }
            } else {
                res.status(401).json({
                   status: 'Invalid token' 
                })
            }
        } else {
            res.status(403).json({
                status: 'Forbidden; unauthorized user'
            })
        }
    } catch(error){
        if (error instanceof jwt.TokenExpiredError){
            // inform user if error comes from expired token
            res.status(406).json({
                status: 'Token has expired'
            })
        }
        res.status(500).json({
            status: 'Error',
            error: `${error}`
        })
    }
}
module.exports = session