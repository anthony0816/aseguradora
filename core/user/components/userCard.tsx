"use client";

import {
  Box,
  Flex,
  Text,
  Circle,
  Icon,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "@chakra-ui/react";
import { useAuth } from "@/core/auth/hooks/authHook";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function UserCard() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Flex
          alignItems="center"
          gap={3}
          p={2}
          rounded="lg"
          cursor="pointer"
          _hover={{ bg: "gray.100" }}
          _dark={{ _hover: { bg: "gray.800" } }}
          transition="background-color 0.2s"
        >
          <Circle
            size="10"
            bg="brand.700"
            color="white"
            fontWeight="semibold"
            fontSize="sm"
          >
            {getInitials(user.name)}
          </Circle>
          <Box display={{ base: "none", md: "block" }}>
            <Text fontWeight="semibold" fontSize="sm" lineHeight="tight">
              {user.name}
            </Text>
            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
              {user.email}
            </Text>
          </Box>
        </Flex>
      </MenuTrigger>

      <MenuContent>
        <MenuItem value="profile" cursor="pointer">
          <Icon mr={2}>
            <PersonIcon fontSize="small" />
          </Icon>
          Mi Perfil
        </MenuItem>

        {user.is_admin && (
          <MenuItem value="admin" cursor="pointer">
            <Icon mr={2}>
              <AdminPanelSettingsIcon fontSize="small" />
            </Icon>
            Panel Admin
          </MenuItem>
        )}

        <MenuSeparator />

        <MenuItem
          value="logout"
          cursor="pointer"
          color="red.600"
          _dark={{ color: "red.400" }}
          onClick={logout}
        >
          <Icon mr={2}>
            <LogoutIcon fontSize="small" />
          </Icon>
          Cerrar Sesión
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
