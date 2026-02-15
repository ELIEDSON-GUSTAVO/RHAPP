export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  departamento: string;
  cargo: string;
  salario: number;
  data_admissao: string;
  status: 'Ativo' | 'Inativo' | 'Férias';
  observacoes: string;
}

export interface DepartamentoStats {
  nome: string;
  custoTotal: number;
  salarioMedio: number;
  funcionarios: number;
  percentual: number;
}

export interface DashboardStats {
  totalFuncionarios: number;
  folhaSalarial: number;
  salarioMedio: number;
  totalDepartamentos: number;
  contratadosRecente: number;
}

export type ViewType = 'dashboard' | 'funcionarios' | 'relatorios';
