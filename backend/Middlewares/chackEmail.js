import userModel from "../Database/Models/user.model.js";
export const checkEmail =async (req,res,next) => {
    let foundUser = await userModel.findOne({email: req.body.email})
    if(req.url == "/signup"){
        if(foundUser){
            return res.status(409).json({message: "email already exist"})
        }else{
            next()
        }
    }
    else{
         if(foundUser) {
            req.foundUser = foundUser
            next();
         }else{
            return res.status(422).json({message: "User not found, please signup"})
         }

    }

}