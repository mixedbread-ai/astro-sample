import Mixedbread from "@mixedbread/sdk";

if (!import.meta.env.MXBAI_API_KEY) {
  throw new Error("MXBAI_API_KEY environment variable is not set");
}

export const mxbai = new Mixedbread({
  apiKey: import.meta.env.MXBAI_API_KEY,
});