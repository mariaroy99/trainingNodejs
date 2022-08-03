import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { EmployeeService } from "../service/EmployeeService";
import {CreateEmployeeDto} from "../dto/createEmployeeDto";
import validationMiddleware from "../middleware/validationMiddleware";
import authorize from "../middleware/authorize";
import { uuidDto } from "../dto/uuidDto";
import { loginDto } from "../dto/loginDto";

// class EmployeeController extends AbstractController {
//   constructor() {
//     super(`${APP_CONSTANTS.apiPrefix}/employee`);
//     this.initializeRoutes();
//   }
//   protected initializeRoutes() {
//     this.router.get(`${this.path}`, this.employeeResponse);
//   }
//   private employeeResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
//     try {
//       const data: any = { message: "Get all Employees"};
//       response.status(200);
//       response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
//     } catch (error) {
//       return next(error);
//     }
//   }
// }

// export default EmployeeController;
class EmployeeController extends AbstractController {
    constructor(private employeeService: EmployeeService) {
      super(`${APP_CONSTANTS.apiPrefix}/employee`);
      this.initializeRoutes();
    }
    protected initializeRoutes() {
      this.router.get(`${this.path}`, authorize(["admin","superAdmin","HR"]), this.employeeResponse);
      this.router.post(`${this.path}`, validationMiddleware(CreateEmployeeDto, APP_CONSTANTS.body),
        // this.asyncRouteHandler(this.createEmployee),
         this.createEmployee
      );
      this.router.put(`${this.path}/:id`, this.updateEmployeeDetails);
      this.router.delete(`${this.path}`, validationMiddleware(uuidDto,APP_CONSTANTS.params),this.softDeleteEmployeeById);
      this.router.get(`${this.path}/:id`,validationMiddleware(uuidDto,APP_CONSTANTS.params), this.getEmployeeId);
      this.router.post( `${this.path}/login`, validationMiddleware(loginDto,APP_CONSTANTS.body),this.login
      );

    }
    private createEmployee = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.employeeService.createEmployee(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } catch (err) {
          next(err);
        }
      }
    private employeeResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try {
        const data: any = await this.employeeService.getAllEmployees();
        response.status(200);
        response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
      } catch (error) {
        return next(error);
      }
    }
    private softDeleteEmployeeById = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.employeeService.softDeleteEmployeeById(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } catch (err) {
          next(err);
        }
      }

      private updateEmployeeDetails = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.employeeService.updateEmployeeDetails(request.params.id, request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } catch (err) {
          next(err);
        }
      }

      private getEmployeeId = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const {id} = request.params;
          const data = await this.employeeService.getEmployeeId(id);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } catch (err) {
          next(err);
        }
      }

      private login = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try{
        const loginData = request.body;
        const loginDetail = await this.employeeService.employeeLogin(
          loginData.name,
          //toLowercase()
          loginData.password
        );
        response.send(
          this.fmt.formatResponse(loginDetail, Date.now() - request.startTime, "OK")
        );}
        catch(err){
          next(err);
        }
      };
  }
  
  export default EmployeeController;