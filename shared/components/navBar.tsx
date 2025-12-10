import { HStack, Flex } from "@chakra-ui/react";
import MobileLateralMenu from "./mobileLateralMenu";
import useNavegables from "../hooks/useNavegables";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserCard from "@/core/user/components/userCard";
import NotificationsButton from "./notificationsButton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function NavBar() {
  const router: AppRouterInstance = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  function navegate(pathname: string) {
    setOpenMenu(false);
    router.push(pathname);
  }

  return (
    <HStack
      display={"flex "}
      justifyContent={"space-between"}
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      px={4}
      py={1}
      shadow="sm"
      width="100%"
      position="sticky"
      top={0}
      zIndex={10}
      _dark={{
        borderColor: "gray.700",
        bg: "gray.900",
        shadow: "lg",
      }}
    >
      <MobileLateralMenu
        items={useNavegables({ router: navegate })}
        title={"Aseguradora"}
        triggerSize={"xs"}
        open={openMenu}
        setOpen={setOpenMenu}
        onTitleClick={() => navegate("/aseguradora")}
      />
      <Flex gap={2} align="center">
        <NotificationsButton />
        <UserCard />
      </Flex>
    </HStack>
  );
}
