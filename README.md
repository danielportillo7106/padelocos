# 🎾 Padelocos App - Gestión de Torneos Premium

¡Bienvenido al sistema definitivo para gestionar tus retas de pádel! 
Padelocos es una aplicación web moderna diseñada para administrar jugadores, armar canchas de manera dinámica y coronar al rey de la pista con crónicas generadas por Inteligencia Artificial.

## ✨ Características Principales

* 📝 **Gestión de Plantilla:** CRUD completo para fichar nuevos talentos o dar de baja jugadores, con sincronización en tiempo real.
* 🏟️ **Draft Automático:** Sistema inteligente de rotación para asignar jugadores a las canchas disponibles.
* 🏆 **Podio Neón:** Visualización de resultados finales con un diseño inmersivo y medallas destacadas.
* 🤖 **Crónicas con IA:** Integración directa con **Google Gemini** para generar resúmenes deportivos épicos y exagerados de los ganadores, listos para compartir en WhatsApp.

## 🛠️ Stack Tecnológico

* **Frontend:** React (Vite)
* **Estilos:** CSS3 (Glassmorphism & Neon UI)
* **Base de Datos & Auth:** Supabase
* **Inteligencia Artificial:** Google Gemini API (gemini-2.5-flash)

## 🚀 Cómo correr el proyecto en local

1. Clona este repositorio:
   \`\`\`bash
   git clone https://github.com/danielportillo7106/padelocos-app.git
   \`\`\`
2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Configura tus variables de entorno creando un archivo `.env` en la raíz con lo siguiente:
   \`\`\`env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_llave_de_supabase
   VITE_GEMINI_API_KEY=tu_llave_de_google_gemini
   \`\`\`
4. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

---
*Desarrollado con pasión, mucho café y voleas en la red.* 👑🔥
