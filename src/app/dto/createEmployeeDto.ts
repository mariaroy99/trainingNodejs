import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateAddressDto } from "./createAddressDto";

export class CreateEmployeeDto {
    @IsString()
    public name: string;

    @IsString()
    public password: string;

    @IsNumber()
    public experience: number;

    @IsString()
    public role: string;

    @IsString()
    public joiningDate: Date;

    @IsString()
    public username:string;

    @IsString()
    public departmentId: string;

    @ValidateNested({each:true})
    @Type(()=>CreateAddressDto)
    public address: CreateAddressDto;


}