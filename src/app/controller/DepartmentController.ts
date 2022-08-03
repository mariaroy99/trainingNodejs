import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { DepartmentService } from "../service/DepartmentService";
import validationMiddleware from "../middleware/validationMiddleware";
import {CreateDepartmentDto} from "../dto/createDepartmentDto";
import { uuidDto } from "../dto/uuidDto";
import authorize from "../middleware/authorize";

class DepartmentController extends AbstractController {
    constructor(private departmentService: DepartmentService) {
      super(`${APP_CONSTANTS.apiPrefix}/department`);
      this.initializeRoutes();
    }
    protected initializeRoutes() {
      this.router.get(`${this.path}`, authorize([APP_CONSTANTS.HR,APP_CONSTANTS.admin]),this.departmentResponse);
      this.router.post( `${this.path}`, authorize([APP_CONSTANTS.HR,APP_CONSTANTS.admin]), validationMiddleware(CreateDepartmentDto, APP_CONSTANTS.body),this.createDepartment);
      this.router.get(`${this.path}/:id`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.HR]),validationMiddleware(uuidDto,APP_CONSTANTS.params), this.getDepartmentId);
      this.router.delete(`${this.path}`, authorize([APP_CONSTANTS.admin,,APP_CONSTANTS.HR]),  validationMiddleware(uuidDto,APP_CONSTANTS.params),this.softDeleteDepartmentById);
      this.router.put(`${this.path}/:id`, authorize([APP_CONSTANTS.admin,APP_CONSTANTS.HR]), this.updateDepartmentDetails);
    }

    private createDepartment = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction ) => {
        try {
          const data = await this.departmentService.createDepartment(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } 
        catch (err) {
          next(err);
        }
      }
    private departmentResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try {
        const data: any = await this.departmentService.getAllDepartments();
        response.status(200);
        response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
      } 
      catch (error) {
        return next(error);
      }
    }

    private softDeleteDepartmentById = async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction) => {
      try {
        const data = await this.departmentService.softDeleteDepartmentById(request.body);
        response.send(
          this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
        );
      } 
      catch (err) {
        next(err);
      }
    }

    private updateDepartmentDetails = async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction ) => {
      try {
        const data = await this.departmentService.updateDepartmentDetails(request.params.id, request.body);
        response.send(
          this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
        );
      } 
      catch (err) {
        next(err);
      }
    }

    private getDepartmentId = async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction) => {
      try {
        const {id} = request.params;
        const data = await this.departmentService.getDepartmentId(id);
        response.send(
          this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
        );
      } 
      catch (err) {
        next(err);
      }
    }

  }
  
  export default DepartmentController;