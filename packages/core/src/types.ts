import { Signal } from "./signal";

export type Shift<T extends any[]> = ((...args: T) => any) extends (first: any, ...rest: infer R) => any ? R : never;

export type OmitState<T extends [state?: any, ...rest: any[]]> = Shift<T>;

export type FunctionFromTuple<T extends any[]> = (...args: OmitState<T>) => any;

export type SignalFunction<T, U extends (state: T, ...args: any) => any> = Signal<U> & FunctionFromTuple<Parameters<U>>;

export type TransformArgumentsToSignalInstances<
  T,
  U extends string[] | Record<string, (...args: any[]) => any>
> = U extends Array<string>
  ? { [K in U[number]]: SignalFunction<T, (...args: any[]) => any> }
  : { [K in keyof U]: U[K] extends (...args: any[]) => any ? SignalFunction<T, U[K]> : never };
