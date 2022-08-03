import { IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
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