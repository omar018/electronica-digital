# Simulador de Arquitectura Digital (16 Bits) ⚡

Aplicación web interactiva desarrollada para la asignatura de **Electrónica Digital / Arquitectura de Computadores** de la **Universidad Nacional de Colombia**, basada en la propuesta académica del profesor **Amado Ospina Montoya**.

Implementa y visualiza paso a paso los siguientes algoritmos a nivel de hardware/arquitectura (hasta números de 16 bits):

1. **Double Dabble (Binario a BCD):** Algoritmo Shift-and-Add-3 para conversión rápida sin divisiones.
2. **Double Dabble Inverso (BCD a Binario):** Algoritmo Shift-and-Subtract-3 para decodificación BCD hacia binario puro.
3. **Multiplicación de Booth:**
   - **Con Signo:** Algoritmo clásico en complemento a dos con evaluación de $(Q_0, Q_{-1})$ y desplazamiento aritmético.
   - **Sin Signo:** Algoritmo con evaluación de $Q_0$ y desplazamiento lógico con acarreo ($C_f$).
4. **División Binaria:**
   - **Con Restauración (Restoring Division):** Desplazamiento a la izquierda, resta del divisor y prueba de signo con restauración si $A < 0$.
   - **Sin Restauración (Non-Restoring Division):** Optimización sin ciclos de restauración intermedios.

---

## 🚀 Características Principales

- **Entrada Dual:** Permite ingresar los valores tanto en **Decimal** como en **Binario** (usando el prefijo `b`, por ejemplo `b1011` o `142`).
- **Visualización Completa:** Muestra simultáneamente los valores en Decimal, Binario (16/32 bits) y BCD.
- **Trazabilidad y Paso a Paso Interactivo:** 
  - Reproductor con controles de **Play / Pausa**, paso anterior, siguiente y ajuste de velocidad.
  - Tabla de iteraciones completa con registros ($A$, $Q$, $M$, $Q_{-1}$, $C_f$) idéntica a la explicada en las clases y vídeos del curso.
  - Botón de **Copiar Tabla** para pegar directamente en informes o reportes de laboratorio.
- **Ejemplos Rápidos:** Botones de acceso directo a los ejercicios explicados en los vídeos del profesor (ej. $142$, $23 \times 3$, $11 \times -7$, $142 \div 5$).

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Herramienta de Construcción:** Vite
- **Despliegue:** Optimizado para Vercel (100% Client-Side, cero servidores externos).

---

## 💻 Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Despliegue en Vercel

### Opción 1: Vía GitHub
1. Sube este proyecto a tu cuenta de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: simulador de algoritmos de 16 bits para electronica digital"
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New Project"** e importa tu repositorio de GitHub.
4. Vercel detectará automáticamente que es un proyecto **Vite**. Haz clic en **"Deploy"** y listo.

### Opción 2: Vía Vercel CLI
```bash
npx vercel
```
Sigue las instrucciones en consola y la aplicación quedará publicada en un subdominio `.vercel.app`.

---

## 👨‍🏫 Autor & Curso
- **Institución:** Universidad Nacional de Colombia - Sede Medellín
- **Facultad:** Facultad de Minas
- **Docente de Teoría:** Ing. Daniel González Montoya
- **Docente de Práctica / Laboratorio:** Ing. Amado Ospina Montoya
- **Asignatura:** Electrónica Digital / Arquitectura de Computadores
