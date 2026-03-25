import { GRAPHQL_QUERY, GraphQLQueryOptions } from './types';

export function graphqlQuery<T, TData = any, TVars = any>(
  opts: GraphQLQueryOptions<T, TData, TVars>
) {
  const handler = async (_state: T, ..._args: any[]): Promise<Partial<T>> => {
    throw new Error('apolloClient() middleware is required for graphqlQuery signals');
  };

  Object.defineProperty(handler, GRAPHQL_QUERY, {
    value: opts,
    enumerable: false,
    configurable: false,
  });

  return handler;
}
