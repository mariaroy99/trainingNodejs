import { DeepPartial, getConnection } from "typeorm";
import { Employee } from "../entities/Employee";

export class EmployeeRespository{
    async getAllEmployees(): Promise<Employee[]>{
         const employeeRepo = getConnection().getRepository(Employee);
        return await employeeRepo.find();
    }
    public async saveEmployeeDetails(employeeDetails: Employee) : Promise<Employee>{
        const employeeRepo = getConnection().getRepository(Employee);
        return employeeRepo.save(employeeDetails);
    }
    public async softDeleteEmployeeById(employee:Employee) : Promise<Employee> {
        const employeeRepo = getConnection().getRepository(Employee);
        return employeeRepo.softRemove(employee);
    }
 
    public async updateEmployeeDetails(employeeDetails: DeepPartial<Employee>) {
        const employeeRepo = getConnection().getRepository(Employee);
        const updateEmployeeDetails = await employeeRepo.save(employeeDetails);
        return updateEmployeeDetails;
    }


    async getEmployeeById(id:string, relations:string[]=['address'] ){
        const employeeRepo = getConnection().getRepository(Employee);
        return employeeRepo.findOne(id,{ relations:relations});
    }

    public async getEmployeeByName(userName: string) {
        const employeeRepo = getConnection().getRepository(Employee);
        const employeeDetail = await employeeRepo.findOne({
            where: { name: userName },
        });
        return employeeDetail;
    }
    }
    