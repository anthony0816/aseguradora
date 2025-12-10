"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tk } from "@/core/auth/consts/consts";
import { Flex, Spinner } from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(tk.access_token);
    
    if (token) {
      router.push("/aseguradora");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <Flex justify="center" align="center" h="100vh">
      <Spinner size="xl" />
    </Flex>
  );
}
