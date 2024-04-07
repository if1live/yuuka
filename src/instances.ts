const derivePath_node = async () => {
  // vite환경에서는 node:xxx 사용할수 없어서 땜질
  const path = await import("node:path");
  const url = await import("node:url");

  // https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
  const filename = url.fileURLToPath(import.meta.url);
  const dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const packagePath = path.join(dirname, "..");
  const viewPath = path.join(packagePath, "views");

  return viewPath;
};

const derivePath_vite = () => {
  return "";
};

// TODO: vite에서 안돌아서 땜질
// const viewPath = import.meta.env ? derivePath_vite() : await derivePath_node();
export const viewPath = derivePath_vite();

// export const engine = new Liquid({
//   root: viewPath,
//   extname: ".liquid",
//   cache: process.env.NODE_ENV === "production",
// });

export const engine = {
  async renderFile(name: string, data: Record<string, unknown>) {
    throw new Error("todo");
  },
};
