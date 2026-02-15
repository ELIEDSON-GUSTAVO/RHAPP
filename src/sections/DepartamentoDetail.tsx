import { useFuncionarioStore } from '@/store/useFuncionarioStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Building2,
} from 'lucide-react';

export function DepartamentoDetail() {
  const { 
    departamentoSelecionado, 
    setDepartamentoSelecionado, 
    getFuncionariosPorDepartamento,
    getDashboardStats
  } = useFuncionarioStore();

  if (!departamentoSelecionado) return null;

  const funcionarios = getFuncionariosPorDepartamento(departamentoSelecionado);
  const stats = getDashboardStats();
  
  const totalFuncionarios = funcionarios.length;
  const custoTotal = funcionarios.reduce((sum, f) => sum + f.salario, 0);
  const salarioMedio = totalFuncionarios > 0 ? custoTotal / totalFuncionarios : 0;
  const salarioMaximo = Math.max(...funcionarios.map(f => f.salario), 0);
  const salarioMinimo = Math.min(...funcionarios.map(f => f.salario), 0);
  const salarioMediano = (() => {
    const sorted = [...funcionarios].sort((a, b) => a.salario - b.salario);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid].salario : (sorted[mid - 1].salario + sorted[mid].salario) / 2;
  })();
  const percentualCusto = stats.folhaSalarial > 0 ? (custoTotal / stats.folhaSalarial) * 100 : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  // Dados para gráficos
  const cargoData = (() => {
    const cargoMap = new Map<string, { total: number; count: number }>();
    funcionarios.forEach(f => {
      if (!cargoMap.has(f.cargo)) {
        cargoMap.set(f.cargo, { total: 0, count: 0 });
      }
      const data = cargoMap.get(f.cargo)!;
      data.total += f.salario;
      data.count++;
    });
    return Array.from(cargoMap.entries())
      .map(([cargo, data]) => ({
        cargo,
        media: data.total / data.count,
      }))
      .sort((a, b) => b.media - a.media);
  })();

  const statusData = (() => {
    const statusMap = new Map<string, number>();
    funcionarios.forEach(f => {
      statusMap.set(f.status, (statusMap.get(f.status) || 0) + 1);
    });
    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  })();

  const STATUS_COLORS = {
    'Ativo': '#00CC00',
    'Inativo': '#FF0000',
    'Férias': '#FFCC00',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setDepartamentoSelecionado(null)}
          className="border-[#444] text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#FF0000]">Análise Detalhada: {departamentoSelecionado}</h1>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total de Funcionários</p>
              <p className="text-2xl font-bold text-white">{totalFuncionarios}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Custo Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(custoTotal)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Salário Médio</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(salarioMedio)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Maior Salário</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(salarioMaximo)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salário Médio por Cargo */}
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#FF0000] mb-4">💼 Salário Médio por Cargo</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cargoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="cargo" 
                  tick={{ fill: '#999', fontSize: 11 }} 
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
                <Bar dataKey="media" fill="#FF0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Funcionários */}
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#FF0000] mb-4">📊 Status dos Funcionários</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#999'} 
                    />
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
      </div>

      {/* Distribuição de Salários */}
      <Card className="bg-[#1E1E1E] border-[#333]">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[#FF0000] mb-4">💵 Distribuição de Salários</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={(() => {
                // Criar bins para histograma
                const min = Math.min(...funcionarios.map(f => f.salario));
                const max = Math.max(...funcionarios.map(f => f.salario));
                const range = max - min;
                const binCount = 8;
                const binSize = range / binCount;
                
                const bins = Array.from({ length: binCount }, (_, i) => ({
                  range: `R$${Math.round((min + i * binSize) / 1000)}k-${Math.round((min + (i + 1) * binSize) / 1000)}k`,
                  count: funcionarios.filter(f => {
                    const val = f.salario;
                    return val >= min + i * binSize && val < min + (i + 1) * binSize;
                  }).length,
                }));
                
                return bins;
              })()}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="range" tick={{ fill: '#999', fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#999', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #FF0000',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#FF0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <Card className="bg-[#1E1E1E] border-[#333]">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[#FF0000] mb-4">👥 Lista de Funcionários</h2>
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Salário</th>
                  <th>Status</th>
                  <th>Data de Admissão</th>
                </tr>
              </thead>
              <tbody>
                {[...funcionarios]
                  .sort((a, b) => b.salario - a.salario)
                  .map((func) => (
                    <tr key={func.id}>
                      <td className="font-medium text-white">{func.nome}</td>
                      <td className="text-gray-400">{func.cargo}</td>
                      <td className="text-[#FF6B6B] font-medium">{formatCurrency(func.salario)}</td>
                      <td>
                        <Badge 
                          variant="outline"
                          className={`
                            ${func.status === 'Ativo' ? 'bg-green-500/20 text-green-400 border-green-500' : ''}
                            ${func.status === 'Inativo' ? 'bg-red-500/20 text-red-400 border-red-500' : ''}
                            ${func.status === 'Férias' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' : ''}
                          `}
                        >
                          {func.status}
                        </Badge>
                      </td>
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

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-400">Menor Salário</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(salarioMinimo)}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-400">Salário Mediano</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(salarioMediano)}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333]">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-400">% do Custo Total</p>
            <p className="text-2xl font-bold text-[#FF0000]">{percentualCusto.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
