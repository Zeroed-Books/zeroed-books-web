import getConfig from "next/config";

const { publicConfig } = getConfig();

// We will potentially have other settings in the future.
// eslint-disable-next-line import/prefer-default-export
export const API_ROOT = publicConfig.apiRoot;
