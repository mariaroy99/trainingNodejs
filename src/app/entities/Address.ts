import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { Employee } from "./Employee";

@Entity("address")
    export class Address extends AbstractEntity {
        @PrimaryGeneratedColumn("uuid")
        public id: string;
        @Column({ nullable: false })
        public firstLine: string;
        @Column({nullable: true})
        public secondLine: string;
        @Column({nullable:false})
        public city:string;
        @Column({nullable:true})
        public country:string;
        @Column({nullable:false})
        public state:string;
        @Column ({nullable:false})
        public pincode:number;
}