"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AuthInput from "@/core/auth/components/authinput";
import ModalNotification from "@/shared/components/modalNotifications";
import { useAuth } from "@/core/auth/hooks/authHook";
import { ApiService } from "@/shared/services/api";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLDivElement>): Promise<void> {
    e.preventDefault();
    if (loading) return;

    if (!name || !email || !password || !passwordConfirmation) {
      setNotifiTitle("Campos vacíos");
      setNotifiContent("Todos los campos son obligatorios");
      setOpenModalNotification(true);
      return;
    }

    if (password !== passwordConfirmation) {
      setNotifiTitle("Error de contraseña");
      setNotifiContent("Las contraseñas no coinciden");
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    
    try {
      const data = await ApiService.register(name, email, password, passwordConfirmation);
      
      setNotifiTitle("Registro exitoso");
      setNotifiContent("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      setOpenModalNotification(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setNotifiTitle("Error al registrar");
      setNotifiContent(error.message || "Error inesperado");
      setOpenModalNotification(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      as="section"
      h="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      <Box
        as="form"
        w="full"
        maxW="400px"
        onSubmit={(e) => handleSubmit(e)}
        p={4}
        rounded="xl"
        boxShadow="lg"
      >
        <Stack spaceY={3} w="full">
          <Heading as="h1" textAlign="center">
            Registro
          </Heading>

          <AuthInput
            label="Nombre"
            placeholder="Juan Pérez"
            onChange={(value) => setName(value)}
          />

          <AuthInput
            label="Email"
            placeholder="juan@example.com"
            type="email"
            onChange={(value) => setEmail(value)}
          />

          <AuthInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type={showPassword ? "text" : "password"}
            onChange={(value) => setPassword(value)}
            endElement={
              <Icon onClick={() => setShowPassword(!showPassword)} cursor="pointer">
                {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </Icon>
            }
          />

          <AuthInput
            label="Confirmar Contraseña"
            placeholder="Confirma tu contraseña"
            type={showPasswordConfirmation ? "text" : "password"}
            onChange={(value) => setPasswordConfirmation(value)}
            endElement={
              <Icon onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} cursor="pointer">
                {showPasswordConfirmation ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </Icon>
            }
          />

          <Center>
            <Button loading={loading} type="submit">
              Registrarse
            </Button>
          </Center>

          <Center>
            <Text fontSize="sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" style={{ color: "#2a69ac", fontWeight: "600" }}>
                Inicia sesión
              </Link>
            </Text>
          </Center>
        </Stack>
      </Box>
    </Flex>
  );
}
