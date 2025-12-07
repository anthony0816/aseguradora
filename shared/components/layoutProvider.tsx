"use client";

import {
  Box,
  VStack,
  HStack,
  Heading,
  Separator,
  Flex,
} from "@chakra-ui/react";
import NavBar from "./navBar";
import AcordionOptions from "./acordionOptions";
import useNavegables from "../hooks/useNavegables";
import { useRouter } from "next/navigation";
import UserCard from "@/core/user/components/userCard";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const router: AppRouterInstance = useRouter();

  function navegate(pathname: string) {
    router.push(pathname);
  }
  return (
    <>
      <VStack
        display={{ base: "flex", md: "none" }}
        width="100%"
        height="100%"
        gap={0}
      >
        <NavBar />
        <Box width="100%" flex={1} overflow="auto">
          {children}
        </Box>
      </VStack>

      <HStack
        display={{ base: "none", md: "flex" }}
        width="100%"
        height="100vh"
        gap={0}
      >
        <Box h={"100vh"} w={300} p={2}>
          <Flex
            flexDirection={"column"}
            w={"full"}
            p={2}
            h={"full"}
            _dark={{ bg: "gray.900" }}
            rounded={"xl"}
          >
            <Box flex={1}>
              <Heading as={"h1"}> Aseguradora</Heading>
              <Separator mb={10} />
              <Box overflowY={"auto"} overflowX={"hidden"} maxH={"80vh"}>
                <AcordionOptions items={useNavegables({ router: navegate })} />
              </Box>
            </Box>
            <Box>
              <UserCard />
            </Box>
          </Flex>
        </Box>

        <Box h={"100vh"} w={"full"} p={2} pl={0}>
          <Box h={"full"}>{children}</Box>
        </Box>
      </HStack>
    </>
  );
}
