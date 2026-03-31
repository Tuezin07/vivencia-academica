import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware para parsear JSON
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ============================================
  // ROTAS DA API - Coloque todas as suas rotas aqui
  // ============================================

  // Exemplo: Rota para dados dos calouros
  app.get("/api/dados", (_req, res) => {
    try {
      // Tenta ler o arquivo data.json se existir
      const dataPath = path.resolve(__dirname, "..", "client", "src", "data.json");
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        res.json(data);
      } else {
        // Dados de exemplo caso não exista o arquivo
        res.json({
          message: "Dados carregados com sucesso!",
          data: {
            calouros: 150,
            cursos: 12,
            eventos: 8
          }
        });
      }
    } catch (error) {
      console.error("Erro ao ler dados:", error);
      res.status(500).json({ error: "Erro ao carregar dados" });
    }
  });

  // Rota de teste para verificar se a API está funcionando
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============================================
  // FIM DAS ROTAS DA API
  // ============================================

  // Handle client-side routing - serve index.html for all other routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`API health check: http://localhost:${port}/api/health`);
  });
}

startServer().catch(console.error);