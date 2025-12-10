"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
  Textarea,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks/authHook";
import AuthInput from "@/core/auth/components/authinput";
import ModalNotification from "@/shared/components/modalNotifications";

interface RuleType {
  id: number;
  name: string;
  slug: string;
}

interface Action {
  id: number;
  name: string;
  slug: string;
}

export default function CreateRulePage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [ruleTypes, setRuleTypes] = useState<RuleType[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  
  // Campos básicos
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ruleTypeId, setRuleTypeId] = useState("");
  const [severity, setSeverity] = useState("Soft");
  const [isActive, setIsActive] = useState(true);
  const [selectedActions, setSelectedActions] = useState<number[]>([]);

  // Parámetros Duration
  const [duration, setDuration] = useState("");

  // Parámetros Volume
  const [minFactor, setMinFactor] = useState("0.5");
  const [maxFactor, setMaxFactor] = useState("2.0");
  const [lookbackTrades, setLookbackTrades] = useState("10");

  // Parámetros Time Range
  const [timeWindowMinutes, setTimeWindowMinutes] = useState("60");
  const [minOpenTrades, setMinOpenTrades] = useState("0");
  const [maxOpenTrades, setMaxOpenTrades] = useState("5");

  const [loading, setLoading] = useState(false);
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  useEffect(() => {
    fetchRuleTypes();
    fetchActions();
  }, []);

  async function fetchRuleTypes() {
    const res = await fetch("/api/rules/types", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRuleTypes(data);
    }
  }

  async function fetchActions() {
    // Simulamos las acciones disponibles según la documentación
    setActions([
      { id: 1, name: "Notificar Email", slug: "notify-email" },
      { id: 2, name: "Deshabilitar Cuenta", slug: "disable-account" },
      { id: 3, name: "Deshabilitar Trading", slug: "disable-trading" },
      { id: 4, name: "Cerrar Trades Abiertos", slug: "close-open-trades" },
      { id: 5, name: "Notificar Admin", slug: "notify-admin" },
      { id: 6, name: "Registrar Log", slug: "log-incident" },
    ]);
  }

  const getParameterType = (ruleTypeId: string): string => {
    const typeMapping: { [key: string]: string } = {
      "1": "duration",
      "2": "volume",
      "3": "time_range",
    };
    return typeMapping[ruleTypeId] || "";
  };

  const getParameterData = () => {
    const paramType = getParameterType(ruleTypeId);
    
    if (paramType === "duration") {
      return { duration: parseInt(duration) };
    }
    
    if (paramType === "volume") {
      return {
        min_factor: parseFloat(minFactor),
        max_factor: parseFloat(maxFactor),
        lookback_trades: parseInt(lookbackTrades),
      };
    }
    
    if (paramType === "time_range") {
      return {
        time_window_minutes: parseInt(timeWindowMinutes),
        min_open_trades: parseInt(minOpenTrades),
        max_open_trades: parseInt(maxOpenTrades),
      };
    }
    
    return {};
  };

  const validateForm = (): string | null => {
    if (!name) return "El nombre es requerido";
    if (!ruleTypeId) return "Debe seleccionar un tipo de regla";
    
    const paramType = getParameterType(ruleTypeId);
    
    if (paramType === "duration") {
      if (!duration || parseInt(duration) < 1) {
        return "La duración debe ser mayor a 0 segundos";
      }
    }
    
    if (paramType === "volume") {
      if (!minFactor || parseFloat(minFactor) < 0) {
        return "El factor mínimo debe ser mayor o igual a 0";
      }
      if (!maxFactor || parseFloat(maxFactor) < parseFloat(minFactor)) {
        return "El factor máximo debe ser mayor o igual al mínimo";
      }
      if (!lookbackTrades || parseInt(lookbackTrades) < 1) {
        return "Debe ser al menos 1 trade para el promedio";
      }
    }
    
    if (paramType === "time_range") {
      if (!timeWindowMinutes || parseInt(timeWindowMinutes) < 1) {
        return "La ventana debe ser mayor a 0 minutos";
      }
      if (parseInt(minOpenTrades) < 0) {
        return "El mínimo de trades no puede ser negativo";
      }
      if (parseInt(maxOpenTrades) < parseInt(minOpenTrades)) {
        return "El máximo debe ser mayor o igual al mínimo";
      }
    }
    
    return null;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || !user) return;

    const validationError = validateForm();
    if (validationError) {
      setNotifiTitle("Error de validación");
      setNotifiContent(validationError);
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        created_by_user_id: user.id,
        rule_type_id: parseInt(ruleTypeId),
        name,
        description,
        severity,
        is_active: isActive,
        parameter_type: getParameterType(ruleTypeId),
        parameter_data: getParameterData(),
        action_ids: selectedActions,
      }),
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      setNotifiTitle("Error al crear regla");
      setNotifiContent(data.message || "Error inesperado");
      setOpenModalNotification(true);
      return;
    }

    setNotifiTitle("Regla creada");
    setNotifiContent("La regla se creó exitosamente");
    setOpenModalNotification(true);

    setTimeout(() => {
      router.push("/aseguradora/listRules");
    }, 1500);
  }

  const toggleAction = (actionId: number) => {
    setSelectedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const selectedRuleType = ruleTypes.find((t) => t.id === parseInt(ruleTypeId));
  const paramType = getParameterType(ruleTypeId);

  return (
    <Box h="100vh" overflowY="auto" p={6}>
      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      <Box maxW="900px" mx="auto">
        <Heading as="h1" mb={2}>
          Crear Regla de Riesgo
        </Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }} mb={6}>
          Define reglas personalizadas para proteger tus operaciones
        </Text>

        <form onSubmit={handleSubmit}>
        <VStack gap={6} align="stretch">
          {/* Información Básica */}
          <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Heading size="md" mb={4}>
              1. Información Básica
            </Heading>
            <Stack spaceY={4}>
              <AuthInput
                label="Nombre de la Regla"
                placeholder="Ej: Duración Mínima 2 Minutos"
                onChange={(value) => setName(value)}
                required
              />

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Descripción (opcional)
                </Text>
                <Textarea
                  placeholder="Explica el propósito de esta regla..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
            </Stack>
          </Box>

          {/* Tipo y Severidad */}
          <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Heading size="md" mb={4}>
              2. Tipo y Severidad
            </Heading>
            <Stack spaceY={4}>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Tipo de Regla
                </Text>
                <select
                  value={ruleTypeId}
                  onChange={(e) => setRuleTypeId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="">Selecciona qué quieres evaluar</option>
                  {ruleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {selectedRuleType && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {selectedRuleType.slug === "duration-check" &&
                      "Evalúa el tiempo que estuvo abierto el trade"}
                    {selectedRuleType.slug === "volume-consistency" &&
                      "Compara el volumen con el promedio histórico"}
                    {selectedRuleType.slug === "time-range-operation" &&
                      "Controla la cantidad de trades en una ventana de tiempo"}
                  </Text>
                )}
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Severidad
                </Text>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="Soft">Soft - Actúa después de 3 violaciones</option>
                  <option value="Hard">Hard - Actúa inmediatamente</option>
                </select>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {severity === "Hard"
                    ? "⚠️ Las acciones se ejecutarán en la primera violación"
                    : "ℹ️ Las acciones se ejecutarán después de 3 violaciones"}
                </Text>
              </Box>
            </Stack>
          </Box>

          {/* Parámetros Dinámicos */}
          {ruleTypeId && (
            <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
              <Heading size="md" mb={4}>
                3. Configurar Parámetros
              </Heading>

              {paramType === "duration" && (
                <Stack spaceY={4}>
                  <AuthInput
                    label="Duración Mínima (segundos)"
                    placeholder="120"
                    type="number"
                    onChange={(value) => setDuration(value)}
                    required
                  />
                  <Text fontSize="sm" color="gray.500">
                    ℹ️ Los trades deben estar abiertos al menos este tiempo
                  </Text>
                </Stack>
              )}

              {paramType === "volume" && (
                <Stack spaceY={4}>
                  <AuthInput
                    label="Factor Mínimo"
                    placeholder="0.5"
                    type="number"
                    step="0.1"
                    onChange={(value) => setMinFactor(value)}
                    required
                  />
                  <AuthInput
                    label="Factor Máximo"
                    placeholder="2.0"
                    type="number"
                    step="0.1"
                    onChange={(value) => setMaxFactor(value)}
                    required
                  />
                  <AuthInput
                    label="Trades para Promedio"
                    placeholder="10"
                    type="number"
                    onChange={(value) => setLookbackTrades(value)}
                    required
                  />
                  <Text fontSize="sm" color="gray.500">
                    ℹ️ El volumen debe estar entre {minFactor || "0.5"}x y{" "}
                    {maxFactor || "2.0"}x del promedio de los últimos{" "}
                    {lookbackTrades || "10"} trades
                  </Text>
                </Stack>
              )}

              {paramType === "time_range" && (
                <Stack spaceY={4}>
                  <AuthInput
                    label="Ventana de Tiempo (minutos)"
                    placeholder="60"
                    type="number"
                    onChange={(value) => setTimeWindowMinutes(value)}
                    required
                  />
                  <AuthInput
                    label="Mínimo de Trades Abiertos"
                    placeholder="0"
                    type="number"
                    onChange={(value) => setMinOpenTrades(value)}
                    required
                  />
                  <AuthInput
                    label="Máximo de Trades Abiertos"
                    placeholder="5"
                    type="number"
                    onChange={(value) => setMaxOpenTrades(value)}
                    required
                  />
                  <Text fontSize="sm" color="gray.500">
                    ℹ️ En los últimos {timeWindowMinutes || "60"} minutos debe haber
                    entre {minOpenTrades || "0"} y {maxOpenTrades || "5"} trades
                    abiertos
                  </Text>
                </Stack>
              )}
            </Box>
          )}

          {/* Acciones */}
          <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Heading size="md" mb={4}>
              4. Acciones a Ejecutar
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Selecciona qué hacer cuando se viole la regla
            </Text>
            <VStack gap={3} align="stretch">
              {actions.map((action) => (
                <Flex
                  key={action.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  align="center"
                  cursor="pointer"
                  onClick={() => toggleAction(action.id)}
                  bg={
                    selectedActions.includes(action.id)
                      ? "blue.50"
                      : "transparent"
                  }
                  _dark={{
                    bg: selectedActions.includes(action.id)
                      ? "blue.900"
                      : "transparent",
                  }}
                >
                  <Input
                    type="checkbox"
                    checked={selectedActions.includes(action.id)}
                    onChange={() => toggleAction(action.id)}
                    width="auto"
                    cursor="pointer"
                  />
                  <Text ml={3}>{action.name}</Text>
                </Flex>
              ))}
            </VStack>
            {selectedActions.length === 0 && (
              <Text fontSize="sm" color="orange.500" mt={3}>
                ⚠️ Sin acciones, la regla solo registrará incidentes
              </Text>
            )}
          </Box>

          {/* Estado */}
          <Box p={6} rounded="lg" borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
            <Heading size="md" mb={4}>
              5. Estado de la Regla
            </Heading>
            <Flex align="center" gap={3}>
              <Input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                width="auto"
                cursor="pointer"
              />
              <Text>Activar regla inmediatamente</Text>
            </Flex>
            <Text fontSize="sm" color="gray.500" mt={2}>
              {isActive
                ? "✅ La regla se evaluará en cada trade"
                : "⏸️ La regla estará inactiva hasta que la actives"}
            </Text>
          </Box>

          {/* Botones */}
          <HStack justify="flex-end" gap={3}>
            <Button
              variant="outline"
              onClick={() => router.push("/aseguradora/listRules")}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading} colorPalette="blue">
              Crear Regla
            </Button>
          </HStack>
        </VStack>
        </form>
      </Box>
    </Box>
  );
}
