// app/relatorios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import jsPDF from 'jspdf';

export default function RelatoriosPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('documentos');
  const [estatisticas, setEstatisticas] = useState<any>(null);

  // Valores padrão para datas
  useEffect(() => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: usuario } = await supabase
        .from('usuario')
        .select('role(name)')
        .eq('auth_user_id', user.id)
        .single();

      setUserInfo(usuario);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const gerarRelatorio = async () => {
    try {
      setLoading(true);

      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);

      let dados: any = {};

      switch (tipoRelatorio) {
        case 'documentos':
          // Estatísticas de documentos
          const { data: documentos } = await supabase
            .from('documento')
            .select(`
              *,
              tipo_documento(nome),
              usuario:nome
            `)
            .gte('created_at', inicio.toISOString())
            .lte('created_at', fim.toISOString());

          const porStatus = documentos?.reduce((acc: any, doc:any) => {
            acc[doc.status] = (acc[doc.status] || 0) + 1;
            return acc;
          }, {});

          const porTipo = documentos?.reduce((acc: any, doc:any) => {
            const tipo = doc.tipo_documento?.nome || 'Sem tipo';
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
          }, {});

          dados = {
            total: documentos?.length || 0,
            porStatus,
            porTipo,
            documentos: documentos || []
          };
          break;

        case 'usuarios':
          // Estatísticas de usuários
          const { data: usuarios } = await supabase
            .from('usuario')
            .select(`
              *,
              cargo(nome),
              role(name)
            `)
            .gte('created_at', inicio.toISOString())
            .lte('created_at', fim.toISOString());

          const porCargo = usuarios?.reduce((acc: any, user:any) => {
            const cargo = user.cargo?.nome || 'Sem cargo';
            acc[cargo] = (acc[cargo] || 0) + 1;
            return acc;
          }, {});

          const porStatusUsuario = usuarios?.reduce((acc: any, user:any) => {
            acc[user.ativo ? 'Ativos' : 'Inativos'] = (acc[user.ativo ? 'Ativos' : 'Inativos'] || 0) + 1;
            return acc;
          }, {});

          dados = {
            total: usuarios?.length || 0,
            porCargo,
            porStatusUsuario,
            usuarios: usuarios || []
          };
          break;

        case 'atividades':
          // Atividades do sistema
          const { data: atividades } = await supabase
            .from('documento')
            .select('created_at, status')
            .gte('created_at', inicio.toISOString())
            .lte('created_at', fim.toISOString())
            .order('created_at');

          // Agrupar por dia
          const atividadesPorDia = atividades?.reduce((acc: any, doc:any) => {
            const date = new Date(doc.created_at).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          dados = {
            atividadesPorDia,
            totalAtividades: atividades?.length || 0,
            atividades: atividades || []
          };
          break;
      }

      setEstatisticas(dados);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setLoading(false);
    }
  };

  // Função exportarPDF CORRIGIDA
  const exportarPDF = () => {
    if (!estatisticas) return;

    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Relatório do Sistema', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`,
      105,
      30,
      { align: 'center' }
    );

    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(
      `Tipo: ${tipoRelatorio === 'documentos'
        ? 'Documentos'
        : tipoRelatorio === 'usuarios'
          ? 'Usuários'
          : 'Atividades'
      }`,
      20,
      45
    );

    let yPos = 55;

    if (tipoRelatorio === 'documentos') {
      // CORREÇÃO: Converter explicitamente para o tipo correto
      const statusBody: (string | number)[][] = Object.entries(
        estatisticas.porStatus || {}
      ).map(([status, qtd]) => [
        status === 'rascunho'
          ? 'Rascunho'
          : status === 'revisao'
            ? 'Em Revisão'
            : status === 'finalizado'
              ? 'Finalizado'
              : status === 'arquivado'
                ? 'Arquivado'
                : status,
        qtd as number,
      ]);

      const tipoBody: (string | number)[][] = Object.entries(
        estatisticas.porTipo || {}
      ).map(([tipo, qtd]) => [tipo, qtd as number]);

      // Usar autoTable com tipos explícitos
      (doc as any).autoTable({
        startY: yPos,
        head: [['Status', 'Quantidade']],
        body: statusBody,
        theme: 'striped' as const,
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      // Obter a posição Y final da primeira tabela
      const finalY = (doc as any).lastAutoTable?.finalY || yPos + 100;
      yPos = finalY + 10;

      (doc as any).autoTable({
        startY: yPos,
        head: [['Tipo de Documento', 'Quantidade']],
        body: tipoBody,
        theme: 'striped' as const,
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10 },
      });
    } else if (tipoRelatorio === 'usuarios') {
      // Para usuários
      const cargoBody: (string | number)[][] = Object.entries(
        estatisticas.porCargo || {}
      ).map(([cargo, qtd]) => [cargo, qtd as number]);

      (doc as any).autoTable({
        startY: yPos,
        head: [['Cargo', 'Quantidade']],
        body: cargoBody,
        theme: 'striped' as const,
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 10 },
      });
    }

    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Relatório gerado automaticamente',
      105,
      pageHeight - 20,
      { align: 'center' }
    );
    doc.text(
      new Date().toLocaleString('pt-BR'),
      105,
      pageHeight - 15,
      { align: 'center' }
    );

    // Salvar
    doc.save(`relatorio-${tipoRelatorio}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportarExcel = () => {
    if (!estatisticas) return;

    let csvContent = "data:text/csv;charset=utf-8,";

    if (tipoRelatorio === 'documentos') {
      csvContent += "Relatório de Documentos\n";
      csvContent += `Período: ${dataInicio} a ${dataFim}\n\n`;
      csvContent += "Status,Quantidade\n";

      Object.entries(estatisticas.porStatus || {}).forEach(([status, qtd]) => {
        csvContent += `${status},${qtd}\n`;
      });

      csvContent += "\nTipo,Quantidade\n";
      Object.entries(estatisticas.porTipo || {}).forEach(([tipo, qtd]) => {
        csvContent += `${tipo},${qtd}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-${tipoRelatorio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !estatisticas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userInfo?.role?.name} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Gerencie e exporte relatórios do sistema</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurar Relatório</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Relatório
                </label>
                <select
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="documentos">Documentos</option>
                  <option value="usuarios">Usuários</option>
                  <option value="atividades">Atividades</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="hoje">Hoje</option>
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mês</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={gerarRelatorio}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Gerando...' : 'Gerar Relatório'}
              </button>

              {estatisticas && (
                <div className="space-x-3">
                  <button
                    onClick={exportarPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Exportar PDF
                  </button>
                  <button
                    onClick={exportarExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Exportar Excel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resultados */}
          {estatisticas && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resultados do Relatório
                </h2>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-bold">{estatisticas.total}</span>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="mb-8">
                {tipoRelatorio === 'documentos' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Por Status</h3>
                      <div className="space-y-2">
                        {Object.entries(estatisticas.porStatus || {}).map(([status, qtd]: [string, any]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {status === 'rascunho' ? '📝 Rascunho' :
                                status === 'revisao' ? '🔍 Em Revisão' :
                                  status === 'finalizado' ? '✅ Finalizado' :
                                    status === 'arquivado' ? '📁 Arquivado' : status}
                            </span>
                            <span className="font-medium">{qtd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Por Tipo</h3>
                      <div className="space-y-2">
                        {Object.entries(estatisticas.porTipo || {}).map(([tipo, qtd]: [string, any]) => (
                          <div key={tipo} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{tipo}</span>
                            <span className="font-medium">{qtd}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tipoRelatorio === 'usuarios' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Por Cargo</h3>
                      <div className="space-y-2">
                        {Object.entries(estatisticas.porCargo || {}).map(([cargo, qtd]: [string, any]) => (
                          <div key={cargo} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{cargo || 'Sem cargo'}</span>
                            <span className="font-medium">{qtd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Por Status</h3>
                      <div className="space-y-2">
                        {Object.entries(estatisticas.porStatusUsuario || {}).map(([status, qtd]: [string, any]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{status}</span>
                            <span className="font-medium">{qtd}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tipoRelatorio === 'atividades' && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Atividades por Dia</h3>
                    <div className="space-y-2">
                      {Object.entries(estatisticas.atividadesPorDia || {}).map(([data, qtd]: [string, any]) => (
                        <div key={data} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{data}</span>
                          <span className="font-medium">{qtd} atividades</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Gráfico de visualização */}
              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Visualização</h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-end p-4">
                  {tipoRelatorio === 'documentos' && estatisticas.porStatus && (
                    <div className="flex space-x-4 w-full">
                      {Object.entries(estatisticas.porStatus).map(([status, qtd]: [string, any], index) => {
                        const max = Math.max(...Object.values(estatisticas.porStatus) as number[]);
                        const height = (qtd / max) * 100;

                        return (
                          <div key={status} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-3/4 rounded-t-lg ${status === 'rascunho' ? 'bg-yellow-500' :
                                  status === 'revisao' ? 'bg-blue-500' :
                                    status === 'finalizado' ? 'bg-green-500' :
                                      'bg-gray-500'
                                }`}
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs mt-2 text-gray-600">{status.charAt(0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Exemplos de relatórios rápidos */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Rápidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setTipoRelatorio('documentos');
                  setPeriodo('mes');
                  gerarRelatorio();
                }}
                className="p-4 bg-white rounded-lg shadow border hover:bg-gray-50 text-left"
              >
                <h4 className="font-medium text-gray-900">Documentos deste Mês</h4>
                <p className="text-sm text-gray-600 mt-1">Resumo de documentos criados no mês atual</p>
              </button>

              <button
                onClick={() => {
                  setTipoRelatorio('usuarios');
                  setPeriodo('mes');
                  gerarRelatorio();
                }}
                className="p-4 bg-white rounded-lg shadow border hover:bg-gray-50 text-left"
              >
                <h4 className="font-medium text-gray-900">Novos Usuários</h4>
                <p className="text-sm text-gray-600 mt-1">Usuários criados no último mês</p>
              </button>

              <button
                onClick={() => {
                  setTipoRelatorio('atividades');
                  setPeriodo('semana');
                  gerarRelatorio();
                }}
                className="p-4 bg-white rounded-lg shadow border hover:bg-gray-50 text-left"
              >
                <h4 className="font-medium text-gray-900">Atividades da Semana</h4>
                <p className="text-sm text-gray-600 mt-1">Atividades dos últimos 7 dias</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}