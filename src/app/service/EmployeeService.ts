import { plainToClass } from "class-transformer";
import { Employee } from "../entities/Employee";
import EntityNotFoundException from "../exception/EntityNotFoundException";
import { EmployeeRespository } from "../repository/employeeRepository";
import { ErrorCodes } from "../util/errorCode";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"
import UserNotAuthorizedException from "../exception/UserNotAuthorisedException";
import IncorrectUsernameOrPasswordException from "../exception/IncorrectUsernameOrPasswordException";
import { Address } from "../entities/Address";
import { CreateEmployeeDto } from "../dto/createEmployeeDto";
import { UpdateEmployeeDto } from "../dto/updateEmployeeDto";

export class EmployeeService{
    constructor(private employeeRepo: EmployeeRespository){ }
    async getAllEmployees(){
        return await this.employeeRepo.getAllEmployees();
        
    }
    async softDeleteEmployeeById(id: string){
        const employee=await this.getEmployeeById(id);
        return await this.employeeRepo.softDeleteEmployeeById(employee);
        
        
    }
    public async createEmployee(employeeDetails:CreateEmployeeDto ) {
        try {
          const newAddress=plainToClass(Address, {
            firstLine:employeeDetails.address.firstLine,
            secondLine:employeeDetails.address.secondLine,
            country:employeeDetails.address.country,
            city:employeeDetails.address.city,
            state:employeeDetails.address.state,
            pincode:employeeDetails.address.pincode,

          });
            const newEmployee = plainToClass(Employee, {
                name: employeeDetails.name,
                username: employeeDetails.username,
                joiningDate:employeeDetails.joiningDate,
                departmentId: employeeDetails.departmentId,
                role: employeeDetails.role,
                experience: employeeDetails.experience,
                isActive: true,
                password:employeeDetails.password ? await bcrypt.hash(employeeDetails.password,10):'',  
                address:newAddress,
            });

            const save = await this.employeeRepo.saveEmployeeDetails(newEmployee);
            return save;
        } catch (err) {
         
           throw err;
        }
    }
    public async updateEmployeeDetails(employeeId: string, employeeDetails: UpdateEmployeeDto) {
      try {
        //const checkId=await this.getEmployeeById(employeeId);
        const newAddress=plainToClass(Address, {
          id:employeeDetails.address.id,
          firstLine:employeeDetails.address.firstLine,
          secondLine:employeeDetails.address.secondLine,
          country:employeeDetails.address.country,
          city:employeeDetails.address.city,
          state:employeeDetails.address.state,
          pincode:employeeDetails.address.pincode,

        });
          const newEmployee = plainToClass(Employee, {
              id:employeeId,
              name: employeeDetails.name,
              username: employeeDetails.username,
              joiningDate:employeeDetails.joiningDate,
              departmentId: employeeDetails.departmentId,
              role: employeeDetails.role,
              experience: employeeDetails.experience,
              isActive: true,
              password:employeeDetails.password ? await bcrypt.hash(employeeDetails.password,10):'',  
              address:newAddress,
          });

          return await this.employeeRepo.updateEmployeeDetails(newEmployee);
      } catch (err) {
        
         throw err;
      }  
      
    }
    async getEmployeeById(id: string){
      
        const employee = await this.employeeRepo.getEmployeeById(id);
        if(!employee){
            throw new EntityNotFoundException(ErrorCodes.USER_WITH_ID_NOT_FOUND);
        }
        return employee;
        
    }

    public employeeLogin = async (
        name: string,
        password: string
      ) => {
        const employeeDetails = await this.employeeRepo.getEmployeeByName(
          name
        );
        if (!employeeDetails) {
         throw new UserNotAuthorizedException();
        }
        const validPassword = await bcrypt.compare(password, employeeDetails.password);
        if (validPassword) {
          let payload = {
            "custom:id": employeeDetails.id,
            "custom:name": employeeDetails.name,
            "role":employeeDetails.role,
          };
          const token = this.generateAuthTokens(payload);

          return {
            idToken: token,
            employeeDetails,
          };
        } else {
          throw new IncorrectUsernameOrPasswordException();
        }
      };

     private generateAuthTokens = (payload: any) => {
        return jsonwebtoken.sign(payload, process.env.JWT_TOKEN_SECRET, {
          expiresIn: process.env.ID_TOKEN_VALIDITY,
        });
      };

    }
    