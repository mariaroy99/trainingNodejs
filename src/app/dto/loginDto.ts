import {IsString } from "class-validator";

export class loginDto {
    @IsString()
    public name: string;
    @IsString()
    public password:string;

    // @IsString()
    // public username: string;
}