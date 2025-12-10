"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  HStack,
  Flex,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks/authHook";
import { ApiService } from "@/shared/services/api";
import { Account, WebhookTradeResponse } from "@/shared/types";
import AuthInput from "@/core/auth/components/authinput";
import ModalNotification from "@/shared/components/modalNotifications";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CreateTradePage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [type, setType] = useState("BUY");
  const [volume, setVolume] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [webhookResult, setWebhookResult] = useState<WebhookTradeResponse | null>(null);

  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const data = await ApiService.getAccounts();
      setAccounts(data.filter((account: Account) => account.status === 'enable'));
    } catch (error) {
      console.error("Error al cargar cuentas:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!selectedAccount || !volume || !openPrice) {
      setNotifiTitle("Campos vacíos");
      setNotifiContent("Todos los campos son obligatorios");
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    setWebhookResult(null);

    try {
      // Usar webhook con evaluación automática de riesgos
      const webhookData = {
        account_login: selectedAccount.login,
        type,
        volume: parseFloat(volume),
        open_time: new Date().toISOString(),
        open_price: parseFloat(openPrice),
        status: "open",
      };

      const result = await ApiService.sendTradeWebhook(webhookData);
      setWebhookResult(result);

      if (result.violations_detected > 0) {
        setNotifiTitle("Trade creado con violaciones");
        setNotifiContent(`Se detectaron ${result.violations_detected} violaciones de riesgo. Revisa los incidentes.`);
      } else {
        setNotifiTitle("Trade creado exitosamente");
        setNotifiContent("El trade se registró sin violaciones de riesgo");
      }

      setOpenModalNotification(true);

      setTimeout(() => {
        router.push("/aseguradora/listTrades");
      }, 3000);
    } catch (error: any) {
      setNotifiTitle("Error al crear trade");
      setNotifiContent(error.message || "Error inesperado");
      setOpenModalNotification(true);
    } finally {
      setLoading(false);
    }
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
                  value={selectedAccount?.id || ""}
                  onChange={(e) => {
                    const account = accounts.find(a => a.id === parseInt(e.target.value));
                    setSelectedAccount(account || null);
                  }}
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
                      {account.login} - {account.trading_status === 'enable' ? 'Habilitada' : 'Deshabilitada'}
                    </option>
                  ))}
                </select>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Solo se muestran cuentas activas
                </Text>
                {selectedAccount && selectedAccount.trading_status === 'disable' && (
                  <Box mt={2} p={2} bg="yellow.50" borderRadius="md" borderWidth="1px" borderColor="yellow.200">
                    <Flex align="center" gap={2}>
                      <WarningIcon fontSize="small" color="warning" />
                      <Text fontSize="sm" color="yellow.700">
                        Esta cuenta tiene el trading deshabilitado
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Evaluación de Riesgo
                </Text>
                <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.400" }}>
                  ✅ Los trades se evalúan automáticamente con las reglas de riesgo
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

        {webhookResult && (
          <Box mt={6} p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Heading size="md" mb={4}>
              Resultado de la Evaluación
            </Heading>
            
            <VStack align="stretch" gap={3}>
              <Flex align="center" gap={2}>
                {webhookResult.violations_detected === 0 ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <WarningIcon color="warning" />
                )}
                <Text fontWeight="medium">
                  {webhookResult.message}
                </Text>
              </Flex>

              <Box>
                <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  Trade ID: #{webhookResult.trade_id}
                </Text>
                <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  Violaciones detectadas: {webhookResult.violations_detected}
                </Text>
              </Box>

              {webhookResult.violations && webhookResult.violations.length > 0 && (
                <Box>
                  <Text fontWeight="medium" mb={2}>Violaciones:</Text>
                  <VStack align="stretch" gap={2}>
                    {webhookResult.violations.map((violation, index) => (
                      <Box key={index} p={3} bg="red.50" _dark={{ bg: "red.900" }} borderRadius="md">
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="medium">{violation.rule}</Text>
                          <Badge colorPalette={violation.severity === 'Hard' ? 'red' : 'orange'}>
                            {violation.severity}
                          </Badge>
                        </Flex>
                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                          Incidente #{violation.incident_id}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
