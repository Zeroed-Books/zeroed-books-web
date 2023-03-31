import dynamic from "next/dynamic";

const DynamicApp = dynamic(() => import("@/src/App"), { ssr: false });

export default function LegacyApp() {
  return <DynamicApp />;
}
