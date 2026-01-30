# Implementación Frontend - Sistema de Roles y Gestión de Aplicaciones

## Resumen de Cambios

Se ha implementado completamente el sistema de roles del sistema (super_admin, system_admin, user) y la interfaz de gestión de aplicaciones en el portal SSO de Angular.

## Archivos Creados

### 1. Modelos e Interfaces

**Archivo:** `src/app/core/models/index.ts`

- Enum `SystemRole` con valores: SUPER_ADMIN, SYSTEM_ADMIN, USER
- Interface `Application` para representar aplicaciones
- Interface `UserProfile` extendida con campo `systemRole`
- Interface `TenantWithApps` para tenants con sus aplicaciones
- DTOs para crear y actualizar aplicaciones

### 2. Servicio de Gestión de Aplicaciones

**Archivo:** `src/app/core/services/application-management.service.ts`

- CRUD completo de aplicaciones:
  - `getAllApplications()` - Obtener todas las aplicaciones
  - `createApplication(data)` - Crear nueva aplicación
  - `updateApplication(appId, data)` - Actualizar aplicación
  - `deleteApplication(appId)` - Eliminar aplicación
- Todas las peticiones usan `withCredentials: true` para enviar cookies SSO

### 3. Guard de Roles de Sistema

**Archivo:** `src/app/core/guards/system-admin.guard.ts`

- Guard funcional para proteger rutas administrativas
- Valida que el usuario tenga rol `system_admin` o `super_admin`
- Redirige al dashboard si no tiene permisos

### 4. Módulo de Administración

**Archivos:**

- `src/app/modules/admin/admin.module.ts` - Módulo administrativo
- `src/app/modules/admin/admin-routing.module.ts` - Routing con guard aplicado

### 5. Componente de Gestión de Aplicaciones

**Archivos:**

- `src/app/modules/admin/pages/applications/applications.component.ts`
- `src/app/modules/admin/pages/applications/applications.component.html`
- `src/app/modules/admin/pages/applications/applications.component.scss`

**Características:**

- Lista de aplicaciones en tabla con:
  - Logo/inicial
  - Nombre y descripción
  - App ID
  - URL
  - Estado (activa/inactiva) - clickeable para cambiar
  - Fecha de creación
  - Acciones (editar/eliminar)
- Modales para crear, editar y eliminar
- Validación de permisos:
  - `system_admin` y `super_admin` pueden crear y editar
  - Solo `super_admin` puede eliminar
- Estados de carga y error
- Estado vacío cuando no hay aplicaciones

## Archivos Modificados

### 1. AuthService

**Archivo:** `src/app/core/services/auth/auth.service.ts`

- Re-exporta `UserProfile`, `TenantWithApps` y `SystemRole` para compatibilidad con código existente
- Ya retorna el `systemRole` del usuario en `getProfile()`

### 2. Dashboard

**Archivo:** `src/app/modules/sso-dashboard/pages/dashboard/dashboard.component.ts`

- Agregado método `isSystemAdmin()` para verificar roles
- Agregado método `goToAdmin()` para navegar a administración
- Importa `SystemRole` desde modelos

**Archivo:** `src/app/modules/sso-dashboard/pages/dashboard/dashboard.component.html`

- Botón "Administración" con ícono de engranaje
- Solo visible para usuarios con rol `system_admin` o `super_admin`
- Ubicado destacadamente antes de los botones de perfil

### 3. App Routing

**Archivo:** `src/app/app-routing.module.ts`

- Agregada ruta `/admin` con lazy loading del módulo AdminModule
- Protegida con `isLoggedGuard` para autenticación básica
- El guard específico de roles se aplica dentro del módulo admin

## Flujo de Funcionamiento

### Acceso a Administración

1. Usuario inicia sesión en el SSO
2. Dashboard carga perfil del usuario con `getProfile()`
3. Si el usuario tiene rol `system_admin` o `super_admin`, aparece botón "Administración"
4. Al hacer clic, navega a `/admin/applications`
5. `systemAdminGuard` valida el rol antes de permitir acceso
6. Si no tiene permisos, redirige al dashboard

### Gestión de Aplicaciones

1. Componente carga lista de aplicaciones al iniciar
2. Verifica permisos con `canManageApps()` y `canDeleteApps()`
3. Muestra botones según permisos:
   - Crear: solo `system_admin` y `super_admin`
   - Editar: todos los administradores
   - Eliminar: solo `super_admin`
4. Cambiar estado activa/inactiva: clic en badge de estado
5. Todos los cambios se comunican con backend vía ApplicationManagementService

### Permisos por Rol

| Acción                | user | system_admin | super_admin |
| --------------------- | ---- | ------------ | ----------- |
| Ver dashboard         | ✅   | ✅           | ✅          |
| Acceder a /admin      | ❌   | ✅           | ✅          |
| Crear aplicaciones    | ❌   | ✅           | ✅          |
| Editar aplicaciones   | ❌   | ✅           | ✅          |
| Cambiar estado de app | ❌   | ✅           | ✅          |
| Eliminar aplicaciones | ❌   | ❌           | ✅          |

## Endpoints del Backend Utilizados

```typescript
// Perfil de usuario (incluye systemRole)
GET /api/v1/user/profile

// Gestión de aplicaciones (protegidos por requireSystemAdmin)
GET    /api/v1/admin/applications
POST   /api/v1/admin/applications
PUT    /api/v1/admin/applications/:appId
DELETE /api/v1/admin/applications/:appId  // Solo super_admin
```

## Estilos y UI

- Diseño con TailwindCSS siguiendo el mismo patrón del dashboard
- Modales con backdrop oscuro y animaciones
- Tablas responsive con hover effects
- Badges de estado con colores semánticos (verde=activa, rojo=inactiva)
- Iconos SVG inline para mejor rendimiento
- Estados de carga con spinner
- Estados de error con mensajes claros

## Testing

### Para Probar la Implementación

1. **Usuario Regular (user)**

```bash
# Iniciar sesión con usuario normal
# No debe aparecer botón "Administración"
# /admin debe redirigir al dashboard
```

2. **System Admin**

```bash
# Iniciar sesión con system_admin@empresa.com
# Debe aparecer botón "Administración"
# Puede crear y editar aplicaciones
# NO puede eliminar aplicaciones
```

3. **Super Admin**

```bash
# Iniciar sesión con superadmin@sso.local
# Debe aparecer botón "Administración"
# Puede crear, editar y eliminar aplicaciones
# Botón de eliminar visible en todas las filas
```

## Compilación

La aplicación compila exitosamente sin errores:

```bash
npm run build
✔ Build at: 2026-01-30T04:16:34.183Z
✔ Hash: cdbacc5d446fd048
✔ Time: 9222ms
✔ Bundle size: 1.06 MB (initial)
```

## Próximos Pasos (Opcionales)

1. **Testing Unitario**: Agregar tests para componente y guard
2. **E2E Testing**: Agregar tests Playwright para flujo completo
3. **Gestión de Tenants**: Crear módulo similar para administrar tenants
4. **Gestión de Usuarios**: Panel para administrar usuarios del sistema
5. **Logs de Auditoría**: Visualizar cambios en aplicaciones
6. **Búsqueda y Filtros**: Agregar búsqueda en lista de aplicaciones
7. **Paginación**: Implementar paginación si hay muchas apps

## Notas Técnicas

- Componente de aplicaciones es standalone (Angular 18)
- Guard es funcional (no class-based)
- Todas las peticiones HTTP usan observables
- Re-exportación de interfaces en AuthService mantiene compatibilidad
- Modales se manejan con flags booleanos (sin librería externa)
- FormData se gestiona con ngModel (FormsModule)
