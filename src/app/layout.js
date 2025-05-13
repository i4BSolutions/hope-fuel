import MainProvider from "../lib/MainProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
