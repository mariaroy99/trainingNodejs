import { IsNumber, IsString, IsUUID } from "class-validator";

export class UpdateAddressDto {
    @IsUUID()
    public id: string 

    @IsString()
    public firstLine: string;

    @IsString()
    public secondLine: string;

    @IsString()
    public city: string;

    @IsString()
    public state: string;

    @IsString()
    public country: string;

    @IsNumber()
    public pincode: number;

}