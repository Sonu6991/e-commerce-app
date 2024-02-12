import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "./customeValidator";

export class ChangePasswordValidatorClass {
    @IsNotEmpty({ message: "Password is required." })
    @MinLength(8)
    @MaxLength(128)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number" })
    password?: string

    @IsNotEmpty({ message: "Confirm password is required." })
    @MinLength(8)
    @MaxLength(128)
    @Match('password')
    passwordConfirm: string;
}


