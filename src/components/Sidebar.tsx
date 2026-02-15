import { useFuncionarioStore } from '@/store/useFuncionarioStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'funcionarios', label: 'Funcionários', icon: Users },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
];

export function Sidebar() {
  const { viewAtual, setViewAtual, getDashboardStats, setDepartamentoSelecionado } = useFuncionarioStore();
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('pt-BR'));
  
  const stats = getDashboardStats();

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    window.location.reload();
  };

  const handleNavigation = (view: string) => {
    setDepartamentoSelecionado(null);
    setViewAtual(view as any);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <aside className="w-72 bg-[#151515] text-white flex flex-col border-r border-[#333]">
      {/* Header */}
      <div className="p-6 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">RH System</h1>
            <p className="text-xs text-gray-400">Gestão de Pessoas</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">Menu</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = viewAtual === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavigation(item.id)}
              className={cn(
                'w-full justify-start gap-3 text-left transition-all duration-300',
                isActive
                  ? 'bg-[#FF0000]/20 text-[#FF0000] border-l-2 border-[#FF0000]'
                  : 'text-gray-300 hover:bg-[#2D2D2D] hover:text-white'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'animate-pulse')} />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Stats Summary */}
      <div className="p-4 border-t border-[#333]">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Resumo</p>
        
        <div className="space-y-3">
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#333]">
            <p className="text-xs text-gray-400">Total de Funcionários</p>
            <p className="text-xl font-bold text-[#FF0000]">{stats.totalFuncionarios}</p>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#333]">
            <p className="text-xs text-gray-400">Folha Salarial</p>
            <p className="text-lg font-bold text-[#FF6B6B]">{formatCurrency(stats.folhaSalarial)}</p>
          </div>
          
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#333]">
            <p className="text-xs text-gray-400">Último Update</p>
            <p className="text-sm font-medium text-gray-300">{lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#333]">
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="w-full border-[#444] text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>
    </aside>
  );
}
