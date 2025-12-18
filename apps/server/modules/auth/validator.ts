import { Joi, Segments } from "celebrate";
class AuthValidator {
    // Validation methods will be added here in the future
    loginSchema() {
        return{
            [Segments.BODY]: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            })
        }
    }
    signupSchema() {
        return{
            [Segments.BODY]: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                name: Joi.string().min(2).required()
            })
        }
    }
}   

export default new AuthValidator();