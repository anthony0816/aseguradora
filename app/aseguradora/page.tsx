"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiService } from "@/shared/services/api";
import { DashboardStats } from "@/shared/types";
import SecurityIcon from "@mui/icons-material/Security";
import GavelIcon from "@mui/icons-material/Gavel";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningIcon from "@mui/icons-material/Warning";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function AseguradoraPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      const [accounts, trades, incidents, notifications] = await Promise.all([
        ApiService.getAccounts(),
        ApiService.getTrades(),
        ApiService.getIncidents(),
        ApiService.getNotifications(),
      ]);

      const dashboardStats: DashboardStats = {
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter((a: any) => a.status === 'enable').length,
        totalTrades: trades.length,
        openTrades: trades.filter((t: any) => t.status === 'open').length,
        totalIncidents: incidents.length,
        unreadNotifications: notifications.length,
        activeRules: 0, // Se cargará cuando implementemos las reglas
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }

  const features = [
    {
      title: "Gestión de Cuentas",
      description: "Administra y monitorea todas tus cuentas de trading",
      icon: <AccountBalanceIcon fontSize="large" />,
      color: "blue",
      action: () => router.push("/aseguradora/listAccounts"),
      stats: stats ? `${stats.activeAccounts}/${stats.totalAccounts} activas` : null,
    },
    {
      title: "Control de Trades",
      description: "Supervisa tus operaciones en tiempo real",
      icon: <TrendingUpIcon fontSize="large" />,
      color: "green",
      action: () => router.push("/aseguradora/listTrades"),
      stats: stats ? `${stats.openTrades}/${stats.totalTrades} abiertos` : null,
    },
    {
      title: "Reglas de Riesgo",
      description: "Define y gestiona reglas para proteger tus inversiones",
      icon: <GavelIcon fontSize="large" />,
      color: "purple",
      action: () => router.push("/aseguradora/listRules"),
      stats: stats ? `${stats.activeRules} activas` : null,
    },
  ];

  const alertFeatures = [
    {
      title: "Incidentes de Riesgo",
      description: "Revisa violaciones y acciones ejecutadas",
      icon: <WarningIcon fontSize="large" />,
      color: "red",
      action: () => router.push("/aseguradora/incidents"),
      stats: stats ? `${stats.totalIncidents} incidentes` : null,
      urgent: stats && stats.totalIncidents > 0,
    },
  ];

  return (
    <Box h="100vh" overflowY="auto" p={6}>
      <Box maxW="1400px" mx="auto">
        <Flex
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        py={12}
        mb={8}
      >
        <Box mb={4} color="blue.500">
          <ShieldIcon style={{ fontSize: "80px" }} />
        </Box>
        <Heading size="3xl" mb={4}>
          Asegura tus Datos
        </Heading>
        <Text
          fontSize="xl"
          color="gray.600"
          _dark={{ color: "gray.400" }}
          maxW="800px"
          mb={2}
        >
          Sistema de control de riesgo para proteger tus operaciones de trading
        </Text>
        <Text
          fontSize="md"
          color="gray.500"
          _dark={{ color: "gray.500" }}
          maxW="700px"
        >
          Monitorea tus cuentas, establece reglas personalizadas y recibe
          notificaciones en tiempo real sobre posibles riesgos
        </Text>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" py={12}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
            {features.map((feature, index) => (
              <Box
                key={index}
                p={8}
                borderWidth="1px"
                borderRadius="xl"
                bg="white"
                _dark={{ bg: "gray.800" }}
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  shadow: "xl",
                  transform: "translateY(-4px)",
                  borderColor: `${feature.color}.500`,
                }}
                cursor="pointer"
                onClick={feature.action}
              >
                <VStack gap={4} align="center" textAlign="center">
                  <Box color={`${feature.color}.500`}>{feature.icon}</Box>
                  <Heading size="lg">{feature.title}</Heading>
                  <Text color="gray.600" _dark={{ color: "gray.400" }}>
                    {feature.description}
                  </Text>
                  {feature.stats && (
                    <Badge colorPalette={feature.color} size="lg">
                      {feature.stats}
                    </Badge>
                  )}
                  <Button
                    colorPalette={feature.color}
                    variant="outline"
                    onClick={feature.action}
                  >
                    Ir a {feature.title}
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Sección de alertas y notificaciones */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={8}>
            {alertFeatures.map((feature, index) => (
              <Box
                key={index}
                p={6}
                borderWidth="1px"
                borderRadius="xl"
                bg={feature.urgent ? `${feature.color}.50` : "white"}
                _dark={{ bg: feature.urgent ? `${feature.color}.900` : "gray.800" }}
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  shadow: "xl",
                  transform: "translateY(-2px)",
                  borderColor: `${feature.color}.500`,
                }}
                cursor="pointer"
                onClick={feature.action}
                borderColor={feature.urgent ? `${feature.color}.200` : "gray.200"}
              >
                <Flex align="center" gap={4}>
                  <Box color={`${feature.color}.500`}>{feature.icon}</Box>
                  <Box flex={1}>
                    <Heading size="md" mb={1}>{feature.title}</Heading>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mb={2}>
                      {feature.description}
                    </Text>
                    {feature.stats && (
                      <Badge 
                        colorPalette={feature.color} 
                        variant={feature.urgent ? "solid" : "outline"}
                      >
                        {feature.stats}
                      </Badge>
                    )}
                  </Box>
                  <Button
                    colorPalette={feature.color}
                    variant={feature.urgent ? "solid" : "outline"}
                    size="sm"
                    onClick={feature.action}
                  >
                    Ver
                  </Button>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}

      <Box
        p={8}
        borderWidth="1px"
        borderRadius="xl"
        bg="blue.50"
        _dark={{ bg: "blue.900" }}
        textAlign="center"
      >
        <Flex align="center" justify="center" gap={2} mb={3}>
          <SecurityIcon fontSize="large" />
          <Heading size="lg">¿Necesitas configurar reglas?</Heading>
        </Flex>
        <Text mb={4} color="gray.700" _dark={{ color: "gray.300" }}>
          Las reglas de riesgo te ayudan a proteger tus inversiones
          automáticamente
        </Text>
        <Button
          colorPalette="blue"
          size="lg"
          onClick={() => router.push("/aseguradora/createRule")}
        >
          Crear Nueva Regla
        </Button>
      </Box>
      </Box>
    </Box>
  );
}
