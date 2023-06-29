import { registerEnumType } from "type-graphql";

enum ResponseCode {
    CLIENT_ERROR = 'CLIENT_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    RESOURCE_ERROR = 'RESOURCE_ERROR',
    OK = 'OK',
};

/* Register enum or union types */
registerEnumType(ResponseCode, {
  name: "ResponseCode", // this one is mandatory
  description: "Response code for success response", // this one is optional
});

export default ResponseCode;