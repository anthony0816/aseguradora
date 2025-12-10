"use client";

import {
  Box,
  Heading,
  Table,
  Button,
  Flex,
  Badge,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ApiService } from "@/shared/services/api";
import { Incident } from "@/shared/types";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    setLoading(true);
    setError(null);
    
    try {
      // Los usuarios normales solo ven incidentes de sus cuentas, los admins pueden ver todos
      const data = await ApiService.getIncidents();
      setIncidents(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error al cargar incidentes:", error);
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (riskRule: any) => {
    if (!riskRule) return "gray";
    return riskRule.severity === "Hard" ? "red" : "orange";
  };

  const getStatusColor = (isExecuted: boolean) => {
    return isExecuted ? "green" : "yellow";
  };

  return (
    <Box h="full" overflowY="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Heading as="h1">Incidentes de Riesgo</Heading>
          <Box fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mt={1}>
            {incidents.filter((i) => i.is_executed).length} ejecutados de{" "}
            {incidents.length} incidentes
          </Box>
        </Box>
        <Button
          variant="outline"
          colorPalette="blue"
          onClick={fetchIncidents}
          leftIcon={<RefreshIcon />}
        >
          Actualizar
        </Button>
      </Flex>

      {loading ? (
        <Box textAlign="center" py={10}>
          <p>Cargando incidentes...</p>
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
            Error al cargar incidentes
          </Heading>
          <Box color="red.500" mb={4}>
            {error}
          </Box>
          <Button colorPalette="red" onClick={fetchIncidents}>
            Reintentar
          </Button>
        </Box>
      ) : incidents.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="green.50"
          _dark={{ bg: "green.900" }}
        >
          <CheckCircleIcon fontSize="large" color="success" />
          <Heading size="md" mb={2} color="green.600" mt={2}>
            No hay incidentes
          </Heading>
          <Box color="green.600" _dark={{ color: "green.400" }}>
            Todas las cuentas están operando dentro de los parámetros de riesgo
          </Box>
        </Box>
      ) : (
        <VStack gap={4} align="stretch">
          {incidents.map((incident) => (
            <Box
              key={incident.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              _dark={{ bg: "gray.800" }}
              shadow="sm"
              borderLeftWidth="4px"
              borderLeftColor={`${getSeverityColor(incident.risk_rule)}.500`}
            >
              <Flex justify="space-between" align="start" gap={4}>
                <Box flex={1}>
                  <Flex align="center" gap={2} mb={2}>
                    <WarningIcon 
                      fontSize="small" 
                      color={getSeverityColor(incident.risk_rule) === "red" ? "error" : "warning"} 
                    />
                    <Heading size="md">
                      Incidente #{incident.id}
                    </Heading>
                    <Badge colorPalette={getStatusColor(incident.is_executed)}>
                      {incident.is_executed ? "✅ Ejecutado" : "⏳ Pendiente"}
                    </Badge>
                    <Badge colorPalette={getSeverityColor(incident.risk_rule)} size="sm">
                      {incident.risk_rule?.severity || "Unknown"}
                    </Badge>
                  </Flex>

                  <Box mb={3}>
                    <Text fontWeight="medium" mb={1}>
                      Regla violada: {incident.risk_rule?.name || "Regla desconocida"}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mb={2}>
                      {incident.risk_rule?.description}
                    </Text>
                  </Box>

                  <Box mb={3}>
                    <Text fontWeight="medium" mb={1}>Detalles del incidente:</Text>
                    <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                      {incident.triggered_value}
                    </Text>
                  </Box>

                  <Flex gap={4} wrap="wrap" fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                    <Box>
                      <Text fontWeight="medium">Cuenta:</Text>
                      <Text>{incident.account?.login || "N/A"}</Text>
                    </Box>
                    {incident.trade && (
                      <Box>
                        <Text fontWeight="medium">Trade:</Text>
                        <Text>#{incident.trade.id}</Text>
                      </Box>
                    )}
                    <Box>
                      <Text fontWeight="medium">Ocurrencias:</Text>
                      <Text>{incident.count}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium">Fecha:</Text>
                      <Text>
                        {new Date(incident.created_at).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}