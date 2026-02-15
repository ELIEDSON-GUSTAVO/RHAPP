import { useState } from 'react';
import { useFuncionarioStore } from '@/store/useFuncionarioStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Download,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export function RelatoriosView() {
  const { funcionarios, getDepartamentoStats } = useFuncionarioStore();
  
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const deptStats = getDepartamentoStats();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  // Filtrar funcionários por período
  const funcionariosFiltrados = funcionarios.filter(f => {
    const dataAdmissao = new Date(f.data_admissao);
    return dataAdmissao >= new Date(startDate) && dataAdmissao <= new Date(endDate);
  });

  // Estatísticas salariais
  const salaryStats = (() => {
    const stats = funcionariosFiltrados.reduce((acc, f) => {
      if (!acc[f.departamento]) {
        acc[f.departamento] = { salarios: [], total: 0, count: 0 };
      }
      acc[f.departamento].salarios.push(f.salario);
      acc[f.departamento].total += f.salario;
      acc[f.departamento].count++;
      return acc;
    }, {} as Record<string, { salarios: number[]; total: number; count: number }>);

    return Object.entries(stats).map(([dept, data]) => ({
      departamento: dept,
      media: data.total / data.count,
      mediana: (() => {
        const sorted = [...data.salarios].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      })(),
      minimo: Math.min(...data.salarios),
      maximo: Math.max(...data.salarios),
    }));
  })();

  // Top 10 maiores salários
  const topSalarios = [...funcionariosFiltrados]
    .sort((a, b) => b.salario - a.salario)
    .slice(0, 10)
    .map(f => ({
      nome: f.nome,
      salario: f.salario,
      cargo: f.cargo,
      departamento: f.departamento,
    }));

  // Contratações por mês
  const contratacoesPorMes = (() => {
    const meses: Record<string, number> = {};
    funcionariosFiltrados.forEach((f) => {
      const mes = f.data_admissao.substring(0, 7);
      meses[mes] = (meses[mes] || 0) + 1;
    });
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, quantidade]) => ({
        mes,
        quantidade,
      }));
  })();

  // Crescimento cumulativo
  const crescimentoCumulativo = (() => {
    const sorted = [...funcionariosFiltrados]
      .sort((a, b) => new Date(a.data_admissao).getTime() - new Date(b.data_admissao).getTime());
    
    return sorted.map((f, idx) => ({
      data: f.data_admissao,
      acumulado: idx + 1,
    }));
  })();

  // Distribuição de status
  const statusDist = (() => {
    const map = new Map<string, number>();
    funcionariosFiltrados.forEach(f => {
      map.set(f.status, (map.get(f.status) || 0) + 1);
    });
    return Array.from(map.entries()).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  })();

  const STATUS_COLORS = {
    'Ativo': '#00CC00',
    'Inativo': '#FF0000',
    'Férias': '#FFCC00',
  };

  // Exportar relatório
  const exportReport = () => {
    const report = {
      periodo: { inicio: startDate, fim: endDate },
      totalFuncionarios: funcionariosFiltrados.length,
      folhaSalarial: funcionariosFiltrados.reduce((sum, f) => sum + f.salario, 0),
      estatisticasPorDepartamento: salaryStats,
      top10Salarios: topSalarios,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_rh_${startDate}_${endDate}.json`;
    link.click();
    toast.success('Relatório exportado!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#FF0000]">Relatórios e Análises</h1>
          <p className="text-gray-400 mt-1">Análise detalhada dos dados de RH</p>
        </div>
        <Button variant="outline" onClick={exportReport} className="border-[#444]">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros de Período */}
      <Card className="bg-[#1E1E1E] border-[#333]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-[#FF0000]" />
            <div className="flex gap-4 items-end">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Data Inicial</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#2D2D2D] border-[#444]"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Data Final</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#2D2D2D] border-[#444]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="salarios" className="w-full">
        <TabsList className="bg-[#2D2D2D]">
          <TabsTrigger value="salarios" className="data-[state=active]:bg-[#FF0000]">
            <DollarSign className="w-4 h-4 mr-2" />
            Salários
          </TabsTrigger>
          <TabsTrigger value="crescimento" className="data-[state=active]:bg-[#FF0000]">
            <TrendingUp className="w-4 h-4 mr-2" />
            Crescimento
          </TabsTrigger>
          <TabsTrigger value="departamentos" className="data-[state=active]:bg-[#FF0000]">
            <Building2 className="w-4 h-4 mr-2" />
            Departamentos
          </TabsTrigger>
        </TabsList>

        {/* Análise Salarial */}
        <TabsContent value="salarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Histograma de Salários */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Distribuição de Salários</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={(() => {
                      const min = Math.min(...funcionariosFiltrados.map(f => f.salario));
                      const max = Math.max(...funcionariosFiltrados.map(f => f.salario));
                      const range = max - min || 1;
                      const binCount = 10;
                      const binSize = range / binCount;
                      
                      const bins = Array.from({ length: binCount }, (_, i) => ({
                        range: `R$${Math.round((min + i * binSize) / 1000)}k-${Math.round((min + (i + 1) * binSize) / 1000)}k`,
                        count: funcionariosFiltrados.filter(f => {
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

            {/* Top 10 Maiores Salários */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Top 10 Maiores Salários</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSalarios} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      type="number" 
                      tick={{ fill: '#999', fontSize: 11 }}
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      dataKey="nome" 
                      type="category" 
                      width={120}
                      tick={{ fill: '#999', fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2D2D2D',
                        border: '1px solid #FF0000',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="salario" fill="#FF0000" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas por Departamento */}
          <Card className="bg-[#1E1E1E] border-[#333]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#FF0000] mb-4">Estatísticas Salariais por Departamento</h3>
              <div className="overflow-x-auto">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Departamento</th>
                      <th>Média</th>
                      <th>Mediana</th>
                      <th>Mínimo</th>
                      <th>Máximo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryStats.map((stat) => (
                      <tr key={stat.departamento}>
                        <td className="font-medium text-white">{stat.departamento}</td>
                        <td className="text-[#FF6B6B]">{formatCurrency(stat.media)}</td>
                        <td className="text-gray-400">{formatCurrency(stat.mediana)}</td>
                        <td className="text-gray-400">{formatCurrency(stat.minimo)}</td>
                        <td className="text-gray-400">{formatCurrency(stat.maximo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crescimento */}
        <TabsContent value="crescimento" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contratações por Mês */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Contratações por Mês</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={contratacoesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="mes" tick={{ fill: '#999', fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Crescimento Cumulativo */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Crescimento Cumulativo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={crescimentoCumulativo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="data" tick={{ fill: '#999', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: '#999', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2D2D2D',
                        border: '1px solid #FF0000',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="step"
                      dataKey="acumulado"
                      stroke="#FF0000"
                      strokeWidth={2}
                      fill="rgba(255, 0, 0, 0.1)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departamentos */}
        <TabsContent value="departamentos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Status */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Distribuição por Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDist}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDist.map((entry, index) => (
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

            {/* Custo por Departamento */}
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#FF0000] mb-4">Custo por Departamento</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deptStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="nome" 
                      tick={{ fill: '#999', fontSize: 10 }} 
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
                    <Bar dataKey="custoTotal" fill="#FF0000" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Departamentos */}
          <Card className="bg-[#1E1E1E] border-[#333]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#FF0000] mb-4">Resumo por Departamento</h3>
              <div className="overflow-x-auto">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Departamento</th>
                      <th>Funcionários</th>
                      <th>Custo Total</th>
                      <th>% do Total</th>
                      <th>Salário Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptStats.map((dept) => (
                      <tr key={dept.nome}>
                        <td className="font-medium text-white">{dept.nome}</td>
                        <td className="text-gray-400">{dept.funcionarios}</td>
                        <td className="text-[#FF6B6B]">{formatCurrency(dept.custoTotal)}</td>
                        <td className="text-gray-400">{dept.percentual.toFixed(1)}%</td>
                        <td className="text-gray-400">{formatCurrency(dept.salarioMedio)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
