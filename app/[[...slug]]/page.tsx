import dynamic from "next/dynamic";

const DynamicApp = dynamic(() => import("@/src/App"), { ssr: false });

export default function LegacyApp() {
  return (
    <DynamicApp apiRoot={process.env.API_ROOT ?? "http://localhost:8080"} />
  );
}
