"use client";

import { Box, Heading, Table, Button, Flex, IconButton, Badge } from "@chakra-ui/react";
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
    <Box h="full" overflowY="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Heading as="h1">Mis Cuentas</Heading>
          <Box fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mt={1}>
            {accounts.filter((a) => a.status === "enable").length} activas de{" "}
            {accounts.length} cuentas
          </Box>
        </Box>
        <Link href="/aseguradora/createAccount">
          <Button colorPalette="blue">Crear Cuenta</Button>
        </Link>
      </Flex>

      {loading ? (
        <Box textAlign="center" py={10}>
          <p>Cargando cuentas...</p>
        </Box>
      ) : accounts.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
        >
          <Heading size="md" mb={2}>
            No tienes cuentas creadas
          </Heading>
          <Box color="gray.600" _dark={{ color: "gray.400" }} mb={4}>
            Crea tu primera cuenta para comenzar a operar
          </Box>
          <Link href="/aseguradora/createAccount">
            <Button colorPalette="blue">Crear primera cuenta</Button>
          </Link>
        </Box>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Cuenta</Table.ColumnHeader>
              <Table.ColumnHeader>Estado de Trading</Table.ColumnHeader>
              <Table.ColumnHeader>Estado General</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.map((account) => (
              <Table.Row key={account.id}>
                <Table.Cell>
                  <Box>
                    <Box fontWeight="bold" fontSize="lg">
                      {account.login}
                    </Box>
                    <Box fontSize="xs" color="gray.500" mt={1}>
                      Creada:{" "}
                      {new Date(account.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Box>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap={2}>
                    <Badge
                      colorPalette={
                        account.trading_status === "enable" ? "green" : "red"
                      }
                    >
                      {account.trading_status === "enable"
                        ? "Habilitado"
                        : "Deshabilitado"}
                    </Badge>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette={
                        account.trading_status === "enable" ? "red" : "green"
                      }
                      onClick={() => toggleTradingStatus(account)}
                    >
                      {account.trading_status === "enable"
                        ? "Deshabilitar"
                        : "Habilitar"}
                    </Button>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap={2}>
                    <Badge
                      colorPalette={account.status === "enable" ? "blue" : "gray"}
                    >
                      {account.status === "enable" ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette={account.status === "enable" ? "gray" : "blue"}
                      onClick={() => toggleStatus(account)}
                    >
                      {account.status === "enable" ? "Desactivar" : "Activar"}
                    </Button>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => deleteAccount(account.id)}
                    title="Eliminar"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
