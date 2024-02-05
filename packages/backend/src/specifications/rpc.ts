import { z } from "zod";

export type HttpMethod = "get" | "post" | "delete" | "put";

export interface HttpEndpoint<M extends HttpMethod, P extends `/${string}`> {
  method: M;
  path: P;
}

const define_endpoint = <M extends HttpMethod, P extends `/${string}`>(args: {
  method: M;
  path: P;
}): HttpEndpoint<M, P> => {
  return args;
};

export const HttpEndpoint = {
  define: define_endpoint,
};

export interface HttpInOut<I, O> {
  _in: I;
  _out: O;
}

const define_inout = <I, O>(args: {
  _in: I;
  _out: O;
}): HttpInOut<I, O> => {
  return {
    _in: args._in,
    _out: args._out,
  };
};

export const HttpInOut = {
  define: define_inout,
};

export interface HttpSchema<I extends z.ZodType, O extends z.ZodType> {
  req: z.infer<I>;
  res: z.infer<O>;
}

const define_schema = <I extends z.ZodType, O extends z.ZodType>(args: {
  req: I;
  res: O;
}): HttpSchema<I, O> => {
  return args;
};

export const HttpSchema = {
  define: define_schema,
};

export interface HttpRpc<M extends HttpMethod, P extends `/${string}`, I, O> {
  endpoint: HttpEndpoint<M, P>;
  inout: HttpInOut<I, O>;
}

const define_rpc = <
  M extends HttpMethod,
  P extends `/${string}`,
  I,
  O,
  IZ extends z.ZodType,
  OZ extends z.ZodType,
>(args: {
  endpoint: HttpEndpoint<M, P>;
  inout: HttpInOut<I, O>;
  schema: HttpSchema<IZ, OZ>;
}): HttpRpc<M, P, I, O> => {
  return args;
};

export const HttpRpc = {
  define: define_rpc,
};
