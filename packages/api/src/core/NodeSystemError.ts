/**
 * Missing from TypeScript but documented by node.
 * See https://nodejs.org/api/errors.html#class-systemerror
 * @link https://gist.github.com/reporter123/7c10e565fb849635787321766b7f8ad8
 */
export interface NodeSystemError extends Error {
  address?: string; //If present, the address to which a network connection failed
  code: string; // The string error code
  dest: string; // If present, the file path destination when reporting a file system error
  errno: number; // The system-provided error number
  info?: object; // If present, extra details about the error condition
  message: string; // A system-provided human-readable description of the error
  path?: string; // If present, the file path when reporting a file system error
  port?: number; // If present, the network connection port that is not available
  syscall: string; // The name of the system call that triggered the error
}

export const NodeSystemError = {
  guard(x: unknown): x is NodeSystemError {
    const e = x as Partial<NodeSystemError>;
    return typeof e.code === "string" && typeof e.syscall === "string";
  },
};
