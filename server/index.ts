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
  // ROTAS DA API
  // ============================================

  // Rota para receber logs (evita erro 404)
  app.post("/logs", (req, res) => {
    // Apenas aceita o log, não faz nada com ele
    console.log("Log recebido:", req.body);
    res.json({ success: true });
  });

  app.post("/__manus__/logs", (req, res) => {
    console.log("Manus log recebido");
    res.json({ success: true });
  });

  // Rota para dados dos calouros (ajuste conforme necessário)
  app.get("/api/dados", (_req, res) => {
    try {
      const dataPath = path.resolve(__dirname, "..", "client", "src", "data.json");
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        res.json(data);
      } else {
        // Dados de exemplo
        res.json({
          calouros: [
            { id: 1, nome: "João Silva", curso: "Engenharia", nota: 85, frequencia: 90 },
            { id: 2, nome: "Maria Santos", curso: "Medicina", nota: 92, frequencia: 95 },
            { id: 3, nome: "Pedro Oliveira", curso: "Direito", nota: 78, frequencia: 85 }
          ],
          estatisticas: {
            totalCalouros: 150,
            mediaNotas: 84.5,
            taxaAprovacao: 78,
            cursos: 12
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao carregar dados" });
    }
  });

  // Rota para estatísticas
  app.get("/api/estatisticas", (_req, res) => {
    res.json({
      total: 150,
      media: 84.5,
      aprovados: 117,
      reprovados: 33
    });
  });

  // Rota de teste
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Rota coringa para qualquer /api/*
  app.get("/api/*", (req, res) => {
    res.json({ 
      message: "API endpoint", 
      path: req.path,
      status: "ok" 
    });
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
    console.log(`API health: http://localhost:${port}/api/health`);
  });
}

startServer().catch(console.error);