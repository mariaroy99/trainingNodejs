import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request } from "express";
import * as express from "express";
import HttpException from "../exception/HttpException";
import APP_CONSTANTS from "../constants";
import { ErrorCodes } from "../util/errorCode";


/**
 * Middleware to validate the request.
 * Validations are performed using class validator
 */
function validationMiddleware<T>(type: any, parameter: string, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    let reqValidator;
    switch(parameter){
        case APP_CONSTANTS.body : reqValidator = req.body;
        break;
        case APP_CONSTANTS.params: reqValidator = req.params;
        break;
    }
    const requestBody: any = plainToClass(type, reqValidator);
    validate(
      requestBody, { skipMissingProperties, forbidUnknownValues: true, whitelist: true })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const errorDetail = ErrorCodes.VALIDATION_ERROR;
          next(new HttpException(400, errorDetail.MESSAGE, errorDetail.CODE, errors));
          //next(errors);
        } else {
            switch(parameter){
                case APP_CONSTANTS.body : req.body = requestBody;
                break;
                case APP_CONSTANTS.params: req.params = requestBody;
                break;
            }
            // req[parameter] = requestBody;
          next();
        }
      });
  };
}
export default validationMiddleware;