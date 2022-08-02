import HttpException from "./HttpException";
import { CustomError, ErrorCodes } from "../util/errorCode";

/**
 * This exception can use used in case an entity is not found.
 */
class IncorrectUseOrnamerPasswordException extends HttpException {

  constructor() {
    const error = ErrorCodes.INCORRECTUSERNAMEORPASSWORD;
    super(404, error.MESSAGE, error.CODE);
  }
}

export default IncorrectUseOrnamerPasswordException;