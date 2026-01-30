# Guía de Pruebas - Sistema de Roles SSO

## Pre-requisitos

1. **Backend SSO corriendo** en `http://localhost:3000`
2. **Base de datos** con usuarios de prueba creados
3. **Frontend SSO** corriendo en `http://localhost:4200`

## Usuarios de Prueba

### Super Admin

```
Email: superadmin@sso.local
Password: [tu contraseña]
Rol: super_admin
```

### System Admin

```
Email: systemadmin@empresa.com
Password: [tu contraseña]
Rol: system_admin
```

### Usuario Regular

```
Email: usuario@empresa.com
Password: [tu contraseña]
Rol: user
```

## Casos de Prueba

### Caso 1: Usuario Regular (NO debe ver administración)

1. **Login**

   - Navega a `http://localhost:4200`
   - Ingresa credenciales de usuario regular
   - Verifica que llegues al dashboard

2. **Dashboard**

   - ❌ NO debe aparecer botón "Administración"
   - ✅ Solo debe ver: "Editar Perfil" y "Seguridad"

3. **Acceso Directo**
   - Intenta acceder a `http://localhost:4200/admin`
   - ✅ Debe redirigir automáticamente a `/dashboard`

**Resultado Esperado:** Usuario regular no tiene acceso a sección administrativa.

---

### Caso 2: System Admin (Puede gestionar pero NO eliminar)

1. **Login**

   - Ingresa credenciales de system_admin
   - Verifica que llegues al dashboard

2. **Dashboard**

   - ✅ Debe aparecer botón "Administración" con ícono de engranaje
   - El botón debe estar destacado (fondo azul)

3. **Acceso a Administración**

   - Click en "Administración"
   - ✅ Debe navegar a `/admin/applications`
   - ✅ Debe ver lista de aplicaciones

4. **Crear Aplicación**

   - Click en "Nueva Aplicación"
   - Completar formulario:
     ```
     App ID: test-app
     Nombre: Aplicación de Prueba
     URL: http://localhost:5000
     Descripción: App de prueba
     Activa: ✓
     ```
   - Click en "Crear"
   - ✅ Debe aparecer en la lista
   - ✅ Debe mostrar mensaje de éxito

5. **Editar Aplicación**

   - Click en ícono de editar (lápiz) de cualquier app
   - Cambiar nombre a "Aplicación Editada"
   - Click en "Actualizar"
   - ✅ Cambios deben reflejarse en la lista

6. **Cambiar Estado**

   - Click en badge de estado (Activa/Inactiva)
   - ✅ Estado debe cambiar inmediatamente
   - Click nuevamente para volver al estado anterior

7. **Intentar Eliminar**
   - ❌ NO debe aparecer botón de eliminar (icono de basura)

**Resultado Esperado:** System admin puede crear y editar, pero NO eliminar.

---

### Caso 3: Super Admin (Acceso Total)

1. **Login**

   - Ingresa credenciales de superadmin
   - Verifica que llegues al dashboard

2. **Dashboard**

   - ✅ Debe aparecer botón "Administración"

3. **Acceso a Administración**

   - Click en "Administración"
   - ✅ Debe ver lista completa de aplicaciones

4. **Crear Aplicación**

   - Click en "Nueva Aplicación"
   - Completar formulario:
     ```
     App ID: super-test
     Nombre: App de Super Admin
     URL: http://localhost:6000
     ```
   - ✅ Debe crearse exitosamente

5. **Eliminar Aplicación**

   - ✅ Debe aparecer botón rojo de eliminar en cada fila
   - Click en eliminar de "super-test"
   - Confirmar en modal: "¿Estás seguro...?"
   - Click en "Eliminar"
   - ✅ Aplicación debe desaparecer de la lista
   - ✅ Debe mostrar mensaje de éxito

6. **Todas las operaciones del System Admin**
   - Verificar que también puede crear y editar

**Resultado Esperado:** Super admin tiene acceso total (crear, editar, eliminar).

---

## Verificación de Backend

### Endpoints a Probar con Postman/cURL

#### 1. Obtener Perfil (debe incluir systemRole)

```bash
curl http://localhost:3000/api/v1/user/profile \
  -H "Cookie: ssoSessionId=YOUR_SESSION_COOKIE"
```

**Respuesta esperada:**

```json
{
  "success": true,
  "user": {
    "userId": "...",
    "email": "superadmin@sso.local",
    "firstName": "Super",
    "lastName": "Admin",
    "systemRole": "super_admin"
  }
}
```

#### 2. Listar Aplicaciones (solo system_admin+)

```bash
curl http://localhost:3000/api/v1/admin/applications \
  -H "Cookie: ssoSessionId=YOUR_SESSION_COOKIE"
```

**Respuesta esperada:**

```json
{
  "success": true,
  "applications": [
    {
      "appId": "admin",
      "name": "Empire Admin",
      "url": "http://localhost:4500",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### 3. Crear Aplicación (solo system_admin+)

```bash
curl -X POST http://localhost:3000/api/v1/admin/applications \
  -H "Content-Type: application/json" \
  -H "Cookie: ssoSessionId=YOUR_SESSION_COOKIE" \
  -d '{
    "appId": "test",
    "name": "Test App",
    "url": "http://localhost:9000",
    "description": "Testing",
    "isActive": true
  }'
```

#### 4. Eliminar Aplicación (solo super_admin)

```bash
curl -X DELETE http://localhost:3000/api/v1/admin/applications/test \
  -H "Cookie: ssoSessionId=YOUR_SESSION_COOKIE"
```

**Si eres system_admin:**

```json
{
  "success": false,
  "message": "Solo super_admin puede eliminar aplicaciones"
}
```

**Si eres super_admin:**

```json
{
  "success": true,
  "message": "Aplicación eliminada exitosamente"
}
```

---

## Verificación en Base de Datos

### Verificar roles en PostgreSQL

```sql
-- Conectar a la base de datos
psql -U tu_usuario -d sso_db

-- Ver usuarios y sus roles
SELECT
  u.email,
  u."firstName",
  u."lastName",
  u."systemRole",
  u."createdAt"
FROM users u
ORDER BY u."systemRole" DESC;
```

**Resultado esperado:**

```
email                    | firstName | lastName | systemRole   | createdAt
-------------------------|-----------|----------|--------------|----------
superadmin@sso.local    | Super     | Admin    | super_admin  | ...
systemadmin@empresa.com | System    | Admin    | system_admin | ...
usuario@empresa.com     | Usuario   | Normal   | user         | ...
```

### Verificar aplicaciones

```sql
SELECT
  "appId",
  name,
  url,
  "isActive",
  "createdAt"
FROM applications
ORDER BY "createdAt" DESC;
```

---

## Troubleshooting

### El botón "Administración" no aparece

**Problema:** Usuario con system_admin no ve el botón.

**Solución:**

1. Verificar en consola del navegador que el perfil cargue correctamente:
   ```javascript
   // En DevTools Console
   localStorage;
   ```
2. Verificar en Network tab que `/api/v1/user/profile` retorne el `systemRole`
3. Verificar que el usuario tenga el rol correcto en BD

### Error al crear aplicación

**Problema:** Error 403 o "No autorizado"

**Solución:**

1. Verificar que la cookie SSO se envíe:
   ```javascript
   // En DevTools > Application > Cookies
   // Buscar: ssoSessionId
   ```
2. Verificar que el middleware `requireSystemAdmin` esté aplicado en el endpoint
3. Verificar logs del backend para ver el error exacto

### Guard redirige incorrectamente

**Problema:** Usuario con permisos es redirigido al dashboard

**Solución:**

1. Verificar que `systemAdminGuard` esté importado correctamente
2. Ver consola del navegador para errores
3. Verificar que AuthService.getProfile() retorne observable válido

### Aplicación no se elimina

**Problema:** Click en eliminar no funciona

**Solución:**

1. Verificar rol del usuario (debe ser super_admin)
2. Verificar que el botón solo aparezca para super_admin:
   ```html
   *ngIf="canDeleteApps()"
   ```
3. Verificar endpoint en backend: `DELETE /api/v1/admin/applications/:appId`

---

## Checklist Final

- [ ] Backend compilando sin errores
- [ ] Frontend compilando sin errores
- [ ] Base de datos migrada con app_sessions
- [ ] Usuarios de prueba creados con roles correctos
- [ ] Usuario regular NO ve administración
- [ ] System admin puede crear y editar
- [ ] System admin NO puede eliminar
- [ ] Super admin puede crear, editar y eliminar
- [ ] Guard redirige correctamente según rol
- [ ] Modales funcionan correctamente
- [ ] Estados de carga y error se muestran
- [ ] Cambiar estado de aplicación funciona
- [ ] Cookies SSO se envían en todas las peticiones

## Siguiente Fase

Una vez completadas todas las pruebas exitosamente, el sistema está listo para:

1. **Deployment a staging**
2. **Testing E2E automatizado**
3. **Gestión de tenants** (siguiente feature)
4. **Gestión de usuarios del sistema** (siguiente feature)
