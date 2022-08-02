import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
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
        @Column({ nullable: true })
        public password: string;

}