import React from "react";
import LayoutProvider from "@/shared/components/layoutProvider";

export default function AseguradoraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
