import { z } from "zod";
import { MyRequest } from "./MyRequest.js";
import { MyResponse } from "./MyResponse.js";

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

export interface InOutSchema<IZ extends z.ZodType, OZ extends z.ZodType> {
  req: IZ;
  res: OZ;
  _in: z.infer<IZ>;
  _out: z.infer<OZ>;
}

const define_schema = <IZ extends z.ZodType, OZ extends z.ZodType>(args: {
  req: IZ;
  res: OZ;
}): InOutSchema<IZ, OZ> => {
  return {
    req: args.req,
    res: args.res,
    _in: {} as z.infer<IZ>,
    _out: {} as z.infer<OZ>,
  };
};

export const InOutSchema = {
  define: define_schema,
};

export interface HttpRpc<
  M extends HttpMethod,
  P extends `/${string}`,
  I,
  O,
  IZ extends z.ZodType,
  OZ extends z.ZodType,
> {
  endpoint: HttpEndpoint<M, P>;
  inout: HttpInOut<I, O>;
  schema: InOutSchema<IZ, OZ>;
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
  schema: InOutSchema<IZ, OZ>;
}): HttpRpc<M, P, I, O, IZ, OZ> => {
  return args;
};

export const HttpRpc = {
  define: define_rpc,
};

export type ControllerFn<I, O> = (req: MyRequest<I>) => Promise<MyResponse<O>>;

export type AsControllerFn<T> = T extends HttpRpc<
  infer M,
  infer P,
  infer I,
  infer O,
  infer IZ,
  infer OZ
>
  ? ControllerFn<I, O>
  : never;
