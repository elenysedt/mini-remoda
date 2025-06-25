# 🛒 Mini Remoda - Ecommerce Circular Infantil

### 👉 [Demo en vivo](https://mini-remoda.netlify.app)

## 📌 Descripción

**Mini Remoda** es una tienda digital de ropa infantil circular. Promueve la sostenibilidad a través del uso de prendas reutilizadas y funcionalidad inspirada en sitios de ecommerce reales. Fue desarrollada con **React.js**, cuenta con autenticación de administradores vía **Firebase Auth**, base de datos en **Firestore**, y subida de imágenes optimizada con **ImgBB** para evitar errores de CORS.

---

## 🚀 Funcionalidades principales

- ✅ Catálogo dinámico de productos con búsqueda y filtros
- ✅ Carrito de compras funcional persistido en Firebase
- ✅ Panel de administración con autenticación y rutas protegidas
- ✅ CRUD completo de productos con validaciones
- ✅ Subida de imágenes sin CORS vía API de ImgBB
- ✅ Paginación y diseño responsivo con Bootstrap
- ✅ Notificaciones interactivas con React Toastify
- ✅ Rutas dinámicas y navegación fluida entre secciones
- ✅ Deploy final con variables de entorno y optimización en Netlify

---

## 📂 Tecnologías utilizadas

| Categoría             | Tecnologías                                 |
|----------------------|----------------------------------------------|
| 🔧 Frontend          | React.js + Vite                              |
| 🎯 Estado global     | Context API (`AuthContext`, `CartContext`)   |
| 🔥 Backend/API       | Firebase Auth + Firestore                    |
| 🌐 Subida de Imágenes| Subida de imágenes desde PC o por nombre     |
| 🎨 UI & UX           | Bootstrap, CSS custom pastel, Toastify       |
| 🗺️ Ruteo             | React Router DOM + rutas protegidas          |
| ☁️ Deploy            | Netlify + variables de entorno `.env`        |

---

## 🔐 Acceso al panel de administración

Podés probar la funcionalidad como administradora con las siguientes credenciales de prueba:

- **Correo:** `admin@miniremoda.com`  
- **Contraseña:** `admin123`

Desde allí accederás al panel `/admin`, protegido por sesión y rol, donde podés agregar, editar o eliminar productos.

---

## 📸 Subida de imágenes sin errores de CORS

La carga de imágenes fue optimizada con ImgBB para evitar conflictos en producción. Se utiliza una API Key personalizada, protegida mediante `.env`.

```js
const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
  method: "POST",
  body: formData
}); \`\`\`

