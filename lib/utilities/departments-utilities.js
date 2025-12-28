export const departments = [
  {
    id: 1,
    codigo: 'CSH',
    nome: 'Ciências Sociais e Humanas',
    areaCientifica: 'Humanidades',
    chefe: 'Dr. João Silva',
    numeroDocentes: 45,
    numeroCursos: 8,
    numeroEstudantes: 1250,
    orcamento: 12500000,
    estado: 'ativo',
    dataCriacao: '2010-03-15',
    avaliacaoQualidade: 4.8,
    ultimaAuditoria: '2023-11-20'
  },
  {
    id: 2,
    codigo: 'ENG',
    nome: 'Engenharia',
    areaCientifica: 'Engenharias e Tecnologias',
    chefe: 'Prof. Maria Santos',
    numeroDocentes: 38,
    numeroCursos: 6,
    numeroEstudantes: 980,
    orcamento: 9800000,
    estado: 'ativo',
    dataCriacao: '2011-06-10',
    avaliacaoQualidade: 4.6,
    ultimaAuditoria: '2023-10-15'
  },
  {
    id: 3,
    codigo: 'SAU',
    nome: 'Saúde',
    areaCientifica: 'Ciências da Saúde',
    chefe: 'Dra. Ana Oliveira',
    numeroDocentes: 52,
    numeroCursos: 7,
    numeroEstudantes: 850,
    orcamento: 15000000,
    estado: 'ativo',
    dataCriacao: '2012-09-20',
    avaliacaoQualidade: 4.9,
    ultimaAuditoria: '2023-12-05'
  },
  {
    id: 4,
    codigo: 'GES',
    nome: 'Gestão e Economia',
    areaCientifica: 'Ciências Sociais Aplicadas',
    chefe: 'Prof. Carlos Mendes',
    numeroDocentes: 32,
    numeroCursos: 5,
    numeroEstudantes: 720,
    orcamento: 8500000,
    estado: 'ativo',
    dataCriacao: '2013-01-30',
    avaliacaoQualidade: 4.5,
    ultimaAuditoria: '2023-09-18'
  },
  {
    id: 5,
    codigo: 'ART',
    nome: 'Artes e Design',
    areaCientifica: 'Artes e Humanidades',
    chefe: 'Prof. Luísa Fernandes',
    numeroDocentes: 28,
    numeroCursos: 4,
    numeroEstudantes: 450,
    orcamento: 6500000,
    estado: 'ativo',
    dataCriacao: '2014-03-25',
    avaliacaoQualidade: 4.7,
    ultimaAuditoria: '2023-11-10'
  },
  {
    id: 6,
    codigo: 'DIR',
    nome: 'Direito',
    areaCientifica: 'Ciências Jurídicas',
    chefe: 'Dr. Miguel Costa',
    numeroDocentes: 25,
    numeroCursos: 3,
    numeroEstudantes: 680,
    orcamento: 7500000,
    estado: 'em_reestruturacao',
    dataCriacao: '2015-08-12',
    avaliacaoQualidade: 4.2,
    ultimaAuditoria: '2023-08-22'
  }
]

export const areasCientificas = [
  'Todas as áreas',
  'Humanidades',
  'Engenharias e Tecnologias',
  'Ciências da Saúde',
  'Ciências Sociais Aplicadas',
  'Artes e Humanidades',
  'Ciências Jurídicas',
  'Ciências Exatas'
]

export const statusOptions = [
  'Todos os estados',
  'ativo',
  'inativo',
  'em_reestruturacao',
  'em_implementacao'
]