import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import httpProxy from "http-proxy";
import type { NextApiRequest, NextApiResponse } from "next";

const API_ROOT = process.env.API_ROOT;

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withApiAuthRequired(async function proxyApiRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid", "profile", "email"],
  });

  return new Promise<void>((resolve, reject) => {
    req.url = req.url?.replace("/api/proxy", "");

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    proxy.web(
      req,
      res,
      {
        target: API_ROOT,
        changeOrigin: true,
        headers,
      },
      (err) => {
        if (err) {
          console.error(err);
          return reject(err);
        }

        resolve();
      }
    );
  });
});
