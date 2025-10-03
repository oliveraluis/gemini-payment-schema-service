# ⚙️ GEMINI API EN ACCIÓN

> "No aceptamos inconsistencias. La auditoría y la validación de pagos ahora son un proceso de **normalización forzada** mediante IA. La varianza es un error de ingeniería, no una realidad del negocio."

**Luis Olivera** | Backend Developer

---

## 1. VISIÓN GENERAL Y ARQUITECTURA DEL MOTOR DE NORMALIZACIÓN

Este proyecto es un sistema **crítico** diseñado para eliminar la variabilidad y el caos de la auditoría de pagos móviles (Yape, Plin, etc.). El núcleo reside en el uso estratégico de **Google Gemini** para transformar datos semiestructurados (imágenes) en una **estructura JSON fuertemente tipada y predecible**.

La solución no *intenta* adivinar; **exige** los datos al imponer un **Schema Enforcement** rígido, asegurando que cada pago se mapee a una única entidad de dominio (`PaymentInfoResponse`).

### Stack Tecnológico Central

| Componente | Tecnología | Rol Técnico |
| :--- | :--- | :--- |
| **Backend Core** | **Java 17+ / Spring Boot** | Gestión de la API, *thread management*, y deserialización. |
| **AI Layer** | **Google Gemini API** | Procesamiento multimodality, **JSON Schema Enforcement**. |
| **API Contract** | **Swagger / OpenAPI** | Única fuente de verdad para el *endpoint* (`POST /api/payments`). |
| **Persistencia** | MongoDB (asumido por `MONGO_URI`) | Almacenamiento del historial de pagos normalizados. |

---

## 2. INGENIERÍA DEL ESQUEMA: LA CLAVE DE LA ROBUSTEZ

La estabilidad del sistema se logra mediante la **definición explícita del *output* JSON deseado**. Esto supera el *OCR* simple y garantiza la interoperabilidad del dato sin lógica de *parsing* condicional.

### Estrategia de Normalización (Schema Enforcement)

1.  **Modelo de Dominio:** La clase `PaymentInfoResponse.java` contiene el método estático `getGeminiSchema()`.
2.  **Schema Generation (Manual):** Este método construye un objeto `Schema` de Google AI Platform, utilizando `Type.OBJECT` y **descripciones detalladas** (`description`) para cada campo. Esta definición actúa como el **prompt técnico final** que guía a Gemini.
3.  **Invocación Robusta:** El servicio invoca a la API de Gemini, pasando la imagen junto al `Schema` forzado. La IA debe devolver un JSON que sea un *match* perfecto de este esquema.
4.  **Deserialización Directa:** El JSON de salida (`response.text`) se deserializa sin validación intermedia a un objeto `PaymentInfoResponse` gracias a la garantía del esquema impuesto.

---

## 3. EL PUNTO DE INGRESO ÚNICO: API V1

La lógica de negocio se expone a través de un solo *endpoint* de alta potencia.

### 🔗 `POST /api/payments`

Este *endpoint* maneja todo el ciclo de vida, desde la ingesta del comprobante hasta la persistencia del dato normalizado.

| Parámetro | Tipo de Entrada | Descripción |
| :--- | :--- | :--- |
| **File** | `multipart/form-data` | La imagen (captura de pantalla) del comprobante de pago. |

**Acceso a Swagger para Detalle del Contrato:**
🔗 `http://localhost:8080/swagger-ui.html`

---

## 4. INICIO RÁPIDO (SETUP TÉCNICO)

### Requisitos

* Java 17+, Maven.
* Una clave API de Google Gemini activa y con presupuesto.

### ⚠️ Variables de Entorno Críticas (SETUP OBLIGATORIO)

El proyecto **NO LEVANTARÁ** sin las siguientes variables de entorno definidas en el shell o en el archivo `application.properties` de Spring Boot:

| Variable | Propósito | Ejemplo de Valor |
| :--- | :--- | :--- |
| **`MONGO_URI`** | URI de conexión a la base de datos MongoDB. | `mongodb://user:pass@host:port/dbname` |
| **`GEMINI_API_KEY`** | Clave de autenticación para la API de Google Gemini. | `AIzaSy...` |
| **`GEMINI_MODEL`** | Nombre del modelo a utilizar para el procesamiento. **Recomendado:** `gemini-2.5-flash`. | `gemini-2.5-flash` |

### Pasos

1.  **Clonar:** `git clone [URL]`
2.  **Configurar Entorno:** Define las tres variables listadas arriba en tu entorno o en el archivo de configuración de Spring.
3.  **Ejecutar:** ```bash
    ./mvnw clean install
    ./mvnw spring-boot:run
    ```

La aplicación estará activa en `http://localhost:8080`, lista para recibir *requests* en `/api/payments`.
