/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, InterfaceType } from "type-graphql";
import ResponseCode from "../constants/enums/ResponseCodeEnum";

@InterfaceType()
export default abstract class IResponse {
  @Field()
  message: string;

  @Field(type => Int)
  statusCode: number;

  @Field(type => ResponseCode, { defaultValue: ResponseCode.OK })
  responseCode: ResponseCode;
}