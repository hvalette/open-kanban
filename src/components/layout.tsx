import { PropsWithChildren } from "react";
import Navbar from "./navbar";

export default function Layout({ children }: PropsWithChildren<any>) {
  return (
    <div className="min-h-full min-w-full">
      <Navbar />
      <main className="ml-16">{children}</main>
    </div>
  );
}
