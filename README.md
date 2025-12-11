Front GamerZone Web

Aplicación web de ZonaGamer construida con React + Vite. Incluye catálogo de productos, configurador "Arma tu PC" y un panel de administración con gestión de productos y visualización de opciones del configurador.

Tecnologías
- React 19, React Router DOM 7
- Vite 7
- TailwindCSS 4, DaisyUI 5 y Bootstrap 5
- Axios
- Vitest (tests) y ESLint

Scripts
- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run preview`: sirve el build para revisión
- `npm run test`: ejecuta pruebas
- `npm run test:coverage`: cobertura de pruebas
- `npm run lint`: linting del proyecto

Configuración
- Variables de entorno: crear `.env` con `VITE_API_URL` apuntando a la API, por ejemplo:
  - `VITE_API_URL=http://3.236.11.196:8080/api`

Arquitectura de datos (API-only)
- Hooks: `src/hooks/useProducts.js` y `src/hooks/useCategories.js` consumen servicios HTTP.
- Servicios: `src/services/productService.js`, `src/services/categoryService.js`, `src/services/userService.js`, `src/services/orderService.js`, `src/services/authService.js`, `src/services/api.js`.
- Cliente API: `src/lib/api/productsApi.js` (axios).
- Sin dependencias locales previas (`productsCRUD.js`, `localCart.js`, etc.).

Estructura principal
- `src/pages/App.jsx`: página principal
- `src/pages/ProductPage.jsx`: catálogo con filtros y destacados
- `src/pages/ArmaTuPC.jsx`: configurador estilo HyperPC con tarjetas seleccionables
- `src/pages/DashboardPage.jsx`: panel de administración
- `src/components/Dashboard/ProductsManagement.jsx`: gestión de productos (CRUD)
- `src/components/Dashboard/PCBuilderManagement.jsx`: sección admin para "Arma tu PC"
- `src/components/Dashboard/DashboardLayout.jsx` y `src/components/Dashboard/Sidebar.jsx`: layout del panel
- `src/components/Navbar/Navbar.jsx`: barra de navegación
- `src/components/Login/Login.jsx` y `src/components/Registro/Registro.jsx`: auth UI
- `src/hooks/useProducts.js` y `src/hooks/useCategories.js`: hooks de datos
- `src/lib/api/productsApi.js`: cliente API de productos
- `src/data/pcBuilder.js`: datos compartidos del configurador (opciones e imágenes)
- `src/pages/App.css`: estilos del configurador y ajustes visuales

Rutas
- `/`: Home
- `/productos`: Catálogo de productos
- `/arma-tu-pc`: Configurador de PC
- `/login` y `/registro`: autenticación UI
- `/dashboard`: panel de administración

Arma tu PC
Implementación inspirada en HyperPC con selección por tarjetas, miniaturas y resumen.
- Tarjetas clicables para cada grupo de componente.
- Miniatura del componente seleccionado y carrusel de gabinete.
- Resumen y total dinámico.

Archivos clave
- `src/pages/ArmaTuPC.jsx`: UI y lógica de selección.
- `src/data/pcBuilder.js`: define `PC_COMPONENTS` y `PC_COMPONENT_IMAGES` para reutilización.

Imágenes mapeadas
- Gabinete: `gabinete01.png`, `gabinete02.png`, `gabinete03.png` (Asus TUF GT502/302/301)
- CPU: `https://hyperpc.cl/wp-content/uploads/2025/04/intel-core-i5-14-300x300.jpg`
- RAM: `https://hyperpc.cl/wp-content/uploads/2025/03/Kingston-Fury-Beast-RGB-DDR5-HyperPC-300x300.jpg`
- HDD 2TB Seagate Barracuda: `https://m.media-amazon.com/images/I/71V1jd3s9dL._AC_SL1500_.jpg`
- Refrigeración aire (Peerless Assassin 120 SE): `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDfuiLyzhoJ23gBPuD9w11yRa3T-DXrH8hOQ&s`
- Refrigeración líquida (Asus TUF LC II 240): `https://http2.mlstatic.com/D_NQ_NP_966722-MLA95527000132_102025-O.webp`
- Fuente PSU 750W XPG Core Reactor II: `https://http2.mlstatic.com/D_NQ_NP_628323-CBT85098604494_052025-O.webp`
- Fuente PSU 850W Corsair RM850x: `https://media.spdigital.cl/thumbnails/products/ac2xoeho_af1ff991_thumbnail_4096.jpg`
- Windows 11 Home: `https://cl-cenco-pim-resizer.ecomm.cencosud.com/.../MKN7LEJRL8-1-1.png`
- Windows 11 Pro: `https://cdnx.jumpseller.com/compuelite/image/35452057/thumb/610/610?1684525397`

Mejoras visuales
- Imágenes del gabinete sin recorte usando `object-fit: contain` y miniaturas clicables.
- Estilos de tarjetas en `src/pages/App.css` para una UI limpia y responsiva.

Panel de Administración
Incluye dos secciones principales:
1. Productos: CRUD de productos con tabla, filtros y modales.
   - `src/components/Dashboard/ProductsManagement.jsx`
2. Arma tu PC: visualización de grupos y opciones del configurador con imagen y precio.
   - `src/components/Dashboard/PCBuilderManagement.jsx`
   - Integrado en el sidebar y enrutado del panel.

Acceso rápido
- Visitar `http://localhost:5173/dashboard` y elegir "Arma tu PC" en el sidebar.

Instalación y uso
1. Requisitos: Node.js 18+
2. Instalar dependencias: `npm install`
3. Desarrollo: `npm run dev` (abre `http://localhost:5173`)
4. Build producción: `npm run build`
5. Preview del build: `npm run preview`

Pruebas y calidad
- Ejecutar pruebas: `npm run test`
- Cobertura: `npm run test:coverage`
- Lint: `npm run lint`

Notas
- El configurador usa datos locales en `src/data/pcBuilder.js`.
- La sección admin de "Arma tu PC" es de lectura; se puede extender a CRUD siguiendo el patrón de `ProductsManagement`.
