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
import Link from "next/link";

//components
import AuthInput from "@/core/auth/components/authinput";

//icons
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// hooks
import { useEffect, useState } from "react";
import ModalNotification from "@/shared/components/modalNotifications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks/authHook";
import { tk } from "@/core/auth/consts/consts";
import { apiBaseUrl } from "../../shared/consts/baseUrl";

export default function LoginPage() {
  // User data
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // loading State
  const [loading, setLoading] = useState(false);
  //ModalNotification
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");

  // Navegation
  const router = useRouter();

  // auth
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem(tk.access_token)) router.push("/");
    console.log(apiBaseUrl);
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLDivElement>
  ): Promise<void> {
    e.preventDefault();
    if (loading) return;

    if (password == "" || username == "") {
      setNotifiTitle("Empty params");
      setNotifiContent("You have to type your credentials");
      setOpenModalNotification(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username,
        password,
      }),
    });

    setLoading(false);

    if (res.status == 401) {
      const { error, details } = await res.json();
      setNotifiTitle(error);
      setNotifiContent(details);
      setOpenModalNotification(true);
      return;
    }

    if (!res.ok) {
      setNotifiTitle("Unexpected Error");
      setOpenModalNotification(true);
      return;
    }

    const data = await res.json();

    console.log("data del backend ", data.user);

    // log the user
    login(data.access_token, data.user);
    router.push("/aseguradora");
  }

  return (
    <Flex
      as={"section"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {/* ModalNotification */}

      <ModalNotification
        open={openModalNotification}
        onOpenChange={() => setOpenModalNotification(!openModalNotification)}
        notifiTitle={notifiTitle}
        content={notifiContent}
      />

      {/* Login form */}
      <Box
        as={"form"}
        w={"full"}
        maxW={"400px"}
        onSubmit={(e) => handleSubmit(e)}
        p={4}
        rounded={"xl"}
        boxShadow={"lg"}
      >
        <Stack spaceY={3} w={"full"}>
          <Heading as={"h1"} textAlign={"center"}>
            Login
          </Heading>

          {/* Inputs  */}
          <AuthInput
            label="Username"
            placeholder="Antonio003"
            error="this field is requied"
            onChange={(value) => setUsername(value)}
          />

          <AuthInput
            label="Password"
            placeholder="Enter your password"
            error="required "
            type={showPassword ? "text" : "password"}
            onChange={(value) => setPassword(value)}
            endElement={
              <Icon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Icon cursor={"pointer"}>
                    <VisibilityOffIcon />
                  </Icon>
                ) : (
                  <Icon cursor={"pointer"}>
                    <RemoveRedEyeIcon />
                  </Icon>
                )}
              </Icon>
            }
          />
          {/* Submit form  */}
          <Center>
            <Button loading={loading} type="submit">
              Submit
            </Button>
          </Center>

          <Center>
            <Text fontSize="sm">
              ¿No tienes cuenta?{" "}
              <Link href="/register" style={{ color: "#2a69ac", fontWeight: "600" }}>
                Regístrate
              </Link>
            </Text>
          </Center>
        </Stack>
      </Box>
    </Flex>
  );
}
