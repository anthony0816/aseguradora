"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SecurityIcon from "@mui/icons-material/Security";
import GavelIcon from "@mui/icons-material/Gavel";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";

export default function AseguradoraPage() {
  const router = useRouter();

  const features = [
    {
      title: "Gestión de Cuentas",
      description: "Administra y monitorea todas tus cuentas de trading",
      icon: <AccountBalanceIcon fontSize="large" />,
      color: "blue",
      action: () => router.push("/aseguradora/listAccounts"),
    },
    {
      title: "Control de Trades",
      description: "Supervisa tus operaciones en tiempo real",
      icon: <TrendingUpIcon fontSize="large" />,
      color: "green",
      action: () => router.push("/aseguradora/listTrades"),
    },
    {
      title: "Reglas de Riesgo",
      description: "Define y gestiona reglas para proteger tus inversiones",
      icon: <GavelIcon fontSize="large" />,
      color: "purple",
      action: () => router.push("/aseguradora/listRules"),
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
