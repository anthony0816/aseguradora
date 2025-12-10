"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  IconButton,
  Spinner,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ApiService } from "@/shared/services/api";
import { Notification } from "@/shared/types";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    
    // Polling cada 60 segundos para nuevas notificaciones (menos agresivo)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Los usuarios normales solo ven sus notificaciones, los admins pueden ver todas
      const data = await ApiService.getNotifications();
      setNotifications(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error: any) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const getSeverityColor = (metadata: any) => {
    if (!metadata || !metadata.severity) return "blue";
    return metadata.severity === "Hard" ? "red" : "orange";
  };

  const getActionColor = (metadata: any) => {
    if (!metadata || !metadata.action) return "blue";
    switch (metadata.action) {
      case 'account_disabled': return "red";
      case 'trading_disabled': return "orange";
      case 'trades_closed': return "purple";
      default: return "blue";
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.metadata && notification.metadata.action) {
      switch (notification.metadata.action) {
        case 'account_disabled': return "🚫";
        case 'trading_disabled': return "⚠️";
        case 'trades_closed': return "🔒";
        default: return "📢";
      }
    }
    return "📢";
  };

  const formatNotificationMessage = (notification: Notification) => {
    if (notification.metadata) {
      const { severity, rule_id, incident_id, action, account_id } = notification.metadata;
      return (
        <Box>
          <Flex align="center" gap={2} mb={2}>
            <Text fontSize="lg">{getNotificationIcon(notification)}</Text>
            <Text fontWeight="medium" flex={1}>
              {notification.mensaje}
            </Text>
          </Flex>
          <Flex gap={2} wrap="wrap">
            {action && (
              <Badge colorPalette={getActionColor(notification.metadata)} size="sm">
                {action.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
            {severity && (
              <Badge colorPalette={getSeverityColor(notification.metadata)} size="sm">
                {severity}
              </Badge>
            )}
            {rule_id && (
              <Badge colorPalette="gray" size="sm">
                Regla #{rule_id}
              </Badge>
            )}
            {incident_id && (
              <Badge colorPalette="purple" size="sm">
                Incidente #{incident_id}
              </Badge>
            )}
            {account_id && (
              <Badge colorPalette="blue" size="sm">
                Cuenta #{account_id}
              </Badge>
            )}
          </Flex>
        </Box>
      );
    }
    return (
      <Flex align="center" gap={2}>
        <Text fontSize="lg">📢</Text>
        <Text>{notification.mensaje}</Text>
      </Flex>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box h="100vh" overflowY="auto" p={6}>
      <Box maxW="1200px" mx="auto">
        <Flex justify="space-between" align="center" mb={6}>
          <Flex align="center" gap={3}>
            <Heading size="xl">Notificaciones</Heading>
            <Badge colorPalette="blue" fontSize="md" px={3} py={1}>
              {notifications.length} total
            </Badge>
          </Flex>
          <Button
            variant="outline"
            colorPalette="blue"
            onClick={fetchNotifications}
            leftIcon={<RefreshIcon />}
          >
            Actualizar
          </Button>
        </Flex>

      {error ? (
        <Box
          textAlign="center"
          py={12}
          borderWidth="1px"
          borderRadius="lg"
          bg="red.50"
          _dark={{ bg: "red.900" }}
        >
          <Heading size="md" mb={2} color="red.600">
            Error al cargar notificaciones
          </Heading>
          <Box color="red.500" mb={4}>
            {error}
          </Box>
          <Button colorPalette="red" onClick={fetchNotifications}>
            Reintentar
          </Button>
        </Box>
      ) : notifications.length === 0 ? (
        <Box
          p={12}
          textAlign="center"
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
        >
          <Text fontSize="lg" color="gray.500">
            No tienes notificaciones
          </Text>
        </Box>
      ) : (
        <VStack gap={3} align="stretch">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              _dark={{ bg: "gray.800" }}
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: "md" }}
              borderLeftWidth="4px"
              borderLeftColor={`${notification.metadata?.action ? getActionColor(notification.metadata) : getSeverityColor(notification.metadata)}.500`}
            >
              <Flex justify="space-between" align="start" gap={4}>
                <Box flex={1}>
                  <Box mb={2}>
                    {formatNotificationMessage(notification)}
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(notification.created_at).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Box>
                <Flex gap={2}>
                  <IconButton
                    aria-label="Eliminar"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
      </Box>
    </Box>
  );
}
