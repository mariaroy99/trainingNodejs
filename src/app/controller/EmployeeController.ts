import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { EmployeeService } from "../service/EmployeeService";
import {CreateEmployeeDto} from "../dto/createEmployeeDto";
import validationMiddleware from "../middleware/validationMiddleware";
import authorize from "../middleware/authorize";
import { uuidDto } from "../dto/uuidDto";
import { UpdateEmployeeDto } from "../dto/updateEmployeeDto";


class EmployeeController extends AbstractController {
    constructor(private employeeService: EmployeeService) {
      super(`${APP_CONSTANTS.apiPrefix}/employee`);
      this.initializeRoutes();
    }

    protected initializeRoutes() {
      this.router.get(`${this.path}`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.superAdmin,APP_CONSTANTS.HR]), this.employeeResponse);
      this.router.post(`${this.path}`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.superAdmin]), validationMiddleware(CreateEmployeeDto, APP_CONSTANTS.body),this.createEmployee);
      this.router.put(`${this.path}/:id`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.superAdmin]),validationMiddleware(uuidDto,APP_CONSTANTS.params), validationMiddleware(UpdateEmployeeDto,APP_CONSTANTS.body,true), this.updateEmployeeDetails);
      this.router.delete(`${this.path}/:id`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.superAdmin]),validationMiddleware(uuidDto,APP_CONSTANTS.params),this.softDeleteEmployeeById);
      this.router.get(`${this.path}/:id`,authorize([APP_CONSTANTS.admin,APP_CONSTANTS.superAdmin,APP_CONSTANTS.HR]),validationMiddleware(uuidDto,APP_CONSTANTS.params), this.getEmployeeById);
      this.router.post( `${this.path}/login`, this.login);
    }

    private createEmployee = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction ) => {
        try {
          const data = await this.employeeService.createEmployee(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } 
        catch (err) {
          next(err);
        }
      }
    private employeeResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try {
        const data: any = await this.employeeService.getAllEmployees();
        response.status(200);
        response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
      } 
      catch (error) {
        return next(error);
      }
    }

    private softDeleteEmployeeById = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction) => {
        try {
          const data = await this.employeeService.softDeleteEmployeeById(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } 
        catch (err) {
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

      private getEmployeeById = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const {id} = request.params;
          const data = await this.employeeService.getEmployeeById(id);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } 
        catch (err) {
          next(err);
        }
      }

      private login = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction) => {
        try{
        const loginData = request.body;
        const loginDetail = await this.employeeService.employeeLogin(
          loginData.name,
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