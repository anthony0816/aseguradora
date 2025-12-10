"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
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
    <Box p={6}>
      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      <Heading as="h1" mb={6}>
        Crear Trade
      </Heading>

      <form onSubmit={handleSubmit}>
        <Box maxW="500px" p={6} rounded="lg" boxShadow="md">
        <Stack spaceY={4}>
          <Box>
            <label>Cuenta</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
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
          </Box>

          <Box>
            <label>Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </Box>

          <AuthInput
            label="Volumen"
            placeholder="1.5"
            type="number"
            onChange={(value) => setVolume(value)}
            required
          />

          <AuthInput
            label="Precio de Apertura"
            placeholder="1.2345"
            type="number"
            onChange={(value) => setOpenPrice(value)}
            required
          />

          <Button type="submit" loading={loading}>
            Crear Trade
          </Button>
        </Stack>
        </Box>
      </form>
    </Box>
  );
}
