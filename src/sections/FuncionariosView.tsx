import { useState, useRef } from 'react';
import { useFuncionarioStore, gerarEmail } from '@/store/useFuncionarioStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  User,
  Grid3X3,
  List,
} from 'lucide-react';
import type { Funcionario } from '@/types';

const STATUS_COLORS = {
  'Ativo': 'bg-green-500/20 text-green-400 border-green-500',
  'Inativo': 'bg-red-500/20 text-red-400 border-red-500',
  'Férias': 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
};

interface FuncionarioFormProps {
  funcionario?: Funcionario;
  onSave: (funcionario: Omit<Funcionario, 'id'>) => void;
  onCancel: () => void;
  departamentos: string[];
}

function FuncionarioForm({ funcionario, onSave, onCancel, departamentos }: FuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: funcionario?.nome || '',
    email: funcionario?.email || '',
    telefone: funcionario?.telefone || '',
    departamento: funcionario?.departamento || '',
    cargo: funcionario?.cargo || '',
    salario: funcionario?.salario || 0,
    data_admissao: funcionario?.data_admissao || new Date().toISOString().split('T')[0],
    status: funcionario?.status || 'Ativo',
    observacoes: funcionario?.observacoes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gerar email automaticamente se não fornecido
    let emailFinal = formData.email;
    if (!emailFinal) {
      emailFinal = gerarEmail(formData.nome);
    }
    
    onSave({ ...formData, email: emailFinal });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Digite o nome"
            required
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional - gera automático)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@empresa.com"
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento *</Label>
          <Select
            value={formData.departamento}
            onValueChange={(value) => setFormData({ ...formData, departamento: value })}
          >
            <SelectTrigger className="bg-[#2D2D2D] border-[#444]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D2D2D] border-[#444]">
              {departamentos.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
              <SelectItem value="_novo">+ Novo Departamento</SelectItem>
            </SelectContent>
          </Select>
          {formData.departamento === '_novo' && (
            <Input
              placeholder="Nome do novo departamento"
              value=""
              onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
              className="bg-[#2D2D2D] border-[#444] mt-2"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo *</Label>
          <Input
            id="cargo"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            placeholder="Digite o cargo"
            required
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salario">Salário (R$) *</Label>
          <Input
            id="salario"
            type="number"
            value={formData.salario}
            onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })}
            placeholder="0,00"
            required
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_admissao">Data de Admissão *</Label>
          <Input
            id="data_admissao"
            type="date"
            value={formData.data_admissao}
            onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
            required
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="bg-[#2D2D2D] border-[#444]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D2D2D] border-[#444]">
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
              <SelectItem value="Férias">Férias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
            className="bg-[#2D2D2D] border-[#444]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Input
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Observações adicionais"
          className="bg-[#2D2D2D] border-[#444]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#444]">
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
          {funcionario ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}

export function FuncionariosView() {
  const {
    funcionarios,
    addFuncionario,
    updateFuncionario,
    deleteFuncionario,
    importFuncionarios,
    exportToCSV,
  } = useFuncionarioStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | undefined>();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Importação CSV
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lista única de departamentos
  const departamentos = Array.from(new Set(funcionarios.map(f => f.departamento))).sort();

  const handleSave = (data: Omit<Funcionario, 'id'>) => {
    if (funcionarioEditando) {
      const success = updateFuncionario(funcionarioEditando.email, data);
      if (success) {
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar funcionário.');
      }
    } else {
      const success = addFuncionario(data);
      if (success) {
        toast.success('Funcionário adicionado com sucesso!');
      } else {
        toast.error('Erro: Email já existe.');
      }
    }
    setDialogOpen(false);
    setFuncionarioEditando(undefined);
  };

  const handleEdit = (funcionario: Funcionario) => {
    setFuncionarioEditando(funcionario);
    setDialogOpen(true);
  };

  const handleDelete = (email: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      const success = deleteFuncionario(email);
      if (success) {
        toast.success('Funcionário excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir funcionário.');
      }
    }
  };

  const handleAddNew = () => {
    setFuncionarioEditando(undefined);
    setDialogOpen(true);
  };

  // Processar arquivo CSV
  const processCSV = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        // Detectar separador
        const separador = content.includes(';') ? ';' : ',';
        
        // Parse manual para lidar com diferentes formatos
        const linhas = content.split('\n').filter(l => l.trim());
        const headers = linhas[0].split(separador).map(h => h.trim().toLowerCase());
        
        const dados: any[] = [];
        
        for (let i = 1; i < linhas.length; i++) {
          const valores = linhas[i].split(separador);
          const row: any = {};
          
          headers.forEach((header, idx) => {
            const valor = valores[idx]?.trim() || '';
            
            // Mapear colunas
            if (header.includes('nome')) row.nome = valor;
            if (header.includes('cargo')) row.cargo = valor;
            if (header.includes('salario') || header.includes('salário')) {
              // Limpar salário: remover R$, espaços, pontos de milhar
              let salarioLimpo = valor.replace(/R\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
              row.salario = parseFloat(salarioLimpo) || 0;
            }
            if (header.includes('departamento')) row.departamento = valor;
            if (header.includes('data')) {
              // Converter DD/MM/AAAA para AAAA-MM-DD
              if (valor.includes('/')) {
                const parts = valor.split('/');
                if (parts.length === 3) {
                  row.data_admissao = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                } else {
                  row.data_admissao = valor;
                }
              } else {
                row.data_admissao = valor;
              }
            }
          });
          
          if (row.nome && row.cargo) {
            dados.push({
              ...row,
              email: '',
              telefone: '',
              status: 'Ativo',
              observacoes: '',
            });
          }
        }
        
        setImportPreview(dados);
        setShowImportPreview(true);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error('Erro ao processar arquivo CSV');
    }
  };

  const handleImport = () => {
    const result = importFuncionarios(importPreview);
    
    if (result.sucesso > 0) {
      toast.success(`${result.sucesso} funcionários importados com sucesso!`);
    }
    if (result.erros > 0) {
      toast.error(`${result.erros} erros na importação`);
      result.mensagens.forEach(msg => console.log(msg));
    }
    
    setShowImportPreview(false);
    setImportPreview([]);
  };

  const downloadTemplate = () => {
    const template = `nome;cargo;salario;departamento;data_admissao
JOÃO SILVA;ANALISTA;R$ 5.000,00;TECNOLOGIA;15/01/2024
MARIA SANTOS;GERENTE;R$ 8.500,50;VENDAS;01/02/2024`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_funcionarios.csv';
    link.click();
    toast.success('Template baixado!');
  };

  const handleExport = () => {
    const csv = exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `funcionarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Arquivo CSV exportado!');
  };

  // Filtrar e ordenar funcionários
  let filteredFuncionarios = [...funcionarios];
  
  if (searchTerm) {
    filteredFuncionarios = filteredFuncionarios.filter(f => 
      f.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (deptFilter !== 'Todos') {
    filteredFuncionarios = filteredFuncionarios.filter(f => f.departamento === deptFilter);
  }
  
  if (statusFilter !== 'Todos') {
    filteredFuncionarios = filteredFuncionarios.filter(f => f.status === statusFilter);
  }
  
  filteredFuncionarios.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'nome':
        comparison = a.nome.localeCompare(b.nome);
        break;
      case 'salario':
        comparison = a.salario - b.salario;
        break;
      case 'data_admissao':
        comparison = new Date(a.data_admissao).getTime() - new Date(b.data_admissao).getTime();
        break;
      case 'departamento':
        comparison = a.departamento.localeCompare(b.departamento);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#FF0000]">Gestão de Funcionários</h1>
          <p className="text-gray-400 mt-1">{filteredFuncionarios.length} funcionário(s) encontrado(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="border-[#444]">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="bg-[#FF0000] hover:bg-[#CC0000]">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1E1E1E] border-[#333]">
              <DialogHeader>
                <DialogTitle className="text-[#FF0000]">
                  {funcionarioEditando ? 'Editar Funcionário' : 'Novo Funcionário'}
                </DialogTitle>
              </DialogHeader>
              <FuncionarioForm
                funcionario={funcionarioEditando}
                onSave={handleSave}
                onCancel={() => setDialogOpen(false)}
                departamentos={departamentos}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="bg-[#2D2D2D]">
          <TabsTrigger value="lista" className="data-[state=active]:bg-[#FF0000]">Lista</TabsTrigger>
          <TabsTrigger value="importar" className="data-[state=active]:bg-[#FF0000]">Importar CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {/* Filtros */}
          <Card className="bg-[#1E1E1E] border-[#333]">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Label className="text-xs text-gray-500 mb-1 block">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#2D2D2D] border-[#444]"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Departamento</Label>
                  <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-[180px] bg-[#2D2D2D] border-[#444]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D2D2D] border-[#444]">
                      <SelectItem value="Todos">Todos</SelectItem>
                      {departamentos.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-[#2D2D2D] border-[#444]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D2D2D] border-[#444]">
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Férias">Férias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Ordenar por</Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[140px] bg-[#2D2D2D] border-[#444]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2D2D2D] border-[#444]">
                        <SelectItem value="nome">Nome</SelectItem>
                        <SelectItem value="salario">Salário</SelectItem>
                        <SelectItem value="data_admissao">Data</SelectItem>
                        <SelectItem value="departamento">Departamento</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="border-[#444] px-3"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    onClick={() => setViewMode('table')}
                    className={viewMode === 'table' ? 'bg-[#FF0000]' : 'border-[#444]'}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    onClick={() => setViewMode('cards')}
                    className={viewMode === 'cards' ? 'bg-[#FF0000]' : 'border-[#444]'}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Funcionários */}
          {viewMode === 'table' ? (
            <Card className="bg-[#1E1E1E] border-[#333]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#2D2D2D] hover:bg-[#2D2D2D]">
                        <TableHead className="text-gray-300">Nome</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Departamento</TableHead>
                        <TableHead className="text-gray-300">Cargo</TableHead>
                        <TableHead className="text-gray-300">Salário</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Admissão</TableHead>
                        <TableHead className="text-gray-300 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFuncionarios.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            Nenhum funcionário encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFuncionarios.map((funcionario) => (
                          <TableRow key={funcionario.id} className="hover:bg-[#252525]">
                            <TableCell className="font-medium text-white">{funcionario.nome}</TableCell>
                            <TableCell className="text-gray-400">{funcionario.email}</TableCell>
                            <TableCell className="text-gray-400">{funcionario.departamento}</TableCell>
                            <TableCell className="text-gray-400">{funcionario.cargo}</TableCell>
                            <TableCell className="text-[#FF6B6B] font-medium">
                              {formatCurrency(funcionario.salario)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={STATUS_COLORS[funcionario.status]}
                              >
                                {funcionario.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(funcionario)}
                                  className="h-8 w-8 hover:bg-blue-500/20"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(funcionario.email)}
                                  className="h-8 w-8 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Visualização em Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFuncionarios.map((funcionario) => (
                <Card key={funcionario.id} className="bg-[#1E1E1E] border-[#333]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{funcionario.nome}</p>
                          <p className="text-sm text-gray-400">{funcionario.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={STATUS_COLORS[funcionario.status]}
                      >
                        {funcionario.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Departamento:</span>
                        <span className="text-gray-300">{funcionario.departamento}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cargo:</span>
                        <span className="text-gray-300">{funcionario.cargo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Salário:</span>
                        <span className="text-[#FF6B6B] font-medium">{formatCurrency(funcionario.salario)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Admissão:</span>
                        <span className="text-gray-300">
                          {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(funcionario)}
                        className="flex-1 border-[#444]"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(funcionario.email)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="importar" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333]">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-[#FF0000] mb-4">📋 Importar Múltiplos Funcionários</h3>
                  
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Seu formato já é aceito!</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      O sistema detecta automaticamente separadores (; ou ,), salários com R$, 
                      datas em DD/MM/AAAA e converte tudo automaticamente.
                    </p>
                  </div>
                  
                  <div className="bg-[#2D2D2D] rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-400 mb-2">Exemplo do formato aceito:</p>
                    <pre className="text-xs text-gray-300 bg-[#1E1E1E] p-3 rounded overflow-x-auto">
{`nome;cargo;salario;departamento;data_admissao
JOÃO SILVA;ANALISTA;R$ 5.000,00;TECNOLOGIA;15/01/2024
MARIA SANTOS;GERENTE;R$ 8.500,50;VENDAS;01/02/2024`}
                    </pre>
                  </div>
                  
                  <Button onClick={downloadTemplate} variant="outline" className="border-[#444]">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Template CSV
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[#FF0000] mb-4">📤 Upload de Arquivo</h3>
                  
                  <div 
                    className="border-2 border-dashed border-[#444] rounded-lg p-8 text-center hover:border-[#FF0000] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processCSV(file);
                      }}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300">Clique para selecionar ou arraste um arquivo CSV</p>
                    <p className="text-sm text-gray-500 mt-2">Formatos: .csv (separador ; ou ,)</p>
                  </div>
                </div>
              </div>
              
              {/* Preview da Importação */}
              {showImportPreview && importPreview.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-white mb-4">📋 Prévia dos Dados ({importPreview.length} registros)</h4>
                  
                  <div className="overflow-x-auto mb-4">
                    <table className="table-dark">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Cargo</th>
                          <th>Salário</th>
                          <th>Departamento</th>
                          <th>Data Admissão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.nome}</td>
                            <td>{row.cargo}</td>
                            <td className="text-[#FF6B6B]">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(row.salario)}
                            </td>
                            <td>{row.departamento}</td>
                            <td>{row.data_admissao}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2">
                        ... e mais {importPreview.length - 5} registros
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleImport} className="bg-[#FF0000] hover:bg-[#CC0000]">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar {importPreview.length} Funcionários
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowImportPreview(false);
                        setImportPreview([]);
                      }}
                      className="border-[#444]"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
