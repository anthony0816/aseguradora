"use client";

import { Box, Heading, Table, Button, Flex, Badge, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/hooks/authHook";
import { ApiService } from "@/shared/services/api";
import { Trade } from "@/shared/types";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function ListTradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    setLoading(true);
    setError(null);
    
    try {
      // Los usuarios normales solo ven sus trades, los admins pueden ver todos
      const data = await ApiService.getTrades();
      setTrades(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error al cargar trades:", error);
    } finally {
      setLoading(false);
    }
  }

  async function closeTrade(trade: Trade) {
    if (trade.status === "closed") return;

    const closePrice = prompt("Ingresa el precio de cierre:", trade.open_price);
    if (!closePrice) return;

    try {
      await ApiService.updateTrade(trade.id, {
        close_time: new Date().toISOString().slice(0, 19).replace("T", " "),
        close_price: parseFloat(closePrice),
        status: "closed",
      });
      fetchTrades();
    } catch (error: any) {
      console.error("Error al cerrar trade:", error);
    }
  }

  async function deleteTrade(id: number) {
    if (!confirm("¿Estás seguro de eliminar este trade?")) return;

    try {
      await ApiService.deleteTrade(id);
      fetchTrades();
    } catch (error: any) {
      console.error("Error al eliminar trade:", error);
    }
  }

  async function evaluateTradeRisk(tradeId: number) {
    try {
      const result = await ApiService.evaluateTradeRisk(tradeId);
      alert(`Evaluación completada: ${result.message || 'Trade evaluado correctamente'}`);
      fetchTrades(); // Recargar para ver posibles cambios
    } catch (error: any) {
      console.error("Error al evaluar riesgo:", error);
      alert(`Error al evaluar riesgo: ${error.message}`);
    }
  }

  return (
    <Box h="full" overflowY="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Heading as="h1">Mis Trades</Heading>
          <Box fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mt={1}>
            {trades.filter((t) => t.status === "open").length} abiertos de{" "}
            {trades.length} trades
          </Box>
        </Box>
        <Link href="/aseguradora/createTrade">
          <Button colorPalette="blue">Crear Trade</Button>
        </Link>
      </Flex>

      {loading ? (
        <Box textAlign="center" py={10}>
          <p>Cargando trades...</p>
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
            Error al cargar trades
          </Heading>
          <Box color="red.500" mb={4}>
            {error}
          </Box>
          <Button colorPalette="red" onClick={fetchTrades}>
            Reintentar
          </Button>
        </Box>
      ) : trades.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
        >
          <Heading size="md" mb={2}>
            No tienes trades creados
          </Heading>
          <Box color="gray.600" _dark={{ color: "gray.400" }} mb={4}>
            Crea tu primer trade para comenzar
          </Box>
          <Link href="/aseguradora/createTrade">
            <Button colorPalette="blue">Crear primer trade</Button>
          </Link>
        </Box>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Trade</Table.ColumnHeader>
              <Table.ColumnHeader>Tipo</Table.ColumnHeader>
              <Table.ColumnHeader>Volumen</Table.ColumnHeader>
              <Table.ColumnHeader>Precios</Table.ColumnHeader>
              <Table.ColumnHeader>Estado</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {trades.map((trade) => (
              <Table.Row key={trade.id}>
                <Table.Cell>
                  <Box>
                    <Box fontWeight="bold">Cuenta: {trade.account?.login || 'N/A'}</Box>
                    <Box fontSize="xs" color="gray.500" mt={1}>
                      ID: {trade.id}
                    </Box>
                    <Box fontSize="xs" color="gray.500" mt={1}>
                      {new Date(trade.open_time).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Box>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={trade.type === "BUY" ? "green" : "red"}>
                    {trade.type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Box fontWeight="medium">{trade.volume}</Box>
                  <Box fontSize="xs" color="gray.500">
                    lotes
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box fontSize="sm">
                    <Box>Apertura: {trade.open_price}</Box>
                    {trade.close_price && (
                      <Box color="gray.600" mt={1}>
                        Cierre: {trade.close_price}
                      </Box>
                    )}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={trade.status === "open" ? "blue" : "gray"}
                  >
                    {trade.status === "open" ? "Abierto" : "Cerrado"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={2}>
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette="blue"
                      onClick={() => evaluateTradeRisk(trade.id)}
                      title="Evaluar riesgo"
                    >
                      <AssessmentIcon fontSize="small" />
                    </IconButton>
                    {trade.status === "open" && (
                      <IconButton
                        size="sm"
                        variant="outline"
                        colorPalette="orange"
                        onClick={() => closeTrade(trade)}
                        title="Cerrar trade"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      onClick={() => deleteTrade(trade.id)}
                      title="Eliminar"
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
