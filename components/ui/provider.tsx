"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { theme } from "@/shared/theme/theme";
import React from "react";

export function Provider({
  children,
  ...props
}: React.PropsWithChildren<ColorModeProviderProps>) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider {...props}>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
