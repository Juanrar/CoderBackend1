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

- **Temática / nombre del proyecto:** _(a definir — confirmar con Juan Carlos el nombre, el problema que resuelve y el público objetivo, que la presentación pide explícitamente)_
- **Repositorio:** _(a completar — URL de GitHub)_
- **Entregable final:** Google Slides con URL pública _(a completar)_
- **Estado:** el proyecto arranca desde la base construida durante la cursada (implementación previa con FileSystem, que **no se elimina**).

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

### Fase 0 — Definición y setup

- [ ] Confirmar nombre del proyecto, problema que resuelve y público objetivo (lo pide la sección 1 del Slides).
- [ ] Repo de GitHub creado/actualizado, rama principal definida, commits claros.
- [ ] `.gitignore` con `node_modules` y variables de entorno.
- [ ] `package.json` con dependencias y scripts de arranque.
- [ ] Servidor Express levantando en el **puerto 8080**.
- [ ] Estructura de carpetas definida, incluyendo **`dao`** y **`models`**.
- [ ] Conexión a MongoDB (base **`ecommerce`**) verificada.
- [ ] Decidir dónde vive la implementación previa de **FileSystem** para conservarla sin romper la nueva.

### Fase 1 — Modelado y persistencia

- [ ] Modelo de **producto** en Mongoose con los campos exigidos (`title`, `description`, `code`, `price`, `status`, `stock`, `category`, `thumbnails`).
- [ ] Modelo de **carrito** en Mongoose, con referencia a productos que habilite `populate`.
- [ ] Colecciones `products` y `carts` creadas y con datos de prueba.
- [ ] Capa **`dao`** implementada (acceso a datos separado de la lógica de rutas).
- [ ] Implementación de FileSystem conservada y funcional/documentada.

### Fase 2 — API de productos

- [ ] Router de `/api/products` con **Express Router**.
- [ ] `GET /api/products` con `limit` (default 10) y `page` (default 1).
- [ ] `GET /api/products` con `query` (categoría o disponibilidad).
- [ ] `GET /api/products` con `sort` (asc/desc por precio).
- [ ] Formato de respuesta exacto (`status`, `payload`, `totalPages`, `prevPage`, `nextPage`, `page`, `hasPrevPage`, `hasNextPage`, `prevLink`, `nextLink`).
- [ ] `GET /api/products/:pid`.
- [ ] `POST /api/products` con ID autogenerado.
- [ ] `PUT /api/products/:pid` sin permitir modificar el ID.
- [ ] `DELETE /api/products/:pid`.

### Fase 3 — API de carritos

- [ ] Router de `/api/carts` con **Express Router**.
- [ ] `POST /api/carts` con ID autogenerado.
- [ ] `GET /api/carts/:cid` con **`populate`**.
- [ ] `POST /api/carts/:cid/products/:pid` (incrementa cantidad si ya existe).
- [ ] `DELETE /api/carts/:cid/products/:pid`.
- [ ] `PUT /api/carts/:cid` (actualiza todos los productos).
- [ ] `PUT /api/carts/:cid/products/:pid` (solo cantidad).
- [ ] `DELETE /api/carts/:cid` (vaciar carrito).

### Fase 4 — Vistas

- [ ] Motor de vistas configurado y capa de rutas de vistas separada de la API.
- [ ] `/products` — listado con paginación funcionando (navegación entre páginas).
- [ ] `/products/:pid` — detalle del producto con opción de agregar al carrito.
- [ ] `/carts/:cid` — visualización del carrito con sus productos.

### Fase 5 — Tiempo real (WebSockets)

- [ ] WebSockets integrados al servidor.
- [ ] Los cambios en productos se reflejan automáticamente en la vista sin recargar.
- [ ] Evidencia grabada del comportamiento en tiempo real (GIF o video).

### Fase 6 — Calidad de código y entrega

- [ ] **Middlewares** en uso (al menos los propios del proyecto, más el manejo de errores).
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

### Decisiones pendientes (a resolver con Juan Carlos, no asumir)

- [ ] **Nombre y temática concreta del e-commerce** (rubro, catálogo, público objetivo) — pendiente.
- [ ] **Motor de plantillas para las vistas**: la consigna exige las vistas pero **no especifica cuál usar** — pendiente de definir.
- [ ] **Librería de WebSockets**: la consigna pide "WebSockets" sin nombrar una implementación — pendiente de definir.
- [ ] **Estrategia de paginación**: la consigna define el formato de salida pero no cómo producirlo (query manual vs. librería de paginación) — pendiente de definir.
- [ ] **Arquitectura de capas**: la consigna menciona `dao` y `models` y habla de "controllers" en el Slides; el reparto exacto de responsabilidades (router / controller / service / dao) queda por definir.
- [ ] **Cómo convive FileSystem con MongoDB** (dos DAOs seleccionables, o FileSystem conservado como implementación histórica) — pendiente de definir.
- [ ] **Convenciones de código** (nomenclatura, formato de respuestas de error, estructura de commits) — a documentar acá cuando se decidan.

### Registro de sesiones

_(vacío — se completa a medida que Juan Carlos avance)_
