"use client";

import { Box, Heading, Table, Button, Flex, IconButton, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/hooks/authHook";
import { ApiService } from "@/shared/services/api";
import { Account } from "@/shared/types";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";

export default function ListAccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    setError(null);
    
    try {
      // Si es admin, puede ver todas las cuentas con ?all=true
      const data = await ApiService.getAccounts(user?.is_admin || false);
      setAccounts(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error al cargar cuentas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTradingStatus(account: Account) {
    try {
      const newStatus = account.trading_status === "enable" ? "disable" : "enable";
      await ApiService.updateAccount(account.id, { trading_status: newStatus });
      fetchAccounts();
    } catch (error: any) {
      console.error("Error al cambiar estado de trading:", error);
    }
  }

  async function toggleStatus(account: Account) {
    try {
      const newStatus = account.status === "enable" ? "disable" : "enable";
      await ApiService.updateAccount(account.id, { status: newStatus });
      fetchAccounts();
    } catch (error: any) {
      console.error("Error al cambiar estado de cuenta:", error);
    }
  }

  async function deleteAccount(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta cuenta?")) return;

    try {
      await ApiService.deleteAccount(id);
      fetchAccounts();
    } catch (error: any) {
      console.error("Error al eliminar cuenta:", error);
    }
  }

  function hasActiveIncidents(account: Account): boolean {
    return account.incidents ? account.incidents.length > 0 : false;
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
      ) : error ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="red.50"
          _dark={{ bg: "red.900" }}
        >
          <Heading size="md" mb={2} color="red.600">
            Error al cargar cuentas
          </Heading>
          <Box color="red.500" mb={4}>
            {error}
          </Box>
          <Button colorPalette="red" onClick={fetchAccounts}>
            Reintentar
          </Button>
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
              <Table.ColumnHeader>Propietario</Table.ColumnHeader>
              <Table.ColumnHeader>Estado de Trading</Table.ColumnHeader>
              <Table.ColumnHeader>Estado General</Table.ColumnHeader>
              <Table.ColumnHeader>Riesgos</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.map((account) => (
              <Table.Row key={account.id}>
                <Table.Cell>
                  <Box>
                    <Flex align="center" gap={2}>
                      <Box fontWeight="bold" fontSize="lg">
                        {account.login}
                      </Box>
                      {hasActiveIncidents(account) && (
                        <WarningIcon fontSize="small" color="warning" />
                      )}
                    </Flex>
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
                  {account.owner ? (
                    <Box>
                      <Box fontWeight="medium">{account.owner.name}</Box>
                      <Box fontSize="xs" color="gray.500">{account.owner.email}</Box>
                      {account.owner.is_admin && (
                        <Badge colorPalette="purple" size="sm">Admin</Badge>
                      )}
                    </Box>
                  ) : (
                    <Box fontSize="sm" color="gray.500">Sin propietario</Box>
                  )}
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
                  <Box>
                    {hasActiveIncidents(account) ? (
                      <Badge colorPalette="red" mb={1}>
                        {account.incidents?.length} incidentes
                      </Badge>
                    ) : (
                      <Badge colorPalette="green" mb={1}>
                        Sin incidentes
                      </Badge>
                    )}
                    <Box fontSize="xs" color="gray.500">
                      Trades: {account.trades?.length || 0}
                    </Box>
                  </Box>
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
