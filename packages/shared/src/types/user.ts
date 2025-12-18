export interface IUser{
    id: string;
    email:string;
    name:string;
    is_verified:string;
    created_at:Date;
    updated_at:Date;
    last_login_at:Date|null;
}

export interface IUserWithPassword extends IUser{
    password:string
}

export interface IUserWithLoginPayload{
    email: string;
    password:string;
}
export interface IUserWithSignupPayload{
    email:string;
    password:string;
    name:string;
}
export interface IAuthResponse{
    token:string;
    user:IUser;
}

export interface IDecodedToken{
    userId:string;
    email:string;
    iat:number;
    exp:number;
}