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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

interface Notification {
  id: number;
  user_id: number;
  incident_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          {unreadCount > 0 && (
            <Badge colorPalette="red" fontSize="md" px={3} py={1}>
              {unreadCount} nuevas
            </Badge>
          )}
        </Flex>
        {unreadCount > 0 && (
          <IconButton
            aria-label="Marcar todas como leídas"
            variant="outline"
            colorPalette="blue"
            onClick={markAllAsRead}
          >
            <MarkEmailReadIcon />
          </IconButton>
        )}
      </Flex>

      {notifications.length === 0 ? (
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
              bg={notification.is_read ? "white" : "blue.50"}
              _dark={{
                bg: notification.is_read ? "gray.800" : "blue.900",
              }}
              shadow="sm"
              transition="all 0.2s"
              _hover={{ shadow: "md" }}
            >
              <Flex justify="space-between" align="start" gap={4}>
                <Box flex={1}>
                  <Text
                    fontSize="md"
                    fontWeight={notification.is_read ? "normal" : "bold"}
                    mb={2}
                  >
                    {notification.message}
                  </Text>
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
                  {!notification.is_read && (
                    <IconButton
                      aria-label="Marcar como leída"
                      size="sm"
                      variant="ghost"
                      colorPalette="green"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
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
