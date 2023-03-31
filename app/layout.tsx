import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "Zeroed Books",
  description: "The Zeroed Books web app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
