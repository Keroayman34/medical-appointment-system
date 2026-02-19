

export default function catchError(myFun){

    return (req,res,next) =>{
        myFun(req,res,next).catch((err) => {
            res.status(500).json({message: err})
        })
    }
}