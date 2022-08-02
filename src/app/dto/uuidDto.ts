import { IsUUID } from "class-validator";

export class uuidDto{
    @IsUUID()
    public id: string;
}