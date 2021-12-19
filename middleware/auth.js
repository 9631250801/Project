const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
module.exports = {
    tokenVerify: async(req, res, next)=>{
        try{
       var tokenVerifyResult=await  jwt.verify(req.headers.token, "manish")
       if(tokenVerifyResult){
              var findResult=await   userModel.findOne({_id: tokenVerifyResult._id})
              if(findResult){
                            if(tokenVerifyResult.status == "DELETE"){
                                return res.send({responseCode: 404, responseMessage: `${findResult.userType} has been Deleted....`});
                            } else if(tokenVerifyResult == "BLOCK"){
                                return res.send({responseCode: 404, responseMessage: `${findResult.userType} has been Blocked....`});
                            } else{
                                req.userId = tokenVerifyResult._id;
                                next();
                            }
                }
                }
            
        } catch(error){
            return res.send({responseCode: 500, responseMessage: "server error"});
        }
    }
}