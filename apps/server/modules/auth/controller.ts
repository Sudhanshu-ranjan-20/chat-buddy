import { Request,Response} from "express";
import {HTTP_STATUS_CODES} from "@chat-buddy/shared"
import { AuthUtils } from "../../utils";
import { UserService } from "../../services";
import { ENVIRONMENT } from "../../env";
class AuthController {
    async login(req:Request,res:Response){
        res.send("Login route");
    }
    async signup(req:Request,res:Response){
        try {
            const {email,name,password} = req.body;
        const hashedPassword = await AuthUtils.hashPassword(password);

        const user = await UserService.createUser({email,name,password: hashedPassword});
        if(!user){
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message:"User Cannot be created!"});
        }

        const token = AuthUtils.generateToken(user);
        res.cookie("token",token,{httpOnly:true,secure:ENVIRONMENT.NODE_ENV === "local",maxAge: 7*24*60*60*1000,sameSite:"strict"});

        return res.status(HTTP_STATUS_CODES.SUCCESS_CREATED).json({message:"User created successfully",user,token});
    
            
        } catch (error) {
            console.log("Error in user creation",error);
            throw error
        }
        }
    async logout(req:Request,res:Response){
        res.send("Logout route");
    }

}

export default new AuthController();
