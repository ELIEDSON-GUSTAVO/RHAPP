import { useEffect, useState } from 'react';
import { useFuncionarioStore } from '@/store/useFuncionarioStore';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  delay: number;
}

function StatCard({ title, value, subtitle, icon: Icon, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={cn(
        'metric-card transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Icon className="w-6 h-6 text-[#FF0000]" />
          <p className="text-sm text-gray-400">{title}</p>
        </div>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { 
    getDashboardStats, 
    getDepartamentoStats, 
    getFuncionariosRecentes,
    funcionarios,
    setDepartamentoSelecionado 
  } = useFuncionarioStore();
  
  const [animatedStats, setAnimatedStats] = useState({
    totalFuncionarios: 0,
    folhaSalarial: 0,
    salarioMedio: 0,
    totalDepartamentos: 0,
    contratadosRecente: 0,
  });

  const stats = getDashboardStats();
  const deptStats = getDepartamentoStats();
  const funcionariosRecentes = getFuncionariosRecentes(30);

  // Animação dos números
  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        totalFuncionarios: Math.round(stats.totalFuncionarios * easeOut),
        folhaSalarial: Math.round(stats.folhaSalarial * easeOut),
        salarioMedio: Math.round(stats.salarioMedio * easeOut),
        totalDepartamentos: Math.round(stats.totalDepartamentos * easeOut),
        contratadosRecente: Math.round(stats.contratadosRecente * easeOut),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);

  // Dados para gráficos
  const deptData = deptStats.map(d => ({
    nome: d.nome,
    custo: d.custoTotal,
    funcionarios: d.funcionarios,
  }));

  // Distribuição por departamento para pie chart
  const pieData = deptStats.map(d => ({
    name: d.nome,
    value: d.funcionarios,
  }));

  const COLORS = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#CC0000'];

  // Contratações por mês
  const contratacoesPorMes = (() => {
    const meses: Record<string, number> = {};
    funcionarios.forEach((f) => {
      const mes = f.data_admissao.substring(0, 7);
      meses[mes] = (meses[mes] || 0) + 1;
    });
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([mes, quantidade]) => ({
        mes: mes.substring(5),
        quantidade,
      }));
  })();

  // Cores para cards de departamento baseado no percentual
  const getDeptColors = (percentual: number) => {
    if (percentual >= 20) return { border: '#FF0000', bg: '#330000' };
    if (percentual >= 10) return { border: '#FF6B6B', bg: '#2A0000' };
    return { border: '#FF9999', bg: '#220000' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#FF0000]">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral do sistema de RH</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última atualização</p>
          <p className="text-sm font-medium text-gray-300">{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Funcionários"
          value={animatedStats.totalFuncionarios}
          icon={Users}
          delay={0}
        />
        <StatCard
          title="Folha Salarial"
          value={formatCurrency(animatedStats.folhaSalarial)}
          icon={DollarSign}
          delay={100}
        />
        <StatCard
          title="Salário Médio"
          value={formatCurrency(animatedStats.salarioMedio)}
          icon={TrendingUp}
          delay={200}
        />
        <StatCard
          title="Departamentos"
          value={animatedStats.totalDepartamentos}
          icon={Building2}
          delay={300}
        />
        <StatCard
          title="Contratados (30d)"
          value={`+${animatedStats.contratadosRecente}`}
          subtitle="Últimos 30 dias"
          icon={Calendar}
          delay={400}
        />
      </div>

      {/* Custo por Setor - Gráfico Principal */}
      <Card className="bg-[#1E1E1E] border-[#333]">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#FF0000] mb-4">💰 Custo por Setor</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="nome" 
                tick={{ fill: '#999', fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#999', fontSize: 12 }}
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #FF0000',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="custo" radius={[4, 4, 0, 0]}>
                {deptData.map((_, idx) => (
                  <Cell 
                    key={`cell-${idx}`} 
                    fill={`hsl(${0 + idx * 10}, 100%, ${50 - idx * 5}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cards de Departamentos */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">💰 Resumo Detalhado por Setor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deptStats.map((dept) => {
            const colors = getDeptColors(dept.percentual);
            
            return (
              <div
                key={dept.nome}
                className="dept-card group"
                style={{
                  borderColor: colors.border,
                  background: `linear-gradient(135deg, ${colors.bg} 0%, #1E1E1E 100%)`,
                }}
              >
                <div 
                  className="text-lg font-bold mb-3 text-center"
                  style={{ color: colors.border }}
                >
                  {dept.nome.length > 20 ? dept.nome.substring(0, 18) + '...' : dept.nome}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-[#FF6B6B]">
                    💰 {formatCurrency(dept.custoTotal)}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>📊 {dept.percentual.toFixed(1)}% do total</div>
                    <div>👥 {dept.funcionarios} funcionário{dept.funcionarios !== 1 ? 's' : ''}</div>
                    <div>💵 Média: {formatCurrency(dept.salarioMedio)}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setDepartamentoSelecionado(dept.nome)}
                  className="w-full mt-4 py-2 bg-[#FF0000]/20 hover:bg-[#FF0000]/30 text-[#FF0000] rounded-lg flex items-center justify-center gap-2 transition-all group-hover:translate-y-0"
                >
                  Ver Detalhes
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funcionários Recentes */}
      {funcionariosRecentes.length > 0 && (
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-[#FF0000] mb-4">🆕 Funcionários Adicionados Recentemente</h2>
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Departamento</th>
                    <th>Salário</th>
                    <th>Data de Admissão</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionariosRecentes.slice(0, 5).map((func) => (
                    <tr key={func.id}>
                      <td className="font-medium text-white">{func.nome}</td>
                      <td className="text-gray-400">{func.cargo}</td>
                      <td className="text-gray-400">{func.departamento}</td>
                      <td className="text-[#FF6B6B] font-medium">{formatCurrency(func.salario)}</td>
                      <td className="text-gray-400">
                        {new Date(func.data_admissao).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Departamento */}
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#FF0000] mb-4">📊 Funcionários por Departamento</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2D2D',
                    border: '1px solid #FF0000',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contratações por Mês */}
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#FF0000] mb-4">📈 Contratações por Mês</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contratacoesPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mes" tick={{ fill: '#999', fontSize: 12 }} />
                <YAxis tick={{ fill: '#999', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2D2D',
                    border: '1px solid #FF0000',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="quantidade"
                  stroke="#FF0000"
                  strokeWidth={3}
                  dot={{ fill: '#FF0000', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
