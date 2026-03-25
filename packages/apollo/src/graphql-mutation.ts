import { GRAPHQL_MUTATION, GraphQLMutationOptions } from './types';

export function graphqlMutation<T, TData = any, TVars = any>(
  opts: GraphQLMutationOptions<T, TData, TVars>
) {
  const handler = async (_state: T, ..._args: any[]): Promise<Partial<T>> => {
    throw new Error('apolloClient() middleware is required for graphqlMutation signals');
  };

  Object.defineProperty(handler, GRAPHQL_MUTATION, {
    value: opts,
    enumerable: false,
    configurable: false,
  });

  return handler;
}
