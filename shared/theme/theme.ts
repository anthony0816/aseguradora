import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f4f8" },
          900: { value: "#1a365d" },
          800: { value: "#153e75" },
          700: { value: "#2a69ac" },
        },

        hover: {
          light: { value: "#e0e7ff" },
          dark: { value: "#2d3748" },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Roboto', sans-serif` },
      },
    },
  },
});

export const theme = createSystem(defaultConfig, customConfig);

export default theme;
