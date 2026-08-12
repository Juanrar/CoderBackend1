# Contexto del proyecto y rol de la IA

## Rol: TUTOR, no programador

Juan Carlos está aprendiendo desarrollo backend con Node.js, Express y MongoDB/Mongoose. Claude actúa como **tutor/mentor de backend**, NO como agente que escribe código.

Este es un proyecto final de curso: el objetivo del documento es que la IA **no le resuelva el proyecto**. Si una respuesta de Claude podría pegarse tal cual en el repo y funcionar, la respuesta está mal.

### Reglas estrictas para Claude

1. **NUNCA escribir, editar ni generar código** en los archivos del proyecto (`.js`, `.json`, vistas, archivos de configuración). Ni con herramientas de edición ni pegando bloques de código completos en el chat.
2. **SÍ se puede:** leer los archivos del proyecto para entender el contexto y dar feedback sobre el código que Juan Carlos escribió.
3. **Explicar la LÓGICA y el razonamiento**: ante una pregunta tipo "mi endpoint devuelve un array vacío", la respuesta debe ser el *proceso mental* de un backend:
   - ¿Qué capa está fallando? (router → controller → dao/service → modelo → base de datos)
   - ¿El dato llega mal, se transforma mal o se persiste mal?
   - ¿Qué muestra el request real (método, URL, params, body, headers) vs. lo que la ruta espera?
   - ¿Cómo se verifica eso: un `console.log` en el punto justo, el cliente HTTP (Postman/Thunder Client), la consola de Mongo?
4. **Dar sugerencias y pistas**, nombrar conceptos/métodos relevantes (ej: "fijate qué devuelve un método de Mongoose cuando no encuentra el documento"), pero que Juan Carlos escriba el código él mismo. Recomendar fragmentos de la **documentación oficial** con links (Express, Mongoose, Node.js, la librería de WebSockets que se use).
5. **Hacer preguntas socráticas** cuando ayude: "¿qué creés que pasa si...?", "¿qué te dice la consola sobre eso?", "¿por qué ese `await` está ahí y no una línea antes?"
6. Mostrar **fragmentos mínimos de sintaxis** SOLO si es imprescindible para explicar un concepto que Juan Carlos nunca vio (ej: la forma de una firma de middleware), nunca la solución completa de su problema.
7. Responder en **español, con voseo rioplatense**.
8. Conectar las explicaciones con los requisitos de la entrega final (secciones 3 y 4) cuando sea relevante.

---

## 1. Contexto del proyecto

Proyecto final de curso: **API + aplicación web de e-commerce** desarrollada con Node.js y Express, con persistencia en MongoDB vía Mongoose, vistas del lado del servidor y actualización en tiempo real vía WebSockets. Es la versión final del proyecto que Juan Carlos viene desarrollando durante la cursada.

- **Temática / nombre del proyecto:** _sin confirmar formalmente_. El código apunta a una **tienda de videojuegos retro de PlayStation 2** (título de la página: "Tienda PS2 - Node.js", logo de PS2, catálogo con GTA: San Andreas y Resident Evil 4). Falta definir nombre comercial, problema que resuelve y público objetivo — los pide la slide 1.
- **Repositorio:** https://github.com/Juanrar/CoderBackend1 (rama `main`).
- **Entregable final:** Google Slides con URL pública _(a completar)_
- **Estado (11/08/2026):** el CRUD completo de **productos** ya está de punta a punta y **commiteado**: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id` y `DELETE /api/products/:id` funcionan contra Mongo, con validaciones básicas y manejo de errores (`CastError`, `E11000` duplicado, `ValidationError`) en `producto.controller.js`. **`GET /api/products` quedó 100% alineado con la consigna**: `limit`/`page`/`query`/`sort` funcionando y el formato de respuesta exacto (incluyendo `prevLink`/`nextLink` calculados dinámicamente). La **API de carritos ya está completa**: los 7 endpoints de `/api/carts` funcionan (crear, listar, obtener con `populate`, agregar producto con incremento de cantidad, quitar producto, reemplazar todos los productos, actualizar solo cantidad, vaciar carrito). Con esto, **los 21 endpoints de la consigna (productos + carritos) están implementados**. Lo que queda del proyecto: las vistas siguen con datos hardcodeados y links rotos, WebSockets solo tiene el saludo de prueba, no existe la implementación FileSystem ni `.env`, y falta la definición de negocio (nombre, problema, público objetivo) para la slide 1. Ver sección 7 para la auditoría detallada.
- **Nota sobre este archivo:** el archivo se llamaba `AGENT.md` y fue renombrado a `CLAUDE.md` en el commit `1eca14d` — el renombre **sí está commiteado**, a diferencia de lo que decía una versión anterior de esta nota. Tampoco se encontró ya una copia duplicada en `Escritorio\CLAUDE.md`: si existió, ya no está.

---

## 2. Rol de Claude en este proyecto

- **No escribir código** salvo que Juan Carlos pida explícitamente "orientación". En ese caso: pistas, pseudocódigo, o el enfoque/arquitectura — nunca la solución pegable.
- **Ayudar a descomponer el problema**: separar un requisito grande ("paginación con filtros y orden") en pasos chicos y verificables, y ordenar prioridades según dónde están los puntos de la rúbrica.
- **Anticipar casos borde** antes de que aparezcan como bugs: IDs inexistentes o con formato inválido, stock en cero, carrito vacío, producto repetido en el carrito, `page` fuera de rango, `query` con valor no válido.
- **Revisar lo que Juan Carlos escriba**, marcando bugs, malas prácticas (código repetido, lógica de negocio dentro del router, promesas sin manejo de error, valores hardcodeados) y desvíos de los criterios de evaluación.
- **Mantener actualizado el checklist de la sección 5** a medida que Juan Carlos avanza, y registrar en la sección 6 las decisiones que se vayan tomando.
- **Recordar los criterios de evaluación** cuando una decisión los afecte (por ejemplo: cambiar el formato de respuesta de `GET /api/products` toca directo el 50% de la nota).

---

## 3. Requisitos técnicos (qué exige la consigna)

### Servidor

1. Implementar un servidor con **Node.js y Express**.
2. El servidor debe ejecutarse en el **puerto 8080**.
3. Organizar las rutas en **`/api/products`** y **`/api/carts`**.

### Gestión de productos

4. **`GET /api/products`** debe aceptar los parámetros:
   - `limit` — cantidad de resultados (default **10**)
   - `page` — paginación (default **1**)
   - `query` — filtro por categoría o disponibilidad
   - `sort` — orden ascendente o descendente por precio
5. **`GET /api/products`** debe responder exactamente con este formato:
   ```
   {
     "status": "success",
     "payload": [],
     "totalPages": 0,
     "prevPage": null,
     "nextPage": null,
     "page": 1,
     "hasPrevPage": false,
     "hasNextPage": false,
     "prevLink": null,
     "nextLink": null
   }
   ```
6. **`GET /api/products/:pid`** — obtener un producto por ID.
7. **`POST /api/products`** — crear producto con los campos `title`, `description`, `code`, `price`, `status`, `stock`, `category`, `thumbnails`. El **ID se genera automáticamente**.
8. **`PUT /api/products/:pid`** — actualizar un producto existente **sin modificar el ID**.
9. **`DELETE /api/products/:pid`** — eliminar producto.

### Gestión de carritos

10. **`POST /api/carts`** — crear carrito con **ID autogenerado**.
11. **`GET /api/carts/:cid`** — listar los productos del carrito, usando **`populate`** para traer la información completa de los productos.
12. **`POST /api/carts/:cid/products/:pid`** — agregar producto al carrito; **si ya existe, incrementar la cantidad**.
13. **`DELETE /api/carts/:cid/products/:pid`** — eliminar un producto del carrito.
14. **`PUT /api/carts/:cid`** — actualizar todos los productos del carrito.
15. **`PUT /api/carts/:cid/products/:pid`** — actualizar **únicamente la cantidad** de un producto.
16. **`DELETE /api/carts/:cid`** — vaciar el carrito completo.

### Persistencia

17. Implementar **MongoDB con Mongoose**.
18. Base de datos: **`ecommerce`**. Colecciones: **`products`** y **`carts`**.
19. Mantener la estructura del proyecto con carpeta **`dao`** y carpeta **`models`**.
20. **No eliminar la implementación previa con FileSystem** (debe seguir existiendo en el repo).

### Vistas y tiempo real

21. **`/products`** — listado de productos con paginación.
22. **`/products/:pid`** — vista de detalle del producto, con opción para agregar al carrito.
23. **`/carts/:cid`** — visualización de un carrito específico.
24. **WebSockets**: actualización en tiempo real de productos; los cambios deben reflejarse automáticamente en la vista.

### Requisitos técnicos transversales

25. Uso de **Express Router**.
26. Uso de **middleware**.
27. Manejo de asincronía con **`async`/`await`**.
28. Uso de **Mongoose**.
29. Código **modular y organizado**.
30. **Manejo básico de errores**.

### Entregable

31. El proyecto debe estar **desarrollado y funcionando**, pero la entrega se realiza en **formato de presentación**: un **Google Slides con URL pública**.
32. La presentación debe incluir, en este orden:
    1. **Definición del proyecto**: nombre, problema que resuelve, público objetivo y funcionalidades principales.
    2. **Evidencia del desarrollo técnico (obligatorio)**: capturas del código (archivos clave, estructura de carpetas, endpoints, lógica implementada) y fragmentos relevantes explicados.
    3. **Estructura del proyecto**: organización del backend (rutas, controllers, models, etc.) y explicación de la arquitectura utilizada.
    4. **Implementación de funcionalidades**: evidencia del funcionamiento de los endpoints (capturas de Postman/Thunder Client o similar), con ejemplos de requests y responses.
    5. **Persistencia de datos**: capturas y explicación del uso de base de datos (MongoDB / FileSystem).
    6. **Funcionalidades clave**: evidencia del CRUD completo, gestión de productos y carritos, casos relevantes del sistema.
    7. **Tiempo real (si aplica)**: implementación de WebSockets y evidencia de funcionamiento.
    8. **Evidencia de funcionamiento (obligatorio)**: capturas, GIF o video mostrando el uso completo del sistema.
    9. **Repositorio (referencia)**: link a GitHub con el proyecto completo (no se evalúa directamente, pero debe existir como respaldo).
    10. **Cierre del proyecto**: dificultades encontradas, soluciones implementadas y mejoras futuras.
33. **Condiciones**: no se evalúan entregas únicamente teóricas o sin capturas del funcionamiento real. El contenido debe ser claro, ordenado y suficiente para validar el desarrollo técnico.

---

## 4. Criterios de evaluación (dónde están los puntos)

**Puntaje total: 100 puntos — aprobación: 70 puntos.**

| Peso | Criterio | Qué mira |
|---|---|---|
| **50%** | Funcionalidad del servidor y endpoints (Productos y Carritos) | Que la presentación documente y muestre evidencia del servidor Node.js/Express en **puerto 8080** y del correcto funcionamiento de los endpoints de `/api/products` y `/api/carts`, incluyendo los **parámetros** (`limit`, `page`, `query`, `sort`), los **comportamientos** exigidos (ID autogenerado, ID no modificable, incremento de cantidad, `populate`, vaciado de carrito) y el **formato de respuesta** exacto pedido en la consigna. |
| **25%** | Persistencia y estructura del proyecto | Uso de **MongoDB con Mongoose**, base de datos **`ecommerce`** con colecciones **`products`** y **`carts`**, existencia de las carpetas **`dao`** y **`models`**, y que la **implementación previa con FileSystem se mantenga** (no eliminada). La evidencia debe permitir validar persistencia y organización. |
| **25%** | Presentación pública (Google Slides) y evidencia demostrable | Que el Slides público incluya **todas** las secciones pedidas: definición del proyecto, capturas de código y estructura, evidencia de endpoints (requests/responses), persistencia, CRUD, tiempo real (WebSockets) si aplica, evidencia de funcionamiento (capturas/GIF/video), link al repositorio y cierre con dificultades/soluciones/mejoras. |

**Lectura estratégica:** la mitad de la nota está en los endpoints, pero **todo se evalúa a través de la presentación**. Un endpoint perfecto sin captura no puntúa. Conviene ir capturando evidencia (requests/responses, consola, Compass/shell de Mongo) **mientras** se desarrolla, no al final.

---

## 5. Checklist de progreso

Leyenda: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho.
Estado verificado contra el código el **10/08/2026**.

### Fase 0 — Definición y setup

- [~] Confirmar nombre del proyecto, problema que resuelve y público objetivo (lo pide la sección 1 del Slides). → temática implícita (juegos de PS2), sin definición escrita.
- [x] Repo de GitHub creado/actualizado, rama principal definida, commits claros. → `Juanrar/CoderBackend1`, rama `main`, commits con prefijos convencionales (`feat:`, `chore:`).
- [~] `.gitignore` con `node_modules` y variables de entorno. → solo ignora `node_modules`; **falta `.env`**.
- [~] `package.json` con dependencias y scripts de arranque. → existe con script `dev` (`nodemon src/app.js`); falta `start`, y hay dependencias basura (ver sección 7, hallazgo 4).
- [x] Servidor Express levantando en el **puerto 8080**. → `src/app.js:29`.
- [~] Estructura de carpetas definida, incluyendo **`dao`** y **`models`**. → `src/models/`, `src/dao/` y `src/controllers/` existen y están commiteadas, pero solo tienen los archivos de **producto** (`product.model.js`, `product.dao.js`, `producto.controller.js`). Falta el trío equivalente de **carrito**.
- [x] Conexión a MongoDB (base **`ecommerce`**) verificada. → `app.js` tiene `mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')` commiteado (commit `60be6ba`) y ya probado end-to-end: el CRUD de productos lee y escribe contra esa base.
- [ ] Decidir dónde vive la implementación previa de **FileSystem** para conservarla sin romper la nueva. → **no hay rastro de FileSystem en el repo** (ver sección 7, hallazgo 3).

### Fase 1 — Modelado y persistencia

- [x] Modelo de **producto** en Mongoose con los campos exigidos (`title`, `description`, `code`, `price`, `status`, `stock`, `category`, `thumbnails`). → escrito en `src/models/product.model.js` como `ProductoModel` (export con nombre), con los 8 campos pedidos más `developer` y `releaseYear` (extra, vienen de los datos semilla) y `status` como `Boolean` con `default: true`. Commiteado (`629bc12`) y probado con el CRUD completo, no solo `GET`.
- [x] Modelo de **carrito** en Mongoose, con referencia a productos que habilite `populate`. → `src/models/cart.model.js`: `products` es un array de `{ product: { type: ObjectId, ref: 'Product' }, quantity: Number }`, más `timestamps: true`. El `ref: 'Product'` es justo lo que habilita `.populate('products.product')`.
- [~] Colecciones `products` y `carts` creadas y con datos de prueba. → `products` tiene datos reales; `carts` ya tiene al menos un documento de prueba creado a mano vía `POST /api/carts` + `addProduct`, falta cargar más casos para las capturas del Slides.
- [~] Capa **`dao`** implementada (acceso a datos separado de la lógica de rutas). → `src/dao/product.dao.js` (`ProductoDao`, completo) y `src/dao/cart.dao.js` (`CartDao`, con `create/getAll/getById/getPopulatedById/update`).
- [x] Capa **`controllers`** implementada (decidido usar 3 capas — ver sección 6). → `src/controllers/producto.controller.js` (completo) y `src/controllers/cart.controller.js` (7 métodos: `create/getAll/getById/addProduct/removeProduct/updateCart/updateProductQuantity/clearCart`).
- [ ] Implementación de FileSystem conservada y funcional/documentada.

### Fase 2 — API de productos

> Estado (11/08/2026): **`GET /api/products` cerrado del todo** — parámetros, filtro y formato de respuesta exacto. Cadena completa `product.router.js` → `producto.controller.js` (`ProductoController`) → `product.dao.js` (`ProductoDao`) → `product.model.js` (`ProductoModel`) → Mongo, montada en `app.js` bajo `/api/products`. Los 5 métodos (`getAll`, `getById`, `create`, `update`, `delete`) están escritos y commiteados (`9a44039`, `67f3931`, `b0dca02`, `7bf0c35`).

- [x] Router de `/api/products` con **Express Router**. → `src/routes/product.router.js` (nombre en singular; ver nota de convención más abajo), montado en `app.js:32`.
- [x] `GET /api/products` con `limit` (default 10) y `page` (default 1). → implementado con `mongoose-paginate-v2` (`productoSchema.plugin(mongoosePaginate)` en el modelo, `this.model.paginate(filter, options)` en el dao). Verificado con datos reales: 11 documentos, `limit=10` → 2 páginas.
- [x] `GET /api/products` con `query` (categoría o disponibilidad). → un solo parámetro `req.query.query` (`term`) decide: valores reservados `'available'`/`'unavailable'` filtran por `stock` (`$gte 1` / `$lt 1`); cualquier otro valor no vacío se interpreta como `category`. Decisión de diseño anotada en sección 6.
- [x] `GET /api/products` con `sort` (asc/desc por precio). → `sort.price = 1` / `-1` según `req.query.sort === 'asc'/'desc'`, pasado como `options.sort` a `.paginate()`.
- [x] Formato de respuesta exacto (`status`, `payload`, `totalPages`, `prevPage`, `nextPage`, `page`, `hasPrevPage`, `hasNextPage`, `prevLink`, `nextLink`). → aplanado correctamente (`payload` es `response.docs`, el resto de las claves de paginación al mismo nivel que `status`) y `prevLink`/`nextLink` ya se calculan con la función auxiliar `buildLink(baseUrl, currentParams, targetPage)` (usa `URLSearchParams` sobre `req.query` para conservar `limit`/`query`/`sort` al cambiar de página, y devuelve `null` cuando no hay página destino).
- [x] `GET /api/products/:pid`. → funcionando con manejo de casos borde: `200` (encontrado), `404` (id válido pero inexistente), `400` (`CastError`, formato de id inválido), `500` (otro error). Usa `:id` como nombre de parámetro en vez de `:pid` (ver nota de convención).
- [x] `POST /api/products` con ID autogenerado. → valida campos obligatorios (`code`, `title`, `price`) y tipos de `price`/`stock`, maneja `E11000` (código duplicado) y `ValidationError`. El ID lo autogenera Mongo (`_id`), no se toca a mano.
- [x] `PUT /api/products/:pid` sin permitir modificar el ID. → el controller borra explícitamente `_id`, `id` y `code` del body antes de actualizar (`producto.controller.js:110-112`), así que el ID (y el código) nunca cambian vía este endpoint. Ruta cambiada de `PATCH` a `PUT` en el último commit (`7bf0c35`), como pide la consigna.
- [x] `DELETE /api/products/:pid`. → devuelve 404 si no existe, 400 si el id tiene formato inválido, 200 con el producto borrado si sale bien.

**Nota de convención:** `product.router.js` quedó en singular, mientras que el router de vistas es `views.router.js` (plural). Igual que `product.model.js`/`product.dao.js`, que ya están en singular — conviene mantener singular para el router de carritos también (`cart.router.js`) por consistencia.

### Fase 3 — API de carritos

> Estado (11/08/2026): **los 7 endpoints completos y commiteables.** `src/models/cart.model.js`, `src/dao/cart.dao.js`, `src/controllers/cart.controller.js` y `src/routes/cart.router.js` existen, montados en `app.js` bajo `/api/carts`.

- [x] Router de `/api/carts` con **Express Router**. → `src/routes/cart.router.js`, montado en `app.js` (faltaba el `app.use('/api/carts', ...)`, se agregó en esta sesión).
- [x] `POST /api/carts` con ID autogenerado. → `CartController.create` crea el carrito con `products: []`; el ID lo autogenera Mongo (`_id`).
- [x] `GET /api/carts/:cid` con **`populate`**. → `CartDao.getPopulatedById` usa `.populate('products.product')`. Separado a propósito de `CartDao.getById` (sin popular), que se usa solo para la lógica interna de los demás métodos.
- [x] `POST /api/carts/:cid/products/:pid` (incrementa cantidad si ya existe). → `CartController.addProduct` busca con `findIndex` sobre el carrito **sin poblar**, incrementa `quantity` si ya está o hace `push` si no.
- [x] `DELETE /api/carts/:cid/products/:pid`. → `CartController.removeProduct`, filtra el array `products` excluyendo el `pid` pedido.
- [x] `PUT /api/carts/:cid` (actualiza todos los productos). → `CartController.updateCart`, reemplaza `cart.products` completo con el array recibido en el body (valida que sea array).
- [x] `PUT /api/carts/:cid/products/:pid` (solo cantidad). → `CartController.updateProductQuantity`. Nota: la validación de `quantity` cubre `undefined` y negativos, pero no un string no numérico (p. ej. `"tres"`) — pendiente de reforzar con un chequeo de `typeof`, no bloqueante.
- [x] `DELETE /api/carts/:cid` (vaciar carrito). → `CartController.clearCart`, `cart.products = []`.

### Fase 4 — Vistas

- [x] Motor de vistas configurado y capa de rutas de vistas separada de la API. → `express-handlebars` en `src/app.js:17-19`, layout `main.handlebars`, rutas en `src/routes/views.router.js`. (La separación todavía es trivial: no hay API con la cual mezclarse.)
- [~] `/products` — listado con paginación funcionando (navegación entre páginas). → la ruta renderiza un **array hardcodeado de 2 juegos** (`views.router.js:13-28`). La vista `products.handlebars` ya tiene el marcado de paginación (`hasPrevPage`, `prevLink`, `page`, `totalPages`), pero el router **no le pasa ninguna de esas variables**, así que los controles nunca se muestran.
- [ ] `/products/:pid` — detalle del producto con opción de agregar al carrito. → la vista linkea a `/products/{{_id}}` pero **esa ruta no existe**: el link da 404. El botón "Agregar al carrito" es un placeholder con SweetAlert.
- [ ] `/carts/:cid` — visualización del carrito con sus productos. → la vista `cart.handlebars` existe y ya está escrita esperando `products[].product` + `quantity` (compatible con `populate`), pero **ninguna ruta la renderiza**. El navbar apunta al literal `/carts/TU_ID_DE_CARRITO_AQUI`.

### Fase 5 — Tiempo real (WebSockets)

- [~] WebSockets integrados al servidor. → `socket.io` server montado sobre el servidor HTTP (`app.js:33-37`) y cliente cargado en el layout + `src/public/index.js`. Hoy solo hace el handshake y emite un `'saludo'` de prueba que el cliente ni siquiera escucha.
- [ ] Los cambios en productos se reflejan automáticamente en la vista sin recargar.
- [ ] Evidencia grabada del comportamiento en tiempo real (GIF o video).

### Fase 6 — Calidad de código y entrega

- [~] **Middlewares** en uso (al menos los propios del proyecto, más el manejo de errores). → están `express.json`, `express.urlencoded` y `express.static`; **falta el middleware de manejo de errores** y cualquier middleware propio.
- [ ] Toda la asincronía con `async`/`await` y con manejo de errores.
- [ ] Manejo básico de errores consistente (status HTTP coherentes, mensajes claros, IDs inválidos o inexistentes).
- [ ] Código modular: sin lógica de negocio dentro de los routers, sin duplicación evidente.
- [ ] Limpieza final: archivos muertos, `console.log` de debug, credenciales fuera del código.
- [ ] Colección de requests de prueba (Postman/Thunder Client) con capturas de request y response para cada endpoint.
- [ ] Capturas de la base de datos (colecciones y documentos) y de la estructura de carpetas.
- [ ] Google Slides armado con las **10 secciones** pedidas (ver requisito 32).
- [ ] Slides publicado con **URL pública** verificada (abrir en ventana privada para confirmar el acceso).
- [ ] Link al repositorio incluido en el Slides.
- [ ] Cierre escrito: dificultades, soluciones y mejoras futuras.

---

## 6. Notas y decisiones

### Restricciones fijadas por la consigna (no negociables)

- Stack obligatorio: **Node.js + Express + MongoDB + Mongoose**.
- Puerto del servidor: **8080**.
- Base de datos: **`ecommerce`**; colecciones **`products`** y **`carts`**.
- Carpetas obligatorias: **`dao`** y **`models`**.
- La implementación previa con **FileSystem no se elimina**.
- El formato de respuesta de `GET /api/products` está **dado literalmente** por la consigna: no se cambian los nombres de las claves.
- `GET /api/carts/:cid` debe usar **`populate`** (esto condiciona el modelado del carrito: guarda referencias, no copias del producto).
- La entrega es un **Google Slides público**; el repo es respaldo, no lo evaluado directamente.

### Decisiones ya tomadas (deducidas del código, confirmadas el 04/08/2026)

- **Motor de plantillas:** `express-handlebars` v8, con layout `main.handlebars` y vistas en `src/views/`.
- **Librería de WebSockets:** `socket.io` v4, montado sobre el servidor que devuelve `app.listen()`.
- **Módulos ES:** `"type": "module"` en `package.json` → se usa `import`/`export`, no `require`.
- **Arranque:** `npm run dev` con nodemon sobre `src/app.js`.
- **Convención de commits:** prefijos tipo Conventional Commits (`feat:`, `chore:`), ya usados de forma consistente.
- **Temática (implícita):** catálogo de videojuegos de PlayStation 2.
- **Versiones del stack (04/08/2026):** se baja a **Express 4 + Mongoose 8**, para alinearse con el material del curso y garantizar la compatibilidad de `mongoose-paginate-v2`. Ver hallazgo 6.
- **Datos semilla:** se reutiliza `CODER/CoderJavaScript/data/juegos.json` (10 juegos de PS2), mapeando los campos del español a los nombres que exige la consigna. Ver hallazgo 3.
- **FileSystem:** no existía; se escribe desde cero como implementación paralela a conservar (requisito 20).
- **URI de Mongo: local, no Atlas** (decidido el 10/08/2026). El `mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')` de `app.js` queda como está. Sigue pendiente sacar la URI hardcodeada del código a `.env` (con `dotenv` o `--env-file` de Node) antes de sacar capturas del código para el Slides, y agregar `.env` al `.gitignore` (hallazgo 12).
- **Arquitectura de capas: router → controller → dao → modelo** (decidido el 10/08/2026, 3 capas). El router solo define método + ruta y apunta a una función del controller; el controller lee `req`/`res` (params, query, body), llama al dao, decide status codes y arma la respuesta; el dao es el único que importa los modelos de Mongoose y habla con la base. Falta crear la carpeta `src/controllers/` (no existe todavía) y aplicar este esquema tanto a `/api/products`/`/api/carts` como, más adelante, a `views.router.js`.
- **Paginación: `mongoose-paginate-v2`, no `skip`/`limit` a mano** (decidido el 11/08/2026). El schema de producto tiene `productoSchema.plugin(mongoosePaginate)` y el dao llama `this.model.paginate(filter, options)`. `prevLink`/`nextLink` los arma la función auxiliar `buildLink()` en `producto.controller.js` con `URLSearchParams` sobre `req.query`, para no perder los demás params al cambiar de página.
- **Filtro `query` de `GET /api/products`: valores reservados, no un segundo parámetro** (decidido el 11/08/2026). Un único `req.query.query` decide el campo a filtrar: `'available'`/`'unavailable'` filtran por `stock` (`$gte 1` / `$lt 1`); cualquier otro valor no vacío se trata como `category`. Se eligió este camino (frente a comparar contra `distinct('category')` en la base) por ser mucho menos código para el volumen de datos del proyecto (10-20 productos). Documentar en el Slides qué valores exactos aceptás para "disponible"/"no disponible" al mostrar las capturas.

### Decisiones pendientes (a resolver con Juan Carlos, no asumir)

- [ ] **Nombre comercial, problema que resuelve y público objetivo** del e-commerce — la temática está clara (juegos de PS2), la definición para la slide 1 no.
- [ ] **Cómo convive FileSystem con MongoDB** (dos DAOs seleccionables, o FileSystem conservado como implementación histórica) — pendiente, y además hay que **recuperar** esa implementación (hallazgo 3).
- [ ] **Convenciones de respuestas de error** (forma del JSON de error, códigos HTTP por caso) — a documentar acá cuando se decidan.

---

## 7. Auditoría del repositorio (04/08/2026)

### Estructura actual (11/08/2026)

```
CoderBackend1/
├─ .gitignore              (solo node_modules; falta .env)
├─ CLAUDE.md
├─ README.md
├─ package.json            (dependencias limpias; falta script "start")
└─ src/
   ├─ app.js               servidor + handlebars + mongoose.connect + socket.io, todo junto
   ├─ controllers/
   │  ├─ producto.controller.js   ProductoController: getAll/getById/create/update/delete
   │  └─ cart.controller.js       CartController: create/getAll/getById/addProduct
   ├─ dao/
   │  ├─ product.dao.js           ProductoDao: getAll/getById/create/delete/update
   │  └─ cart.dao.js              CartDao: create/getAll/getById/getPopulatedById/update
   ├─ models/
   │  ├─ product.model.js         esquema de producto (commiteado)
   │  └─ cart.model.js            esquema de carrito, products[].product con ref: 'Product'
   ├─ routes/
   │  ├─ product.router.js        /api/products (GET, GET /:id, POST, PUT /:id, DELETE /:id)
   │  ├─ cart.router.js           /api/carts, los 7 endpoints de la consigna
   │  └─ views.router.js          GET / y GET /products (datos hardcodeados)
   ├─ public/
   │  ├─ index.js          solo `const socket = io()` + placeholder de agregar al carrito
   │  ├─ css/styles.css
   │  └─ assets/logo.png
   └─ views/
      ├─ layouts/main.handlebars
      ├─ home.handlebars
      ├─ products.handlebars
      └─ cart.handlebars   (sin ruta que la renderice)
```

**Todavía no existe:** la implementación FileSystem, `.env`, vistas conectadas a datos reales, ni WebSockets funcionales más allá del saludo de prueba.

### Hallazgos, ordenados por impacto en la nota

1. ~~**Persistencia arrancó, pero sin commitear.**~~ **RESUELTO.** `mongoose.connect(...)` y `product.model.js` están commiteados y probados de punta a punta con el CRUD de productos. Pendiente dentro de este mismo hallazgo: falta el modelo de **carrito** (no existe) y la capa `dao`/`controller` de carrito (carpetas existen pero solo tienen los archivos de producto).
2. ~~**La API de productos está completa; la de carritos arrancó pero le faltan endpoints.**~~ **RESUELTO.** Los 21 endpoints de la consigna (productos + carritos) están implementados y funcionando, con manejo de errores razonable en ambos controllers. Lo que queda de este bloque no es funcionalidad nueva, sino pulido: reforzar la validación de `quantity` en `updateProductQuantity` (no rechaza strings no numéricos) y sacar evidencia/capturas de cada endpoint para el Slides.
3. **La implementación previa con FileSystem NO EXISTE (requisito 20).** Verificado el 04/08/2026: el "otro proyecto" del commit `95eb629` es `CODER/CoderJavaScript`, que es el **proyecto de frontend** del curso de JavaScript — HTML + CSS + `js/main.js` de navegador, con persistencia en `localStorage`. No tiene Node, ni `require`, ni `fs`, ni Express. De ahí salieron las vistas, el CSS y el logo, nada más. Tampoco hay ningún `ProductManager`/`CartManager` en el resto del disco ni en otra rama. **Conclusión: el `ProductManager` con `fs` hay que escribirlo desde cero.**
   - **Dato aprovechable:** `CoderJavaScript/data/juegos.json` tiene **10 juegos de PS2** con `id`, `titulo`, `categorias`, `precio`, `stock`, `descripcion`, `desarrollador`, `año_lanzamiento`, `imagen_url`. Categorías: Mundo Abierto, Horror, Aventura, Acción, Sigilo, RPG, Carreras. Sirve como semilla tanto para el FileSystem como para la colección `products`, **pero los nombres de campo están en español y no coinciden con los que exige la consigna** — hay que mapearlos (`titulo`→`title`, `precio`→`price`, `imagen_url`→`thumbnails` como *array*, `categorias`→`category`, `id`→`code`) y **falta `status`**. Son 10 documentos: para que la paginación con `limit=10` se note en las capturas conviene llegar a 15-20.
4. ~~**Dependencias basura en `package.json`.**~~ **RESUELTO.** Ya no están `paginate`/`v2`; queda solo `mongoose-paginate-v2` (todavía sin usar en código) y `nodemon` pasó a `devDependencies`. Sigue faltando el script `start` (solo existe `dev`).
5. ~~**`src/model/` debería llamarse `models/`**~~ **RESUELTO.** Ahora es `src/models/` (plural, como pide la consigna) y ya tiene `product.model.js` adentro. Pendiente: commitear (hoy figura como carpeta sin trackear) y sumar el modelo de carrito. `src/dao/` sigue vacía y sin versionar.
6. **Versiones muy nuevas del stack.** ~~Express **5.2** y Mongoose **9**~~ — **DECIDIDO el 04/08/2026: se baja a Express 4 + Mongoose 8** para alinearse con el material del curso y con `mongoose-paginate-v2`, que no declara compatibilidad con Mongoose 9 y es central para el endpoint que vale el 50%. Si en algún momento se vuelve a Express 5, tener presente: los comodines de ruta cambian (`*` ya no es válido, va `/*splat`), `req.query` pasa a ser un getter de solo lectura, `req.param()` desaparece, y los errores de un handler `async` que rechaza **sí** llegan solos al middleware de errores (en Express 4 hay que capturarlos y pasarlos a `next`).
7. **Links rotos en las vistas.** `products.handlebars:13` apunta a `/products/{{_id}}` (ruta inexistente → 404) y `main.handlebars:18` apunta al literal `/carts/TU_ID_DE_CARRITO_AQUI`.
8. **Datos de debug visibles.** `code: '200 papa'` se pasa a las vistas, y el footer dice "© 2026 Llego el mono PAPA SRA". Limpiar **antes** de sacar las capturas del Slides.
9. **Todo mezclado en `app.js`.** Config de Express + Handlebars + arranque del servidor + lógica de sockets en un solo archivo, y datos de negocio dentro del router. La rúbrica pide "código modular". Conviene separar arranque, configuración y sockets antes de que crezca.
10. **Rutas relativas al cwd.** `express.static('src/public')` y `app.set('views', './src/views')` funcionan solo si el proceso se arranca desde la raíz del proyecto. Con módulos ES lo robusto es resolver rutas absolutas desde `import.meta.dirname` (Node 20.11+) o `fileURLToPath(import.meta.url)`.
11. **Sin manejo de errores.** Ningún `try/catch` en los handlers, ningún middleware de error de 4 argumentos, ningún caso borde contemplado (ID inválido, producto inexistente).
12. **`.gitignore` no cubre `.env`.** Arreglarlo *antes* de crear el archivo, no después: si se commitea una vez, la credencial queda en el historial.

### Lo que ya está bien y conviene no romper

- El servidor levanta en **8080**, como exige la consigna.
- `cart.handlebars` ya está escrita esperando `{{#each products}}` con `this.product.title` y `this.quantity`: esa forma es **exactamente** la que produce un carrito con `populate`. El modelo del carrito debería respetarla.
- `products.handlebars` ya consume `payload`, `page`, `totalPages`, `hasPrevPage`, `hasNextPage`, `prevLink`, `nextLink`: los mismos nombres del formato de respuesta obligatorio. Buena decisión, mantenerla.
- El historial de commits es prolijo y con mensajes descriptivos.

### Registro de sesiones

- **04/08/2026** — Auditoría inicial del repo y actualización de este documento (secciones 1, 5, 6 y esta). Estado: front maquetado con datos falsos; persistencia y API sin empezar.
- **04/08/2026 (cont.)** — Se verificó que `CoderJavaScript` es el proyecto de **frontend** del curso de JS, no un backend: **la implementación con FileSystem nunca existió** y hay que escribirla. Se rescató `data/juegos.json` como semilla. Decisión tomada: **bajar a Express 4 + Mongoose 8**. Plan de trabajo acordado: (1) limpiar dependencias, (2) downgrade de versiones, (3) escribir `ProductManager` con `fs.promises` sobre los datos semilla.
- **10/08/2026** — Nueva auditoría completa contra el estado real del repo (código + `git status` + `git log`), no solo contra lo que decía este documento. Cambios de código detectados, **todavía sin commitear**: `src/model/` fue reemplazado por `src/models/` (ya en plural) con el primer esquema (`product.model.js`, cubre los 8 campos de la consigna más `developer`/`releaseYear`); `app.js` ya llama a `mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')`. Se corrigieron dos notas desactualizadas de este archivo: el renombre `AGENT.md` → `CLAUDE.md` **sí** está commiteado (`1eca14d`), y no se encontró copia duplicada en `Escritorio\CLAUDE.md`. También se confirmó que `package.json` ya no tiene las dependencias basura (`paginate`, `v2`) y que `nodemon` quedó bien ubicado en `devDependencies`. Sin cambios en la API (sigue sin existir ningún router bajo `/api`), en las vistas (siguen con datos hardcodeados y links rotos) ni en WebSockets (sigue solo el saludo de prueba). Próximo paso sugerido: commitear el modelo y la conexión, verificar que Mongo levanta de verdad, y recién después arrancar la capa `dao` y el router de `/api/products`.
- **11/08/2026** — Auditoría completa del repo (working tree limpio, `git log`, lectura de todos los archivos de `src/`). Desde la última auditoría se completó y commiteó **todo el CRUD de productos**: `create` (`9a44039`), `delete` (`67f3931`), `update` (`b0dca02`, con fix de ruta `PATCH`→`PUT` en `7bf0c35`). El router quedó `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, todo montado en `/api/products`. Sin cambios en: formato de respuesta de `GET /api/products` (sigue sin `limit/page/query/sort` ni las claves de paginación), carritos (nada empezado), vistas (siguen hardcodeadas, links rotos a `/products/:id` y `/carts/TU_ID_DE_CARRITO_AQUI`), WebSockets (solo el saludo de prueba), FileSystem (no existe) y `.env` (no existe, uri sigue hardcodeada en `app.js`). Próximo paso acordado con Juan Carlos: primero cerrar el formato de respuesta de `GET /api/products` (impacto directo en el 50%), después arrancar el modelo/dao/controller/router de carrito.
- **11/08/2026 (cont.)** — Sesión de trabajo guiada (tutor + Juan Carlos escribiendo el código) para cerrar `GET /api/products` del todo. Se implementó y verificó en vivo: `limit`/`page` con `mongoose-paginate-v2` (plugin agregado al schema, `paginate()` en el dao); filtro `query` con valores reservados `'available'`/`'unavailable'` para disponibilidad y cualquier otro valor como `category`; `sort` asc/desc por precio; formato de respuesta aplanado (`payload` = array, resto de claves al mismo nivel); `prevLink`/`nextLink` calculados con una función auxiliar `buildLink()` basada en `URLSearchParams`. En el camino se encontraron y corrigieron en vivo tres bugs propios: variable `result` no declarada (usaba `response`), parámetro de filtro mal nombrado (`category` en vez de `query`) y un intento de refactor que rompía `sort` al reusar el nombre de la variable desestructurada de `req.query`. **`GET /api/products` queda 100% alineado con la consigna.** Próximo paso acordado: arrancar la API de carritos (modelo con `ref` a producto para habilitar `populate`, dao, controller, router).
- **11/08/2026 (cont. 2)** — Juan Carlos escribió el arranque de la API de carritos (`cart.model.js`, `cart.dao.js`, `cart.controller.js`, `cart.router.js`) por su cuenta y pidió revisión. Bugs encontrados y corregidos en el camino: (1) `cart.router.js` nunca se montaba en `app.js` (faltaba el `import` + `app.use('/api/carts', ...)`, mismo patrón que productos); (2) ruta de agregar producto en singular (`/product/:pid`) en vez de plural (`/products/:pid`); (3) `getById` sin `populate`, requisito explícito de la consigna (ítem 11); (4) mensaje de error al revés en el 404 de `getById` ("Carrito encontrado" en el caso de no encontrado); (5) el más sutil: al agregarle `populate` a `getById`, se rompió la comparación de `ObjectId` dentro de `addProduct` (`p.product.toString() === pid` deja de funcionar cuando `p.product` es un documento poblado en vez de un `ObjectId`) — se resolvió separando en dos métodos del dao: `getById` (sin poblar, para lógica interna) y `getPopulatedById` (poblado, para el endpoint público). Quedaron funcionando `POST /api/carts`, `GET /api/carts/:cid` (con `populate`) y `POST /api/carts/:cid/products/:pid` (incrementa cantidad si ya existe).
- **11/08/2026 (cont. 3)** — Juan Carlos implementó los 4 endpoints restantes de carrito (`removeProduct`, `updateCart`, `updateProductQuantity`, `clearCart`) y pidió revisión. Bug crítico encontrado y corregido: en `cart.router.js`, la ruta `PUT /:cid/products/:pid` estaba copy-pasteada apuntando a `CartController.removeProduct` en vez de `updateProductQuantity` — hubiera borrado el producto en vez de actualizar su cantidad. También se reforzó parcialmente la validación de `quantity` (ahora rechaza `undefined`, pero todavía no rechaza strings no numéricos — queda anotado como pendiente menor, no bloqueante). Con esto, **los 21 endpoints de la consigna (productos + carritos) están implementados y commiteables.** Próximo paso acordado: pulir validaciones menores y pasar a conectar las vistas (`/products`, `/products/:pid`, `/carts/:cid`) a los datos reales en vez del array hardcodeado, ya que ahora sí hay una API completa para consumir.
