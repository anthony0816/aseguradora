// Script de pruebas de integración para verificar la comunicación Frontend-Backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Función para hacer peticiones HTTP
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`🔄 ${finalOptions.method || 'GET'} ${url}`);
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    console.log('---');
    
    return { response, data };
  } catch (error) {
    console.error(`❌ Error en ${url}:`, error.message);
    console.log('---');
    return { error };
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de integración Frontend-Backend\n');
  
  let authToken = null;
  let userId = null;
  let accountId = null;
  let tradeId = null;

  // 1. Registro de usuario
  console.log('1️⃣ REGISTRO DE USUARIO');
  const registerResult = await makeRequest('/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Usuario Test',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      password_confirmation: 'password123'
    })
  });

  if (registerResult.data && registerResult.data.user) {
    userId = registerResult.data.user.id;
    console.log(`✅ Usuario registrado con ID: ${userId}\n`);
  }

  // 2. Login
  console.log('2️⃣ LOGIN');
  const loginResult = await makeRequest('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: registerResult.data?.user?.email || 'admin@example.com',
      password: 'password123'
    })
  });

  if (loginResult.data && loginResult.data.access_token) {
    authToken = loginResult.data.access_token;
    console.log(`✅ Login exitoso, token obtenido\n`);
  } else {
    console.log('❌ Login falló, intentando con usuario admin por defecto\n');
    const adminLoginResult = await makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });
    
    if (adminLoginResult.data && adminLoginResult.data.access_token) {
      authToken = adminLoginResult.data.access_token;
      userId = adminLoginResult.data.user.id;
      console.log(`✅ Login admin exitoso\n`);
    }
  }

  if (!authToken) {
    console.log('❌ No se pudo obtener token de autenticación. Terminando pruebas.');
    return;
  }

  const authHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // 3. Obtener usuario actual
  console.log('3️⃣ OBTENER USUARIO ACTUAL');
  await makeRequest('/me', {
    method: 'GET',
    headers: authHeaders
  });

  // 4. Crear cuenta
  console.log('4️⃣ CREAR CUENTA');
  const createAccountResult = await makeRequest('/accounts', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      owner_id: userId,
      login: Math.floor(Math.random() * 1000000),
      trading_status: 'enable',
      status: 'enable'
    })
  });

  if (createAccountResult.data && createAccountResult.data.id) {
    accountId = createAccountResult.data.id;
    console.log(`✅ Cuenta creada con ID: ${accountId}\n`);
  }

  // 5. Listar cuentas
  console.log('5️⃣ LISTAR CUENTAS');
  await makeRequest('/accounts', {
    method: 'GET',
    headers: authHeaders
  });

  // 6. Crear trade usando webhook
  if (accountId) {
    console.log('6️⃣ CREAR TRADE VIA WEBHOOK');
    const webhookResult = await makeRequest('/webhook/trade', {
      method: 'POST',
      body: JSON.stringify({
        account_login: createAccountResult.data.login,
        type: 'BUY',
        volume: 1.0,
        open_time: new Date().toISOString(),
        open_price: 1.2345,
        status: 'open'
      })
    });

    if (webhookResult.data && webhookResult.data.trade_id) {
      tradeId = webhookResult.data.trade_id;
      console.log(`✅ Trade creado via webhook con ID: ${tradeId}\n`);
    }
  }

  // 7. Listar trades
  console.log('7️⃣ LISTAR TRADES');
  await makeRequest('/trades', {
    method: 'GET',
    headers: authHeaders
  });

  // 8. Listar notificaciones
  console.log('8️⃣ LISTAR NOTIFICACIONES');
  await makeRequest('/notifications', {
    method: 'GET',
    headers: authHeaders
  });

  // 9. Listar incidentes
  console.log('9️⃣ LISTAR INCIDENTES');
  await makeRequest('/incidents', {
    method: 'GET',
    headers: authHeaders
  });

  // 10. Listar reglas de riesgo
  console.log('🔟 LISTAR REGLAS DE RIESGO');
  await makeRequest('/risk-rules', {
    method: 'GET',
    headers: authHeaders
  });

  // 11. Evaluar riesgo de trade
  if (tradeId) {
    console.log('1️⃣1️⃣ EVALUAR RIESGO DE TRADE');
    await makeRequest(`/risk-evaluation/trade/${tradeId}`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({})
    });
  }

  // 12. Evaluar riesgo de cuenta
  if (accountId) {
    console.log('1️⃣2️⃣ EVALUAR RIESGO DE CUENTA');
    await makeRequest(`/risk-evaluation/account/${accountId}`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({})
    });
  }

  console.log('🎉 Pruebas de integración completadas!');
}

// Ejecutar las pruebas
runTests().catch(console.error);