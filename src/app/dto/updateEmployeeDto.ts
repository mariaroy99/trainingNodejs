import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpdateAddressDto } from "./updateAddressDto";

export class UpdateEmployeeDto {
    @IsUUID()
    public id: string;

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
    @Type(()=>UpdateAddressDto)
    public address: UpdateAddressDto;


}