"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks/authHook";
import AuthInput from "@/core/auth/components/authinput";
import ModalNotification from "@/shared/components/modalNotifications";

interface Account {
  id: number;
  login: number;
}

export default function CreateTradePage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("BUY");
  const [volume, setVolume] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    const res = await fetch("/api/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setAccounts(data);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!accountId || !volume || !openPrice) {
      setNotifiTitle("Campos vacíos");
      setNotifiContent("Todos los campos son obligatorios");
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        account_id: parseInt(accountId),
        type,
        volume: parseFloat(volume),
        open_time: new Date().toISOString().slice(0, 19).replace("T", " "),
        open_price: parseFloat(openPrice),
        status: "open",
      }),
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      setNotifiTitle("Error al crear trade");
      setNotifiContent(data.message || "Error inesperado");
      setOpenModalNotification(true);
      return;
    }

    setNotifiTitle("Trade creado");
    setNotifiContent("El trade se creó exitosamente");
    setOpenModalNotification(true);

    setTimeout(() => {
      router.push("/aseguradora/listTrades");
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
          Crear Trade
        </Heading>
        <Box color="gray.600" _dark={{ color: "gray.400" }} mb={6} fontSize="sm">
          Registra una nueva operación de trading
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Stack spaceY={4}>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Cuenta
                </Text>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.login}
                    </option>
                  ))}
                </select>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Selecciona la cuenta donde se ejecutará el trade
                </Text>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Tipo de Operación
                </Text>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="BUY">BUY (Compra)</option>
                  <option value="SELL">SELL (Venta)</option>
                </select>
              </Box>

              <AuthInput
                label="Volumen (lotes)"
                placeholder="1.5"
                type="number"
                step="0.01"
                onChange={(value) => setVolume(value)}
                required
              />

              <AuthInput
                label="Precio de Apertura"
                placeholder="1.2345"
                type="number"
                step="0.00001"
                onChange={(value) => setOpenPrice(value)}
                required
              />

              <HStack justify="flex-end" gap={3} mt={4}>
                <Button
                  variant="outline"
                  onClick={() => router.push("/aseguradora/listTrades")}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={loading} colorPalette="blue">
                  Crear Trade
                </Button>
              </HStack>
            </Stack>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
