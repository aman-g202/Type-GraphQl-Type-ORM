import { ApolloServer, Config as ApolloServerConfig } from 'apollo-server-koa';
import { GraphQLError } from 'graphql';

import ResponseCode from '../constants/enums/ResponseCodeEnum';
import httpStatus from '../constants/http-status';
import { createSchema } from './createSchema';

export default function createApolloServer(apolloServerConfig?: ApolloServerConfig) {
  const apolloServer = new ApolloServer({
    debug: true,
    schema: createSchema(),
    ...apolloServerConfig,
    // eslint-disable-next-line arrow-body-style
    formatError: (error: GraphQLError) => { // Global Error Handler
      const { message, extensions, locations, path } = error;

      const errorResponse = {
        message,
        errorPath: locations,
        path,
        statusCode: httpStatus.internal_server_error,
        responseCode: ResponseCode.SERVER_ERROR,
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (extensions!.code === 'GRAPHQL_VALIDATION_FAILED' || extensions!.code === 'BAD_USER_INPUT') {
        errorResponse.statusCode = httpStatus.client_validation;
        errorResponse.responseCode = ResponseCode.CLIENT_ERROR;
      }

      return errorResponse;
    },
  });

  return apolloServer;
}
