"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks/authHook";
import AuthInput from "@/core/auth/components/authinput";
import ModalNotification from "@/shared/components/modalNotifications";

export default function CreateAccountPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [tradingStatus, setTradingStatus] = useState("enable");
  const [status, setStatus] = useState("enable");
  const [loading, setLoading] = useState(false);

  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || !user) return;

    if (!login) {
      setNotifiTitle("Campo vacío");
      setNotifiContent("El login es obligatorio");
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        owner_id: user.id,
        login: parseInt(login),
        trading_status: tradingStatus,
        status: status,
      }),
    });

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      setNotifiTitle("Error al crear cuenta");
      setNotifiContent(data.message || "Error inesperado");
      setOpenModalNotification(true);
      return;
    }

    setNotifiTitle("Cuenta creada");
    setNotifiContent("La cuenta se creó exitosamente");
    setOpenModalNotification(true);

    setTimeout(() => {
      router.push("/aseguradora/listAccounts");
    }, 1500);
  }

  return (
    <Box h="full" overflowY="auto" p={6}>
      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      <Box maxW="700px" mx="auto">
        <Heading as="h1" mb={2}>
          Crear Cuenta
        </Heading>
        <Box color="gray.600" _dark={{ color: "gray.400" }} mb={6} fontSize="sm">
          Registra una nueva cuenta de trading
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={6}
          rounded="lg"
          borderWidth="1px"
          bg="white"
          _dark={{ bg: "gray.800" }}
        >
          <Stack spaceY={4}>
            <AuthInput
              label="Login (Número de cuenta)"
              placeholder="123456789"
              type="number"
              onChange={(value) => setLogin(value)}
              required
            />

            <Box>
              <Text fontWeight="medium" mb={2}>
                Estado de Trading
              </Text>
              <select
                value={tradingStatus}
                onChange={(e) => setTradingStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="enable">Habilitado</option>
                <option value="disable">Deshabilitado</option>
              </select>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Controla si se pueden ejecutar trades en esta cuenta
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Estado de Cuenta
              </Text>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="enable">Activa</option>
                <option value="disable">Inactiva</option>
              </select>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Estado general de la cuenta
              </Text>
            </Box>

            <HStack justify="flex-end" gap={3} mt={4}>
              <Button
                variant="outline"
                onClick={() => router.push("/aseguradora/listAccounts")}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} colorPalette="blue">
                Crear Cuenta
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
