import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { DepartmentService } from "../service/DepartmentService";
import validationMiddleware from "../middleware/validationMiddleware";
import {CreateDepartmentDto} from "../dto/createDepartmentDto";

class DepartmentController extends AbstractController {
    constructor(private departmentService: DepartmentService) {
      super(`${APP_CONSTANTS.apiPrefix}/department`);
      this.initializeRoutes();
    }
    protected initializeRoutes() {
      this.router.get(`${this.path}`, this.departmentResponse);
      this.router.post( `${this.path}`,
         validationMiddleware(CreateDepartmentDto, APP_CONSTANTS.body),
        // this.asyncRouteHandler(this.createEmployee)
        this.createDepartment
      );
      this.router.delete(`${this.path}`, this.softDeleteDepartmentById);
      this.router.put(`${this.path}/:id`, this.updateDepartmentDetails);

    }
    private createDepartment = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.departmentService.createDepartment(request.body);
          response.send(
            this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
          );
        } catch (err) {
          next(err);
        }
      }
    private departmentResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
      try {
        const data: any = await this.departmentService.getAllDepartments();
        response.status(200);
        response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
      } catch (error) {
        return next(error);
      }
    }

    private softDeleteDepartmentById = async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction
    ) => {
      try {
        const data = await this.departmentService.softDeleteDepartmentById(request.body);
        response.send(
          this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
        );
      } catch (err) {
        next(err);
      }
    }

    private updateDepartmentDetails = async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction
    ) => {
      try {
        const data = await this.departmentService.updateDepartmentDetails(request.params.id, request.body);
        response.send(
          this.fmt.formatResponse(data, Date.now() - request.startTime, "OK")
        );
      } catch (err) {
        next(err);
      }
    }

  }
  
  export default DepartmentController;