# 🛡️ Sistema de Control de Riesgos - Frontend

Aplicación web desarrollada con **Next.js 16** y **React 19** para el sistema de control de riesgos de trading. Proporciona una interfaz moderna y responsiva para la gestión de cuentas, trades, notificaciones y reglas de riesgo.

## 🚀 Características Principales

### 🎨 Interfaz de Usuario
- **Next.js 16** con App Router
- **React 19** con hooks modernos
- **Chakra UI v3** para componentes
- **Material-UI Icons** para iconografía
- **Tema oscuro/claro** con next-themes
- **Diseño responsivo** para móvil y escritorio

### 🔐 Autenticación y Seguridad
- **Autenticación JWT** con Laravel Sanctum
- **Context API** para gestión de estado global
- **Protección de rutas** automática
- **Manejo de tokens** con localStorage
- **Renovación automática** de sesión

### 📊 Funcionalidades de Trading
- **Dashboard principal** con estadísticas en tiempo real
- **Gestión de cuentas** (crear, editar, listar)
- **Creación de trades** via webhook con evaluación automática
- **Visualización de trades** con filtros y estados
- **Sistema de notificaciones** en tiempo real
- **Gestión de incidentes** y violaciones de riesgo

### ⚠️ Control de Riesgos
- **Evaluación automática** al crear trades
- **Visualización de violaciones** con códigos de color
- **Notificaciones push** para eventos críticos
- **Dashboard de riesgos** con métricas detalladas
- **Filtrado por usuario** y acceso admin

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js 18+**
- **pnpm** (recomendado) o npm
- **Backend Laravel** ejecutándose en `http://127.0.0.1:8000`

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd "Front end/aseguradora"
```

### 2. Instalar Dependencias
```bash
pnpm install
# o
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env.local
```

**Configurar las siguientes variables obligatorias:**
```env
# Entorno de desarrollo
NEXT_PUBLIC_ENV=dev

# URL del backend
NEXT_PUBLIC_BASE_URL_DEV=http://127.0.0.1:8000

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME="Sistema Aseguradora"
NEXT_PUBLIC_SESSION_TIMEOUT=1440
```

### 4. Iniciar Servidor de Desarrollo
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 📋 Configuración Detallada

### Variables de Entorno

#### Configuración Básica
```env
# Entorno actual
NEXT_PUBLIC_ENV=dev

# URLs del backend
NEXT_PUBLIC_BASE_URL_DEV=http://127.0.0.1:8000
NEXT_PUBLIC_BASE_URL=https://your-api-domain.com

# Información de la aplicación
NEXT_PUBLIC_APP_NAME="Sistema Aseguradora"
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Configuración de Autenticación
```env
# Tiempo de expiración de sesión (minutos)
NEXT_PUBLIC_SESSION_TIMEOUT=1440

# Nombre de la cookie de autenticación
NEXT_PUBLIC_AUTH_COOKIE_NAME=aseguradora_token
```

#### Configuración de Notificaciones
```env
# Intervalo de polling para notificaciones (ms)
NEXT_PUBLIC_NOTIFICATIONS_POLLING_INTERVAL=60000

# Máximo número de notificaciones
NEXT_PUBLIC_MAX_NOTIFICATIONS=50
```

#### Configuración de Dashboard
```env
# Intervalo de actualización del dashboard (ms)
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=30000

# Número máximo de elementos en listas
NEXT_PUBLIC_MAX_LIST_ITEMS=100
```

### Configuración de Desarrollo
```env
# Habilitar logs de debug
NEXT_PUBLIC_DEBUG_MODE=true

# Modo de desarrollo
NEXT_PUBLIC_DEV_MODE=true
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
Front end/aseguradora/
├── app/                          # App Router de Next.js
│   ├── aseguradora/             # Rutas principales
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── createTrade/         # Creación de trades
│   │   ├── listTrades/          # Lista de trades
│   │   ├── listAccounts/        # Lista de cuentas
│   │   ├── notifications/       # Notificaciones
│   │   └── incidents/           # Incidentes
│   ├── api/                     # API routes (si las hay)
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes de Chakra UI
├── core/                        # Funcionalidades core
│   ├── auth/                    # Autenticación
│   │   ├── components/          # Componentes de auth
│   │   ├── context/             # Context de autenticación
│   │   ├── hooks/               # Hooks de auth
│   │   └── consts/              # Constantes
│   └── user/                    # Gestión de usuarios
├── shared/                      # Recursos compartidos
│   ├── components/              # Componentes compartidos
│   ├── services/                # Servicios API
│   ├── types/                   # Tipos TypeScript
│   ├── hooks/                   # Hooks compartidos
│   └── consts/                  # Constantes globales
└── public/                      # Archivos estáticos
```

### Componentes Principales

#### Autenticación
- **AuthContextProvider**: Context global de autenticación
- **useAuth**: Hook para acceder al estado de autenticación
- **AuthInput**: Componente de input personalizado
- **UserCard**: Tarjeta de información del usuario

#### Layout y Navegación
- **LayoutProvider**: Layout principal con sidebar
- **NavBar**: Barra de navegación móvil
- **AcordionOptions**: Menú de navegación lateral
- **NotificationsButton**: Botón de notificaciones

#### Funcionalidades
- **Dashboard**: Página principal con estadísticas
- **CreateTrade**: Formulario de creación de trades
- **ListTrades**: Lista de trades con filtros
- **ListAccounts**: Gestión de cuentas
- **Notifications**: Centro de notificaciones
- **Incidents**: Visualización de incidentes

## 🔗 Integración con Backend

### Servicio API
El archivo `shared/services/api.ts` contiene todos los métodos para comunicarse con el backend:

```typescript
// Autenticación
ApiService.login(email, password)
ApiService.register(name, email, password, confirmation)
ApiService.getCurrentUser()

// Cuentas
ApiService.getAccounts(all?)
ApiService.createAccount(data)
ApiService.updateAccount(id, data)

// Trades
ApiService.getTrades(all?)
ApiService.sendTradeWebhook(data)  // Método principal para crear trades

// Notificaciones
ApiService.getNotifications(all?)
ApiService.deleteNotification(id)

// Reglas de Riesgo
ApiService.getRiskRules(all?)
ApiService.createRiskRule(data)

// Evaluación de Riesgos
ApiService.evaluateTradeRisk(tradeId)
ApiService.evaluateAccountRisk(accountId)
```

### Tipos TypeScript
Todos los tipos están definidos en `shared/types/index.ts`:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface Account {
  id: number;
  owner_id: number;
  login: number;
  trading_status: 'enable' | 'disable';
  status: 'enable' | 'disable';
}

interface Trade {
  id: number;
  account_id: number;
  type: 'BUY' | 'SELL';
  volume: string;
  status: 'open' | 'closed';
}

interface WebhookTradeResponse {
  success: boolean;
  trade_id: number;
  violations_detected: number;
  violations: Array<{
    rule: string;
    severity: 'Hard' | 'Soft';
    incident_id: number;
  }>;
}
```

## 🎯 Flujo de Trabajo Principal

### 1. Autenticación
```typescript
// Login del usuario
const loginData = await ApiService.login(email, password);
localStorage.setItem('access_token', loginData.access_token);

// Obtener usuario actual
const user = await ApiService.getCurrentUser();
```

### 2. Creación de Trades
```typescript
// Crear trade via webhook (método recomendado)
const webhookData = {
  account_login: selectedAccount.login,
  type: 'BUY',
  volume: 1.0,
  open_time: new Date().toISOString(),
  open_price: 1.2345,
  status: 'open'
};

const result = await ApiService.sendTradeWebhook(webhookData);
// El backend evalúa automáticamente los riesgos
```

### 3. Monitoreo de Notificaciones
```typescript
// Obtener notificaciones del usuario
const notifications = await ApiService.getNotifications();

// Polling automático cada 60 segundos
useEffect(() => {
  const interval = setInterval(async () => {
    const newNotifications = await ApiService.getNotifications();
    setNotifications(newNotifications);
  }, 60000);
  
  return () => clearInterval(interval);
}, []);
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint
```

### Testing
```bash
# Ejecutar pruebas de integración
node test-integration.js

# Verificar conexión con backend
curl http://127.0.0.1:8000/api/me
```

### Mantenimiento
```bash
# Limpiar cache de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Actualizar dependencias
pnpm update
```

## 🎨 Personalización de Tema

### Configuración de Chakra UI
El tema se configura en `components/ui/provider.tsx`:

```typescript
// Colores personalizados
const customTheme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
  }
};
```

### Variables de Tema
```env
# Tema por defecto
NEXT_PUBLIC_DEFAULT_THEME=system

# Colores personalizados
NEXT_PUBLIC_PRIMARY_COLOR=#2563eb
NEXT_PUBLIC_SECONDARY_COLOR=#64748b
```

## 📱 Responsividad

### Breakpoints
- **Mobile**: < 768px (navegación con NavBar)
- **Desktop**: >= 768px (sidebar lateral)

### Componentes Adaptativos
```typescript
// Ejemplo de componente responsivo
<VStack display={{ base: "flex", md: "none" }}>
  {/* Versión móvil */}
</VStack>

<HStack display={{ base: "none", md: "flex" }}>
  {/* Versión escritorio */}
</HStack>
```

## 🔒 Seguridad

### Protección de Rutas
```typescript
// Hook de autenticación
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <LoginPage />;
```

### Manejo de Tokens
```typescript
// Headers de autenticación automáticos
private static getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}
```

### Validación de Datos
```typescript
// Validación en formularios
if (!selectedAccount || !volume || !openPrice) {
  setError("Todos los campos son obligatorios");
  return;
}
```

## 🚀 Despliegue en Producción

### 1. Configurar Variables de Producción
```env
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_BASE_URL=https://api.tu-dominio.com
NEXT_PUBLIC_DEBUG_MODE=false
```

### 2. Construir la Aplicación
```bash
pnpm build
```

### 3. Desplegar
```bash
# Con Vercel
vercel deploy

# Con Netlify
netlify deploy --prod

# Con servidor propio
pnpm start
```

## 📊 Monitoreo y Analytics

### Configuración Opcional
```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (monitoreo de errores)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Métricas Disponibles
- **Tiempo de carga** de páginas
- **Errores de API** y manejo
- **Interacciones de usuario**
- **Rendimiento** de componentes

## 🧪 Testing

### Pruebas de Integración
El archivo `test-integration.js` incluye pruebas completas:

```bash
# Ejecutar pruebas
node test-integration.js
```

### Pruebas Manuales
1. **Login/Registro** de usuarios
2. **Creación de cuentas** y trades
3. **Evaluación de riesgos** automática
4. **Notificaciones** en tiempo real
5. **Filtrado de datos** por usuario

## 📚 Documentación Adicional

- **INTEGRATION_SUMMARY.md**: Resumen de integración
- **FINAL_CORRECTIONS_SUMMARY.md**: Correcciones finales
- **NOTIFICATIONS_IMPROVEMENTS_SUMMARY.md**: Mejoras de notificaciones
- **test-integration.js**: Script de pruebas completas

## 🤝 Contribución

### Flujo de Desarrollo
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Desarrollar y probar cambios
4. Commit con mensajes descriptivos
5. Push y crear Pull Request

### Estándares de Código
- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Componentes funcionales** con hooks
- **Nomenclatura** descriptiva

## 🆘 Solución de Problemas

### Problemas Comunes

#### Error de CORS
```bash
# Verificar configuración en backend
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

#### Token Expirado
```typescript
// El sistema maneja automáticamente tokens expirados
// Redirige al login cuando es necesario
```

#### Problemas de Conexión
```bash
# Verificar que el backend esté ejecutándose
curl http://127.0.0.1:8000/api/me

# Verificar variables de entorno
echo $NEXT_PUBLIC_BASE_URL_DEV
```

### Logs de Debug
```typescript
// Habilitar logs en desarrollo
NEXT_PUBLIC_DEBUG_MODE=true

// Los logs aparecen en la consola del navegador
console.log('API Response:', data);
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- **Email**: soporte@aseguradora.com
- **Documentación**: Ver archivos MD en el repositorio
- **Issues**: Crear issue en el repositorio

---

**Desarrollado con ❤️ usando Next.js 16 y React 19**