import { Signal } from "./signal";

export type Shift<T extends any[]> = ((...args: T) => any) extends (first: any, ...rest: infer R) => any ? R : never;

export type OmitState<T extends [state?: any, ...rest: any[]]> = Shift<T>;

export type FunctionFromTuple<T, U extends any[]> = (...args: OmitState<U>) => Promise<Partial<T>>;

export type SignalFunction<T, U extends (state: T, ...args: any) => any> = Signal<T, U> & FunctionFromTuple<T, Parameters<U>>;

export type SignalDef<T> = Record<string, (state: T, ...args: any) => void | Partial<T> | Promise<void | Partial<T>>> | string[];

export type TransformArgumentsToSignalInstances<
  T,
  U extends SignalDef<T>
> = U extends string[]
  ? { [K in U[number]]: SignalFunction<T, (state: T, ...args: any[]) => Promise<Partial<T>> | Partial<T>> }
  : { [K in keyof U]: U[K] extends (state: T, ...args: any[]) => any ? SignalFunction<T, U[K]> : never };
