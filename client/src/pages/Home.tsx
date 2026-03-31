import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, BookOpen, Heart, Clock, TrendingUp, Zap } from "lucide-react";

interface StatsData {
  idade: Record<string, number>;
  genero: Record<string, number>;
  primeira_opcao: Record<string, number>;
  adaptacao: Record<string, number>;
  dificuldade: Record<string, number>;
  acompanhamento: Record<string, number>;
  maior_dificuldade: Record<string, number>;
  relacionamento: Record<string, number>;
  motivacao: Record<string, number>;
  organizacao_tempo: Record<string, number>;
  horas_estudo: Record<string, number>;
  total_respostas: number;
}

const COLORS = [
  "oklch(0.75 0.12 35)",   // Coral
  "oklch(0.7 0.08 250)",   // Blue
  "oklch(0.8 0.08 160)",   // Mint
  "oklch(0.75 0.1 280)",   // Lavender
  "oklch(0.78 0.1 70)",    // Peach
];

export default function Home() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/src/data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Erro ao carregar dados</p>
      </div>
    );
  }

  // Converter dados para formato de gráfico
  const idadeData = Object.entries(data.idade).map(([key, value]) => ({
    name: key,
    value,
  }));

  const generoData = Object.entries(data.genero).map(([key, value]) => ({
    name: key,
    value,
  }));

  const adaptacaoData = Object.entries(data.adaptacao).map(([key, value]) => ({
    name: key,
    value,
  }));

  const dificuldadeData = Object.entries(data.dificuldade).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const acompanhamentoData = Object.entries(data.acompanhamento).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const maiorDificuldadeData = Object.entries(data.maior_dificuldade)
    .map(([key, value]) => ({
      name: key,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const relacionamentoData = Object.entries(data.relacionamento).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const motivacaoData = Object.entries(data.motivacao).map(([key, value]) => ({
    name: key,
    value,
  }));

  const organizacaoTempoData = Object.entries(data.organizacao_tempo).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const horasEstudoData = Object.entries(data.horas_estudo)
    .map(([key, value]) => ({
      name: key,
      value,
    }))
    .sort((a, b) => {
      const order = [
        "Não estudo fora da aula",
        "Até 1 hora",
        "1-2 horas",
        "Mais de 2 horas",
      ];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Calcular porcentagens
  const primeiraOpcaoSim = data.primeira_opcao["Sim"] || 0;
  const primeiraOpcaoNao = data.primeira_opcao["Não"] || 0;
  const primeiraOpcaoPercentual = Math.round(
    (primeiraOpcaoSim / data.total_respostas) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663143351849/mXFXKW6UkGefqJ5XbgWbYB/hero-calouros-TzP2rvWUDx4KzreTZjFH3x.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Vivência Acadêmica
          </h1>
          <p className="text-xl text-muted-foreground">
            Análise da adaptação e experiências dos calouros
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {data.total_respostas} respostas coletadas
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="neomorph-card p-6 flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Total de Respostas</p>
            <p className="stat-number">{data.total_respostas}</p>
          </div>

          <div className="neomorph-card p-6 flex flex-col items-center text-center">
            <TrendingUp className="w-8 h-8 text-secondary mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Primeira Opção</p>
            <p className="stat-number">{primeiraOpcaoPercentual}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {primeiraOpcaoSim} alunos
            </p>
          </div>

          <div className="neomorph-card p-6 flex flex-col items-center text-center">
            <Heart className="w-8 h-8 text-accent mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Motivação Positiva</p>
            <p className="stat-number">
              {Math.round(
                (((data.motivacao["Motivado"] || 0) +
                  (data.motivacao["Muito motivado"] || 0)) /
                  data.total_respostas) *
                  100
              )}
              %
            </p>
          </div>

          <div className="neomorph-card p-6 flex flex-col items-center text-center">
            <Zap className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Acompanhamento</p>
            <p className="stat-number">
              {Math.round(
                (((data.acompanhamento["Sim, totalmente"] || 0) +
                  (data.acompanhamento["Na maioria das vezes"] || 0)) /
                  data.total_respostas) *
                  100
              )}
              %
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Idade */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Distribuição de Idade
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={idadeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {idadeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gênero */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Distribuição de Gênero
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.7 0.08 250)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Adaptação */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Adaptação à Faculdade
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adaptacaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.8 0.08 160)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dificuldade das Matérias */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Nível de Dificuldade das Matérias
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dificuldadeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dificuldadeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Acompanhamento das Aulas */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Acompanhamento das Aulas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={acompanhamentoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.75 0.12 35)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Maior Dificuldade */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Maiores Dificuldades
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maiorDificuldadeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.75 0.1 280)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Relacionamento com Colegas */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary" />
              Relacionamento com Colegas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={relacionamentoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {relacionamentoData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Motivação */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Nível de Motivação
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={motivacaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.78 0.1 70)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Organização de Tempo */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Organização de Tempo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={organizacaoTempoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {organizacaoTempoData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horas de Estudo */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Horas de Estudo Fora da Aula
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={horasEstudoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.7 0.08 250)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Primeira Opção */}
          <div className="neomorph-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Primeira Opção de Curso
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Sim", value: primeiraOpcaoSim },
                    { name: "Não", value: primeiraOpcaoNao },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="oklch(0.8 0.08 160)" />
                  <Cell fill="oklch(0.75 0.12 35)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Insights */}
        <div className="neomorph-card p-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <h3 className="text-2xl font-semibold mb-4">Principais Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>
                <strong>Maioria jovem:</strong> {Math.round((idadeData[0]?.value / data.total_respostas) * 100)}% dos calouros têm entre 17-18 anos
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
              <p>
                <strong>Boa adaptação:</strong> {Math.round(((adaptacaoData[0]?.value + adaptacaoData[2]?.value) / data.total_respostas) * 100)}% acham a adaptação fácil ou muito fácil
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
              <p>
                <strong>Acompanhamento positivo:</strong> {Math.round(((acompanhamentoData[0]?.value + acompanhamentoData[1]?.value) / data.total_respostas) * 100)}% conseguem acompanhar bem as aulas
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>
                <strong>Desafio social:</strong> Fazer amizades é a maior dificuldade para {maiorDificuldadeData[0]?.value} alunos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
