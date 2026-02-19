
import bcrypt from "bcrypt"

export const hashPass = (req,res,next) => {
    req.body.password = bcrypt.hashSync(req.body.password,8)
    next()
}
