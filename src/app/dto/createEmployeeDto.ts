import { IsNumber, IsString, IsDate } from "class-validator";

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
    public departmentId: string;

}