import type { Metadata } from "next";
import { Header, Footer, Playground } from "@/components/site";
export const metadata: Metadata = {
  title: "Playground",
  description:
    "Try real VLD validation directly in your browser. Edit JSON, explore schemas, and inspect validation results.",
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Playground standalone />
      </main>
      <Footer />
    </>
  );
}
