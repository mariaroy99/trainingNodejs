import {IsString } from "class-validator";

export class CreateDepartmentDto {
    @IsString()
    public name: string;

    // @IsString()
    // public username: string;
}