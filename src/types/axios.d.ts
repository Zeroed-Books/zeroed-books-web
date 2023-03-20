declare module "axios/lib/adapters/http" {
  import { AxiosAdapter } from "axios";

  const adapter: AxiosAdapter;

  export default adapter;
}
