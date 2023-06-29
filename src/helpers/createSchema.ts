import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions, buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';

export function createSchema(options?: Omit<BuildSchemaOptions, 'resolvers'>): GraphQLSchema {
  // The error was "Type Query must define one or more fields" which was coming because
  // resolver path was incorrect due to which it was not able to load the schema,
  // Moreover GraphQl states type Query can not be empty
  return buildSchemaSync({
    resolvers: [`${__dirname}/../resolvers/**/*Resolver.ts`],
    emitSchemaFile: true,
    container: Container,
    validate: true,
    ...options,
  });
}
