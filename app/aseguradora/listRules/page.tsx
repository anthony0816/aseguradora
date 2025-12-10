"use client";

import { Box, Heading, Table, Button, Flex, Badge, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/hooks/authHook";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

interface Rule {
  id: number;
  name: string;
  description: string;
  severity: string;
  is_active: boolean;
  rule_type: {
    name: string;
    slug: string;
  };
  creator: {
    name: string;
  };
  parameter: {
    duration_parameter?: {
      duration: number;
    };
    volume_trade_parameter?: {
      min_factor: number;
      max_factor: number;
      lookback_trades: number;
    };
    time_range_operation_parameter?: {
      time_window_minutes: number;
      min_open_trades: number;
      max_open_trades: number;
    };
  };
  actions: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function ListRulesPage() {
  const { accessToken } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    setLoading(true);
    const res = await fetch("/api/rules", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRules(data);
    }
    setLoading(false);
  }

  async function toggleActive(rule: Rule) {
    const res = await fetch(`/api/rules/${rule.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        is_active: !rule.is_active,
      }),
    });

    if (res.ok) {
      fetchRules();
    }
  }

  async function deleteRule(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta regla?")) return;

    const res = await fetch(`/api/rules/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      fetchRules();
    }
  }

  const getParameterInfo = (rule: Rule) => {
    if (rule.parameter.duration_parameter) {
      return `Duración mínima: ${rule.parameter.duration_parameter.duration}s`;
    }
    if (rule.parameter.volume_trade_parameter) {
      const p = rule.parameter.volume_trade_parameter;
      return `Rango: ${p.min_factor}x - ${p.max_factor}x (últimos ${p.lookback_trades} trades)`;
    }
    if (rule.parameter.time_range_operation_parameter) {
      const p = rule.parameter.time_range_operation_parameter;
      return `${p.min_open_trades}-${p.max_open_trades} trades en ${p.time_window_minutes} min`;
    }
    return "Sin parámetros";
  };

  return (
    <Box h="100vh" overflowY="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Heading as="h1">Mis Reglas de Riesgo</Heading>
          <Box fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mt={1}>
            {rules.filter((r) => r.is_active).length} activas de {rules.length}{" "}
            reglas
          </Box>
        </Box>
        <Link href="/aseguradora/createRule">
          <Button colorPalette="blue">Crear Regla</Button>
        </Link>
      </Flex>

      {loading ? (
        <Box textAlign="center" py={10}>
          <p>Cargando reglas...</p>
        </Box>
      ) : rules.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
        >
          <Heading size="md" mb={2}>
            No tienes reglas creadas
          </Heading>
          <Box color="gray.600" _dark={{ color: "gray.400" }} mb={4}>
            Crea tu primera regla para proteger tus operaciones
          </Box>
          <Link href="/aseguradora/createRule">
            <Button colorPalette="blue">Crear primera regla</Button>
          </Link>
        </Box>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Regla</Table.ColumnHeader>
              <Table.ColumnHeader>Tipo</Table.ColumnHeader>
              <Table.ColumnHeader>Parámetros</Table.ColumnHeader>
              <Table.ColumnHeader>Severidad</Table.ColumnHeader>
              <Table.ColumnHeader>Estado</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rules.map((rule) => (
              <Table.Row key={rule.id}>
                <Table.Cell>
                  <Box>
                    <Box fontWeight="bold">{rule.name}</Box>
                    {rule.description && (
                      <Box fontSize="sm" color="gray.600" mt={1}>
                        {rule.description}
                      </Box>
                    )}
                    <Box fontSize="xs" color="gray.500" mt={1}>
                      Por: {rule.creator.name}
                    </Box>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="purple">{rule.rule_type.name}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Box fontSize="sm">{getParameterInfo(rule)}</Box>
                  {rule.actions.length > 0 && (
                    <Box fontSize="xs" color="gray.500" mt={1}>
                      {rule.actions.length} acción(es) configurada(s)
                    </Box>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={rule.severity === "Hard" ? "red" : "orange"}
                  >
                    {rule.severity}
                  </Badge>
                  <Box fontSize="xs" color="gray.500" mt={1}>
                    {rule.severity === "Hard"
                      ? "Actúa inmediatamente"
                      : "Actúa tras 3 violaciones"}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={rule.is_active ? "green" : "gray"}>
                    {rule.is_active ? "Activa" : "Inactiva"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={2}>
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette={rule.is_active ? "orange" : "green"}
                      onClick={() => toggleActive(rule)}
                      title={rule.is_active ? "Desactivar" : "Activar"}
                    >
                      {rule.is_active ? (
                        <ToggleOffIcon fontSize="small" />
                      ) : (
                        <ToggleOnIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      onClick={() => deleteRule(rule.id)}
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
