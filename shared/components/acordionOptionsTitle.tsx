import { Flex, Icon, Span } from "@chakra-ui/react";

import { IconProps } from "@chakra-ui/react";
interface AcordionOptionsTitleProps {
  title: string;
  size: IconProps["size"];
  icon: React.ReactNode;
}

export default function AcordionOptionsTitle({
  title,
  size = "md",
  icon,
}: AcordionOptionsTitleProps) {
  return (
    <Flex cursor={"pointer"} alignItems="center" gap={2}>
      <Icon size={size}>{icon}</Icon>
      <Span>{title}</Span>
    </Flex>
  );
}
