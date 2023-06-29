/* eslint-disable @typescript-eslint/no-unused-vars */

import ResponseCode from '../constants/enums/ResponseCodeEnum';

/* eslint-disable arrow-body-style */
export const successResponse = <T>(response: {
  statusCode: number;
  responseCode: ResponseCode;
  message: string;
  result: T[];
}) => {
  return response;
};
