import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

const authorizationParams = {
  audience: "https://api.zeroedbooks.com/",
  scope: "openid profile email",
};

export default handleAuth({
  login: handleLogin({
    authorizationParams,
  }),
  signup: handleLogin({
    authorizationParams: { ...authorizationParams, screen_hint: "signup" },
  }),
});
