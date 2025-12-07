import { HStack } from "@chakra-ui/react";
import MobileLateralMenu from "./mobileLateralMenu";
import useNavegables from "../hooks/useNavegables";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserCard from "@/core/user/components/userCard";

export default function NavBar() {
  const router = useRouter();
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
      _dark={{
        borderColor: "gray.700",
        bg: "gray.900",
        shadow: "lg",
      }}
    >
      <MobileLateralMenu
        items={useNavegables([
          {
            section: "trades",
            subsection: "listTrades",
            action: () => navegate("/aseguradora/listTrades"),
          },
          {
            section: "trades",
            subsection: "createTrade",
            action: () => navegate("/aseguradora/createTrade"),
          },
          {
            section: "rules",
            subsection: "listRules",
            action: () => navegate("/aseguradora/listRules"),
          },
          {
            section: "rules",
            subsection: "createRule",
            action: () => navegate("/aseguradora/createRule"),
          },
        ])}
        title={"Aseguradora"}
        triggerSize={"xs"}
        open={openMenu}
        setOpen={setOpenMenu}
      />
      <UserCard />
    </HStack>
  );
}
