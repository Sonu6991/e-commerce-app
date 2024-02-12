import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from "class-validator";


export class UserValidatorClass {
    @IsOptional({ groups: ['edit'] })
    @IsNotEmpty({ message: "First name required.", groups: ['add'] })
    @IsNotEmpty({ message: "First name can not be empty.", groups: ['edit'] })
    firstName?: string

    @IsOptional({ groups: ['edit'] })
    @IsNotEmpty({ message: "Last name required.", groups: ['add'] })
    @IsNotEmpty({ message: "Last name can not be empty.", groups: ['edit'] })
    lastName?: string

    @IsOptional({ groups: ['edit'] })
    @IsNotEmpty({ message: "Email can not be empty.", groups: ['edit'] })
    @IsNotEmpty({ message: "Email is required.", groups: ['add'] })
    @IsEmail(undefined, { message: "invalid email", groups: ['add', 'edit'] })
    email?: string

    @IsOptional({ groups: ['edit'] })
    @IsNotEmpty({ message: "Password is required.", groups: ['add'] })
    @MinLength(8, { groups: ['add'] })
    @MaxLength(128, { groups: ['add'] })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number", groups: ['add'] })
    password?: string

    @IsOptional({ groups: ['edit'] })
    @ArrayNotEmpty({ message: "role is required.", groups: ['add'] })
    role?: string[]

    @IsOptional({ groups: ['add', 'edit'] })
    @IsNotEmpty({ message: "address can not be empty.", groups: ['edit'] })
    @MaxLength(100, { groups: ['add', 'edit'] })
    address?: string
}

