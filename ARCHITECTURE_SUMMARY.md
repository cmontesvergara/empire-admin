# Arquitectura Completa del Sistema SSO v2.5

## Stack Tecnológico

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT + HTTP-only cookies
- **Validación:** Joi

### Frontend

- **Framework:** Angular 18
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **HTTP Client:** @angular/common/http
- **Routing:** @angular/router
- **State:** RxJS Observables

## Arquitectura de Roles

### Jerarquía de Roles del Sistema

```
super_admin (Mayor privilegio)
    ↓
system_admin (Administrador de sistema)
    ↓
user (Usuario regular)
```

### Permisos por Rol

| Funcionalidad                | user | system_admin | super_admin |
| ---------------------------- | ---- | ------------ | ----------- |
| Login al SSO                 | ✅   | ✅           | ✅          |
| Ver su perfil                | ✅   | ✅           | ✅          |
| Editar su perfil             | ✅   | ✅           | ✅          |
| Usar aplicaciones            | ✅   | ✅           | ✅          |
| Ver catálogo de aplicaciones | ❌   | ✅           | ✅          |
| Crear aplicaciones           | ❌   | ✅           | ✅          |
| Editar aplicaciones          | ❌   | ✅           | ✅          |
| Activar/Desactivar apps      | ❌   | ✅           | ✅          |
| Eliminar aplicaciones        | ❌   | ❌           | ✅          |
| Gestionar tenants            | ❌   | ✅           | ✅          |
| Gestionar usuarios globales  | ❌   | ❌           | ✅          |

## Flujo de Autenticación OAuth-like

### 1. Login Inicial (SSO Portal)

```
┌──────────┐                ┌──────────┐
│ Usuario  │                │ SSO API  │
└────┬─────┘                └────┬─────┘
     │                           │
     │ POST /auth/signin         │
     │ {email, password}         │
     ├──────────────────────────>│
     │                           │
     │   Set-Cookie: ssoSessionId│
     │<──────────────────────────┤
     │                           │
     │ Redirect to /dashboard    │
     │                           │
```

### 2. Autorización para App (User-Initiated Flow)

```
┌────────┐         ┌──────────┐        ┌─────────┐        ┌─────────┐
│ User   │         │ SSO UI   │        │ SSO API │        │ App     │
└───┬────┘         └────┬─────┘        └────┬────┘        └────┬────┘
    │                   │                   │                  │
    │ 1. Click Launch   │                   │                  │
    ├──────────────────>│                   │                  │
    │                   │                   │                  │
    │                   │ 2. POST /auth/authorize              │
    │                   │    {tenantId, appId, redirectUri}    │
    │                   ├──────────────────>│                  │
    │                   │                   │                  │
    │                   │ 3. {authCode}     │                  │
    │                   │<──────────────────┤                  │
    │                   │                   │                  │
    │ 4. Redirect to App with code         │                  │
    │   app.com/auth/callback?code=xyz     │                  │
    ├────────────────────────────────────────────────────────>│
    │                   │                   │                  │
```

### 3. Intercambio de Token (App Backend)

```
┌─────────┐                ┌──────────┐
│ App BE  │                │ SSO API  │
└────┬────┘                └────┬─────┘
     │                          │
     │ POST /auth/token         │
     │ {code, appId, redirectUri}│
     ├─────────────────────────>│
     │                          │
     │ Validate code            │
     │ Create app_session       │
     │                          │
     │   {sessionToken (JWT)}   │
     │<─────────────────────────┤
     │                          │
     │ Set-Cookie: appSessionToken
     │                          │
```

### 4. Validación de Sesión (Cada Request)

```
┌─────────┐                ┌──────────┐
│ App BE  │                │ SSO API  │
└────┬────┘                └────┬─────┘
     │                          │
     │ POST /auth/verify-session│
     │ {sessionToken}           │
     ├─────────────────────────>│
     │                          │
     │ Validate JWT + DB lookup │
     │                          │
     │ {user, tenant, app}      │
     │<─────────────────────────┤
     │                          │
```

## Estructura de Base de Datos

### Tabla: users

```sql
CREATE TABLE users (
  "userId" UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  password VARCHAR NOT NULL, -- bcrypt hash
  "systemRole" VARCHAR DEFAULT 'user', -- 'super_admin', 'system_admin', 'user'
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### Tabla: applications

```sql
CREATE TABLE applications (
  "appId" VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  description VARCHAR,
  "logoUrl" VARCHAR,
  "appSecret" VARCHAR UNIQUE NOT NULL, -- bcrypt hash
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### Tabla: tenants

```sql
CREATE TABLE tenants (
  "tenantId" UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  "taxId" VARCHAR UNIQUE,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### Tabla: app_sessions

```sql
CREATE TABLE app_sessions (
  "sessionId" UUID PRIMARY KEY,
  "userId" UUID REFERENCES users("userId"),
  "tenantId" UUID REFERENCES tenants("tenantId"),
  "appId" VARCHAR REFERENCES applications("appId"),
  "sessionToken" VARCHAR UNIQUE NOT NULL, -- JWT
  "ipAddress" VARCHAR,
  "userAgent" VARCHAR,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session_token ON app_sessions("sessionToken");
CREATE INDEX idx_user_app ON app_sessions("userId", "appId");
```

### Tabla: auth_codes (temporal)

```sql
CREATE TABLE auth_codes (
  code VARCHAR PRIMARY KEY,
  "userId" UUID REFERENCES users("userId"),
  "tenantId" UUID REFERENCES tenants("tenantId"),
  "appId" VARCHAR REFERENCES applications("appId"),
  "redirectUri" VARCHAR NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Auto-cleanup de códigos expirados
DELETE FROM auth_codes WHERE "expiresAt" < NOW();
```

## Endpoints del Backend

### Autenticación SSO

```
POST   /api/v1/auth/signin
       Body: {email, password} o {nuid, password}
       Response: {success, message, user, accessToken, refreshToken}
       Sets: Cookie ssoSessionId

POST   /api/v1/auth/signup
       Body: {email, password, firstName, lastName, ...}
       Response: {success, message}

POST   /api/v1/auth/signout
       Headers: Cookie ssoSessionId
       Response: {success, message}
       Clears: Cookie ssoSessionId
```

### Autorización para Apps

```
POST   /api/v1/auth/authorize
       Headers: Cookie ssoSessionId
       Body: {tenantId, appId, redirectUri}
       Response: {success, authCode, redirectUri}

       El frontend redirige a: {redirectUri}?code={authCode}

POST   /api/v1/auth/token
       Body: {code, appId, appSecret, redirectUri}
       Response: {success, sessionToken (JWT)}

       App backend guarda token en cookie para su app

POST   /api/v1/auth/verify-session
       Body: {sessionToken}
       Response: {success, user, tenant, app, session}

       Usado por app backends para validar sesiones
```

### Gestión de Usuario

```
GET    /api/v1/user/profile
       Headers: Cookie ssoSessionId
       Response: {success, user: {..., systemRole}}

PUT    /api/v1/user/profile
       Headers: Cookie ssoSessionId
       Body: {firstName?, lastName?, ...}
       Response: {success, message, user}

GET    /api/v1/user/tenants
       Headers: Cookie ssoSessionId
       Response: {success, tenants: [...]}
```

### Administración de Aplicaciones (Requiere system_admin o super_admin)

```
GET    /api/v1/admin/applications
       Headers: Cookie ssoSessionId
       Middleware: requireSystemAdmin
       Response: {success, applications: [...]}

POST   /api/v1/admin/applications
       Headers: Cookie ssoSessionId
       Middleware: requireSystemAdmin
       Body: {appId, name, url, description?, logoUrl?, isActive}
       Response: {success, message, application}

PUT    /api/v1/admin/applications/:appId
       Headers: Cookie ssoSessionId
       Middleware: requireSystemAdmin
       Body: {name?, url?, description?, logoUrl?, isActive?}
       Response: {success, message, application}

DELETE /api/v1/admin/applications/:appId
       Headers: Cookie ssoSessionId
       Middleware: requireSuperAdmin (solo super_admin puede eliminar)
       Response: {success, message}
```

## Middleware del Backend

### authenticateUser (SSO Session)

```typescript
// Valida cookie ssoSessionId del portal SSO
// Inyecta req.userId en el request
// Usado en endpoints del portal
```

### requireSystemAdmin

```typescript
// Requiere authenticateUser primero
// Valida que user.systemRole sea 'system_admin' o 'super_admin'
// Usado en endpoints de administración
```

### requireSuperAdmin

```typescript
// Requiere authenticateUser primero
// Valida que user.systemRole sea 'super_admin'
// Usado en endpoints críticos (ej: eliminar apps)
```

### authenticateApp (Para App Backends)

```typescript
// Lee header Authorization: Bearer {token} o cookie appSessionToken
// Valida JWT y lookup en app_sessions
// Inyecta req.appSession con user, tenant, app
// Usado por aplicaciones integradas con SSO
```

## Frontend - Estructura de Carpetas

```
sso-portal/src/app/
├── core/
│   ├── guards/
│   │   ├── is-logged.guard.ts          (Auth básico)
│   │   └── system-admin.guard.ts       (Roles de sistema)
│   ├── models/
│   │   └── index.ts                    (SystemRole, Application, UserProfile)
│   └── services/
│       ├── auth/
│       │   └── auth.service.ts         (Login, perfil, autorización)
│       └── application-management.service.ts (CRUD de apps)
├── modules/
│   ├── admin/
│   │   ├── pages/
│   │   │   └── applications/
│   │   │       ├── applications.component.ts    (Gestión de apps)
│   │   │       └── applications.component.html
│   │   ├── admin-routing.module.ts
│   │   └── admin.module.ts
│   ├── sso-dashboard/
│   │   └── pages/
│   │       └── dashboard/
│   │           └── dashboard.component.ts       (Con botón admin)
│   ├── auth/                           (Login/Signup)
│   ├── profile/                        (Perfil de usuario)
│   └── ...
└── app-routing.module.ts               (Ruta /admin agregada)
```

## Seguridad

### Protección de Cookies

```typescript
// Backend - SSO Session Cookie
res.cookie('ssoSessionId', sessionId, {
  httpOnly: true, // No accesible desde JavaScript
  secure: true, // Solo HTTPS en producción
  sameSite: 'lax', // Protección CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
});
```

### Tokens JWT (App Sessions)

```typescript
// Payload del sessionToken
{
  sessionId: 'uuid',
  userId: 'uuid',
  tenantId: 'uuid',
  appId: 'string',
  iat: 1234567890,
  exp: 1234571490  // 1 hora
}
```

### Authorization Codes

- Expiran en 5 minutos
- Solo se pueden usar una vez
- Se eliminan después de intercambio exitoso

### Rate Limiting

```typescript
// En endpoints críticos
/auth/signin     -> 5 intentos / 15 min
/auth/signup     -> 3 intentos / hora
/auth/authorize  -> 20 intentos / minuto
/auth/token      -> 10 intentos / minuto
```

## Manejo de Errores

### Códigos de Estado HTTP

```
200 OK              - Operación exitosa
201 Created         - Recurso creado
400 Bad Request     - Validación fallida
401 Unauthorized    - No autenticado
403 Forbidden       - Sin permisos
404 Not Found       - Recurso no encontrado
409 Conflict        - Recurso ya existe
500 Internal Error  - Error del servidor
```

### Formato de Error Estándar

```typescript
{
  success: false,
  message: 'Descripción del error',
  errorCode?: 'CODIGO_ERROR',
  details?: {...}
}
```

## Deployment

### Variables de Entorno (Backend)

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/sso_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_64chars_minimo
JWT_EXPIRES_IN=1h

# Cookies
COOKIE_SECRET=otro_secreto_para_cookies
COOKIE_DOMAIN=.tudominio.com

# CORS
ALLOWED_ORIGINS=https://sso.tudominio.com,https://app1.tudominio.com

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@tudominio.com
SMTP_PASS=tu_password
```

### Variables de Entorno (Frontend)

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  baseUrl: 'https://sso-api.tudominio.com',
};
```

### Comandos de Build

```bash
# Backend
cd new_sso_backend
npm run build
npm start

# Frontend
cd sso-portal
npm run build
# Output en dist/ listo para servir con nginx
```

## Monitoreo y Logs

### Eventos a Loguear

- ✅ Login exitoso/fallido
- ✅ Creación de authorization code
- ✅ Intercambio de token
- ✅ Creación de app_session
- ✅ Validación de sesión (solo errores)
- ✅ Operaciones admin (crear/editar/eliminar apps)
- ✅ Cambios de rol de usuario

### Métricas Recomendadas

- Número de logins por hora
- Sesiones activas por aplicación
- Tiempo promedio de respuesta de endpoints
- Tasa de errores por endpoint
- Authorization codes generados vs. usados

## Próximas Features

1. **Gestión de Tenants** (Admin UI)
2. **Gestión de Usuarios Globales** (Super Admin)
3. **Logs de Auditoría** (Historial de cambios)
4. **MFA (Multi-Factor Auth)** (Seguridad adicional)
5. **OAuth2 Completo** (Refresh tokens, scopes)
6. **SSO con Providers Externos** (Google, Microsoft)
7. **Webhooks** (Notificaciones a apps)
8. **API Keys** (Autenticación M2M)

## Versiones

- **v1.0** - SSO básico con usuarios y apps
- **v2.0** - App sessions con JWT
- **v2.5** - Roles de sistema + Admin UI (ACTUAL)
- **v3.0** - MFA + Gestión completa de tenants (Planeado)
