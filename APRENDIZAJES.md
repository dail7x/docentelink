# 🧠 DocenteLink - Aprendizajes y Guía de Estilo

Este documento centraliza las decisiones técnicas, configuraciones críticas y flujos de trabajo del proyecto para evitar errores recurrentes.

## 🤖 Inteligencia Artificial (Gemini)

### Configuración del Modelo
*   **Modelo Actual**: `gemini-2.5-flash`
*   **Razón**: Es el modelo que ha demostrado mayor estabilidad y compatibilidad con el endpoint `v1beta` y la cuota del proyecto. **NO cambiar a otras versiones** (Flash 1.5, Flash 8b, Pro) sin validación previa, ya que reportan errores 404 o límites de cuota (Quota 0).

### Reglas de Extracción (Parser)
*   **Literalidad**: El prompt debe exigir estrictamente la extracción literal de datos. No permitir que la IA "adapte" puestos de otros rubros (ej. IT) al entorno docente.
*   **Categorización**: 
    *   `formacion`: Solo títulos formales (grado, terciario, profesorado) con año de egreso.
    *   `cursos`: Talleres, capacitaciones y diplomas sin fecha formal o de instituciones no universitarias.

---

## 🛠️ Flujo de Trabajo (Git)

### Ramas y Commits
*   **Branch Principal de Trabajo**: `develop`
*   **Merge a `main`**: Solo después de validar cambios en `develop`. 
*   **Comando de Commit**: `git push origin develop` (Evitar `main` para desarrollo activo).

---

## 🎨 Experiencia de Usuario (Wizard)

### Datos Personales (Step 1)
*   **Slug (Link Único)**: Debe incluir el prefijo `docentelink.ar/cv/` integrado visualmente y mostrar feedback de disponibilidad en tiempo real. 
*   **Validaciones**:
    *   **Nombres**: Formato CamelCase automático. Bloquear números.
    *   **Teléfonos**: Solo números y caracteres telefónicos (`+`, `-`, espacios).
    *   **Slug**: Limpieza automática de caracteres (reemplazar puntos y espacios por guiones).

### Persistencia
*   **Autosave**: Se debe realizar un guardado silencioso en la base de datos cada vez que el usuario hace click en "Siguiente", para evitar pérdida de datos si abandona el wizard.
*   **Edición**: Al entrar en modo `?edit=true`, el wizard debe saltar el paso de carga de PDF y precargar todos los datos (incluyendo la foto) desde la BD.

---

## 📁 Archivos Críticos
*   `/src/app/api/parse-cv/route.ts`: Configuración de Gemini y Prompts.
*   `/src/components/wizard/StepPersonal.tsx`: Lógica de validación y diseño del slug.
*   `/src/app/actions/cv.ts`: Acción de guardado principal (maneja `isAutosave`).
*   `/src/app/actions/get-cv.ts`: Mapeo de datos para edición.
