"use client";
import { Flex, Icon, Span } from "@chakra-ui/react";

import { IconProps } from "@chakra-ui/react";
import React from "react";
interface AcordionOptionsTitleProps {
  title: string;
  size: IconProps["size"];
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function AcordionOptionsContent({
  title,
  size = "md",
  icon,
  onClick,
}: AcordionOptionsTitleProps) {
  return (
    <Flex
      onClick={() => onClick && onClick()}
      _hover={{ bg: "hover.light" }}
      _dark={{ _hover: { bg: "hover.dark" } }}
      cursor="pointer"
      alignItems="center"
      gap={2}
      px={3}
      py={2}
      borderRadius="md"
      transition="background-color 0.2s"
    >
      <Icon size={size}>{icon}</Icon>
      <Span>{title}</Span>
    </Flex>
  );
}
