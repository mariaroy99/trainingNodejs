import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { Address } from "./Address";
import { Department } from "./Department";

@Entity("employee")
    export class Employee extends AbstractEntity {
        @PrimaryGeneratedColumn("uuid")
        public id: string;
        @Column({ nullable: false })
        public name: string;
        @Column({ nullable: false })
        public joiningDate: Date;
        @Column({ nullable: false })
        public experience: Number;
        @Column({ nullable: false ,default:true})
        public isActive: boolean;
        @Column({ nullable: false })
        public role: string;
        @ManyToOne(() => Department, { cascade: true })
        @JoinColumn()
        public department: Department;
        @Column({ nullable: false })
        public departmentId: string;
        @Column({nullable:false})
        public username: string
        @Column({ nullable: false })
        public password: string;
        @OneToOne(() => Address, { cascade: true })
        @JoinColumn()
        public address: Address;
        @Column({ nullable: false })
        public addressId: string;



        

}