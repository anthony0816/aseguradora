"use client";

import { Box, Heading, Table, Button, Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/hooks/authHook";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Account {
  id: number;
  login: number;
  trading_status: string;
  status: string;
  created_at: string;
}

export default function ListAccountsPage() {
  const { accessToken } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    const res = await fetch("/api/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      const data = await res.json();
      setAccounts(data);
    }
    setLoading(false);
  }

  async function toggleTradingStatus(account: Account) {
    const newStatus = account.trading_status === "enable" ? "disable" : "enable";
    const res = await fetch(`/api/accounts/${account.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ trading_status: newStatus }),
    });

    if (res.ok) {
      fetchAccounts();
    }
  }

  async function toggleStatus(account: Account) {
    const newStatus = account.status === "enable" ? "disable" : "enable";
    const res = await fetch(`/api/accounts/${account.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchAccounts();
    }
  }

  async function deleteAccount(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta cuenta?")) return;

    const res = await fetch(`/api/accounts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok || res.status === 204) {
      fetchAccounts();
    }
  }

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1">Mis Cuentas</Heading>
        <Link href="/aseguradora/createAccount">
          <Button>Crear Cuenta</Button>
        </Link>
      </Flex>

      {loading ? (
        <p>Cargando...</p>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <p>No tienes cuentas creadas</p>
          <Link href="/aseguradora/createAccount">
            <Button mt={4}>Crear primera cuenta</Button>
          </Link>
        </Box>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Login</Table.ColumnHeader>
              <Table.ColumnHeader>Trading</Table.ColumnHeader>
              <Table.ColumnHeader>Estado</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.map((account) => (
              <Table.Row key={account.id}>
                <Table.Cell>{account.login}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    variant={account.trading_status === "enable" ? "solid" : "outline"}
                    colorPalette={account.trading_status === "enable" ? "green" : "red"}
                    onClick={() => toggleTradingStatus(account)}
                  >
                    {account.trading_status === "enable" ? "Habilitado" : "Deshabilitado"}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    variant={account.status === "enable" ? "solid" : "outline"}
                    colorPalette={account.status === "enable" ? "blue" : "gray"}
                    onClick={() => toggleStatus(account)}
                  >
                    {account.status === "enable" ? "Activo" : "Inactivo"}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  {new Date(account.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={2}>
                    <IconButton
                      size="sm"
                      colorPalette="red"
                      onClick={() => deleteAccount(account.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
