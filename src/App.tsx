import { useFuncionarioStore } from '@/store/useFuncionarioStore';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/sections/Dashboard';
import { FuncionariosView } from '@/sections/FuncionariosView';
import { RelatoriosView } from '@/sections/RelatoriosView';
import { DepartamentoDetail } from '@/sections/DepartamentoDetail';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { viewAtual, departamentoSelecionado } = useFuncionarioStore();

  // Se um departamento está selecionado, mostrar o detalhe
  if (departamentoSelecionado) {
    return (
      <div className="flex h-screen bg-[#1E1E1E] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <DepartamentoDetail />
        </main>
        <Toaster />
      </div>
    );
  }

  const renderContent = () => {
    switch (viewAtual) {
      case 'dashboard':
        return <Dashboard />;
      case 'funcionarios':
        return <FuncionariosView />;
      case 'relatorios':
        return <RelatoriosView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1E1E] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
