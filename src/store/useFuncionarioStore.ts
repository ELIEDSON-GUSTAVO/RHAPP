import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Funcionario, DepartamentoStats, DashboardStats } from '@/types';

interface FuncionarioState {
  funcionarios: Funcionario[];
  viewAtual: 'dashboard' | 'funcionarios' | 'relatorios';
  departamentoSelecionado: string | null;
  
  setViewAtual: (view: 'dashboard' | 'funcionarios' | 'relatorios') => void;
  setDepartamentoSelecionado: (dept: string | null) => void;
  
  // CRUD
  addFuncionario: (funcionario: Omit<Funcionario, 'id'>) => boolean;
  updateFuncionario: (email: string, funcionario: Partial<Funcionario>) => boolean;
  deleteFuncionario: (email: string) => boolean;
  
  // Importação em massa
  importFuncionarios: (funcionarios: Omit<Funcionario, 'id'>[]) => { sucesso: number; erros: number; mensagens: string[] };
  
  // Getters
  getDashboardStats: () => DashboardStats;
  getDepartamentoStats: () => DepartamentoStats[];
  getFuncionariosPorDepartamento: (dept: string) => Funcionario[];
  getFuncionariosRecentes: (dias: number) => Funcionario[];
  
  // Exportação
  exportToCSV: () => string;
}

const gerarId = () => Math.random().toString(36).substr(2, 9);

// Gerar email automaticamente a partir do nome
export const gerarEmail = (nome: string): string => {
  const nomeParts = nome.toLowerCase().trim().split(/\s+/);
  if (nomeParts.length >= 2) {
    return `${nomeParts[0]}.${nomeParts[nomeParts.length - 1]}@empresa.com`;
  }
  return `${nomeParts[0]}@empresa.com`;
};

// Funcionários iniciais de exemplo
const funcionariosIniciais: Funcionario[] = [
  {
    id: gerarId(),
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 98765-4321',
    departamento: 'Tecnologia',
    cargo: 'Desenvolvedor Senior',
    salario: 8500,
    data_admissao: '2023-01-15',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    telefone: '(11) 98765-4322',
    departamento: 'Vendas',
    cargo: 'Gerente de Vendas',
    salario: 12000,
    data_admissao: '2022-06-10',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    telefone: '(11) 98765-4323',
    departamento: 'Marketing',
    cargo: 'Analista de Marketing',
    salario: 5500,
    data_admissao: '2023-08-20',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Ana Paula',
    email: 'ana.paula@empresa.com',
    telefone: '(11) 98765-4324',
    departamento: 'Recursos Humanos',
    cargo: 'Analista de RH',
    salario: 6000,
    data_admissao: '2023-03-05',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Carlos Eduardo',
    email: 'carlos.eduardo@empresa.com',
    telefone: '(11) 98765-4325',
    departamento: 'Financeiro',
    cargo: 'Analista Financeiro',
    salario: 7000,
    data_admissao: '2022-11-12',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Julia Fernandes',
    email: 'julia.fernandes@empresa.com',
    telefone: '(11) 98765-4326',
    departamento: 'Tecnologia',
    cargo: 'Desenvolvedor Pleno',
    salario: 6500,
    data_admissao: '2024-01-10',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Roberto Lima',
    email: 'roberto.lima@empresa.com',
    telefone: '(11) 98765-4327',
    departamento: 'Operações',
    cargo: 'Coordenador',
    salario: 8000,
    data_admissao: '2021-09-15',
    status: 'Ativo',
    observacoes: ''
  },
  {
    id: gerarId(),
    nome: 'Fernanda Oliveira',
    email: 'fernanda.oliveira@empresa.com',
    telefone: '(11) 98765-4328',
    departamento: 'Vendas',
    cargo: 'Vendedor',
    salario: 3500,
    data_admissao: '2024-02-01',
    status: 'Ativo',
    observacoes: ''
  }
];

export const useFuncionarioStore = create<FuncionarioState>()(
  persist(
    (set, get) => ({
      funcionarios: funcionariosIniciais,
      viewAtual: 'dashboard',
      departamentoSelecionado: null,

      setViewAtual: (view) => set({ viewAtual: view }),
      setDepartamentoSelecionado: (dept) => set({ departamentoSelecionado: dept }),

      addFuncionario: (funcionario) => {
        const { funcionarios } = get();
        
        // Verificar se email já existe
        if (funcionarios.some(f => f.email === funcionario.email)) {
          return false;
        }

        const novoFuncionario: Funcionario = {
          ...funcionario,
          id: gerarId(),
        };

        set({ funcionarios: [...funcionarios, novoFuncionario] });
        return true;
      },

      updateFuncionario: (email, funcionario) => {
        const { funcionarios } = get();
        const index = funcionarios.findIndex(f => f.email === email);
        
        if (index === -1) return false;

        const updatedFuncionarios = [...funcionarios];
        updatedFuncionarios[index] = { ...updatedFuncionarios[index], ...funcionario };
        
        set({ funcionarios: updatedFuncionarios });
        return true;
      },

      deleteFuncionario: (email) => {
        const { funcionarios } = get();
        const filtered = funcionarios.filter(f => f.email !== email);
        
        if (filtered.length === funcionarios.length) return false;
        
        set({ funcionarios: filtered });
        return true;
      },

      importFuncionarios: (novosFuncionarios) => {
        const { funcionarios, addFuncionario } = get();
        const result = { sucesso: 0, erros: 0, mensagens: [] as string[] };

        for (const func of novosFuncionarios) {
          try {
            // Gerar email se não tiver
            if (!func.email) {
              func.email = gerarEmail(func.nome);
            }

            // Verificar duplicidade de email
            if (funcionarios.some(f => f.email === func.email)) {
              result.erros++;
              result.mensagens.push(`${func.nome}: Email já existe`);
              continue;
            }

            const success = addFuncionario(func);
            if (success) {
              result.sucesso++;
            } else {
              result.erros++;
              result.mensagens.push(`${func.nome}: Erro ao adicionar`);
            }
          } catch (error) {
            result.erros++;
            result.mensagens.push(`${func.nome}: ${error}`);
          }
        }

        return result;
      },

      getDashboardStats: () => {
        const { funcionarios } = get();
        const totalFuncionarios = funcionarios.length;
        const folhaSalarial = funcionarios.reduce((sum, f) => sum + f.salario, 0);
        const salarioMedio = totalFuncionarios > 0 ? folhaSalarial / totalFuncionarios : 0;
        const departamentos = new Set(funcionarios.map(f => f.departamento)).size;
        
        // Contratados nos últimos 30 dias
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        const contratadosRecente = funcionarios.filter(f => 
          new Date(f.data_admissao) >= trintaDiasAtras
        ).length;

        return {
          totalFuncionarios,
          folhaSalarial,
          salarioMedio,
          totalDepartamentos: departamentos,
          contratadosRecente
        };
      },

      getDepartamentoStats: () => {
        const { funcionarios } = get();
        const folhaSalarial = funcionarios.reduce((sum, f) => sum + f.salario, 0);
        
        const deptMap = new Map<string, { custo: number; funcionarios: Funcionario[] }>();
        
        for (const func of funcionarios) {
          if (!deptMap.has(func.departamento)) {
            deptMap.set(func.departamento, { custo: 0, funcionarios: [] });
          }
          const dept = deptMap.get(func.departamento)!;
          dept.custo += func.salario;
          dept.funcionarios.push(func);
        }

        return Array.from(deptMap.entries())
          .map(([nome, data]) => ({
            nome,
            custoTotal: data.custo,
            salarioMedio: data.funcionarios.length > 0 ? data.custo / data.funcionarios.length : 0,
            funcionarios: data.funcionarios.length,
            percentual: folhaSalarial > 0 ? (data.custo / folhaSalarial) * 100 : 0
          }))
          .sort((a, b) => b.custoTotal - a.custoTotal);
      },

      getFuncionariosPorDepartamento: (dept) => {
        return get().funcionarios.filter(f => f.departamento === dept);
      },

      getFuncionariosRecentes: (dias) => {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - dias);
        
        return get().funcionarios
          .filter(f => new Date(f.data_admissao) >= dataLimite)
          .sort((a, b) => new Date(b.data_admissao).getTime() - new Date(a.data_admissao).getTime());
      },

      exportToCSV: () => {
        const { funcionarios } = get();
        const headers = ['nome', 'email', 'telefone', 'departamento', 'cargo', 'salario', 'data_admissao', 'status', 'observacoes'];
        
        const rows = funcionarios.map(f => [
          f.nome,
          f.email,
          f.telefone,
          f.departamento,
          f.cargo,
          f.salario,
          f.data_admissao,
          f.status,
          f.observacoes
        ]);

        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      }
    }),
    {
      name: 'funcionario-store-v2',
    }
  )
);
