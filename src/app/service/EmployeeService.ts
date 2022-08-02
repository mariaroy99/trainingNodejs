import { plainToClass } from "class-transformer";
import { Employee } from "../entities/Employee";
import EntityNotFoundException from "../exception/EntityNotFoundException";
import { EmployeeRespository } from "../repository/employeeRepository";
import { ErrorCodes } from "../util/errorCode";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"
import UserNotAuthorizedException from "../exception/UserNotAuthorisedException";
import IncorrectUsernameOrPasswordException from "../exception/IncorrectUsernameOrPasswordException";

export class EmployeeService{
    constructor(private employeeRepo: EmployeeRespository){ }
    async getAllEmployees(){
        return await this.employeeRepo.getAllEmployees();
        
    }
    async softDeleteEmployeeById(id: string){
        return await this.employeeRepo.softDeleteEmployeeById(id);
        
        
    }
    public async createEmployee(employeeDetails: any) {
        try {
            const newEmployee = plainToClass(Employee, {
                name: employeeDetails.name,
                // username: employeeDetails.username,
                // age: employeeDetails.age,
                joiningDate:employeeDetails.joiningDate,
                departmentId: employeeDetails.departmentId,
                role: employeeDetails.role,
                experience: employeeDetails.experience,
                isActive: true,
                password:employeeDetails.password ? await bcrypt.hash(employeeDetails.password,10):'',  //conditional statement
            });
            const save = await this.employeeRepo.saveEmployeeDetails(newEmployee);
            return save;
        } catch (err) {
           // throw new HttpException(400, "Failed to create employee");
           throw err;
        }
    }
    public async updateEmployeeDetails(employeeId: string, employeeDetails: any) {
        return await this.employeeRepo.updateEmployeeDetails(employeeId,employeeDetails);
    }
    async getEmployeeId(id: string){
        //return await this.employeeRepo.getEmployeeId(id);
        const employee = await this.employeeRepo.getEmployeeId(id);
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
    