const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const reqUser = require('../models/req_users_schema')
const asrUser = require('../models/asr_users_schema.js')

const session = async(req, res, next)=>{
    try{
        if (req.method==='OPTIONS'){
            next()
        } else if (req.headers.authorization){
            const authToken = req.headers.authorization.includes('Bearer') ? req.headers.authorization.split(' ')[1] : req.headers.authorization
            const payload = authToken ? jwt.verify(authToken, SECRET_KEY) : undefined
            if (payload){
                const User = req.path.includes('asr') ? asrUser : reqUser
                let sessionUser = await User.findOne({_id : payload._id})
                
                if (sessionUser){
                    req.user = sessionUser
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