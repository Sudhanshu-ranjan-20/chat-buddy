import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser,IDecodedToken } from "@chat-buddy/shared";
import { ENVIRONMENT } from "../env";

class AuthUtils{
    SALT_ROUNDS = 10;
    async hashPassword(password:string):Promise<string>{
        const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
    }
    comparePassword(password:string,hashedPassword:string):Promise<boolean>{
        return bcrypt.compare(password,hashedPassword);
    }
    generateToken(user:IUser):string{
        return jwt.sign({userId:user.id,email:user.email},ENVIRONMENT.JWT_SECRET,{expiresIn:ENVIRONMENT.TOKEN_EXPIRY as any})
    }
    verifyToken(token:string):IDecodedToken{
        return jwt.verify(token,ENVIRONMENT.JWT_SECRET) as IDecodedToken;
    }
      
}


export default new AuthUtils();