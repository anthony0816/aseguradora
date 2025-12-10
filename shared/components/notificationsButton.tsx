"use client";

import { IconButton, Badge, Box } from "@chakra-ui/react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsButton() {
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const unread = data.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
        setHasUnread(unread > 0);
      }
    } catch (error) {
      console.error("Error al verificar notificaciones:", error);
    }
  };

  const handleClick = () => {
    router.push("/aseguradora/notifications");
  };

  return (
    <Box position="relative">
      <IconButton
        aria-label="Notificaciones"
        variant="ghost"
        onClick={handleClick}
        colorPalette={hasUnread ? "blue" : undefined}
      >
        <NotificationsIcon />
      </IconButton>
      {hasUnread && (
        <Badge
          position="absolute"
          top="-1"
          right="-1"
          colorPalette="red"
          borderRadius="full"
          fontSize="xs"
          px={2}
        >
          {unreadCount}
        </Badge>
      )}
    </Box>
  );
}
