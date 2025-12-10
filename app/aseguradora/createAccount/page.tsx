"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
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
    <Box p={6}>
      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      <Heading as="h1" mb={6}>
        Crear Cuenta
      </Heading>

      <Box
        as="form"
        onSubmit={handleSubmit}
        maxW="500px"
        p={6}
        rounded="lg"
        boxShadow="md"
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
            <label>Estado de Trading</label>
            <select
              value={tradingStatus}
              onChange={(e) => setTradingStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="enable">Habilitado</option>
              <option value="disable">Deshabilitado</option>
            </select>
          </Box>

          <Box>
            <label>Estado de Cuenta</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="enable">Habilitado</option>
              <option value="disable">Deshabilitado</option>
            </select>
          </Box>

          <Button type="submit" loading={loading}>
            Crear Cuenta
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
