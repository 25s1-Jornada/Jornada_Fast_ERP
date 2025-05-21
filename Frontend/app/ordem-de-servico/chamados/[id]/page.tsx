import { notFound } from "next/navigation"
import { ChamadoDetalhes } from "../chamado-detalhes"

// Função para simular a busca de um chamado pelo ID
async function getChamado(id: string) {
  // Dados de exemplo
  const chamados = [
    {
      id: "1",
      cliente: {
        id: "1",
        nome: "João Silva",
        contato: "Maria Silva",
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP",
      },
      tecnico: {
        id: "1",
        nome: "Carlos Oliveira",
        empresa: "TechSupport Ltda",
        telefone: "(11) 98765-4321",
      },
      dataAbertura: "15/05/2023",
      dataVisita: "18/05/2023",
      status: "concluido",
      descricoes: [
        {
          id: "1",
          numeroSerie: "SN12345",
          defeito: "Refrigeração",
          observacao: "Equipamento não está refrigerando adequadamente.",
        },
        {
          id: "2",
          numeroSerie: "SN67890",
          defeito: "Refrigeração",
          observacao: "Vazamento de gás identificado.",
        },
      ],
      custos: {
        deslocamento: {
          hrSaidaEmpresa: "08:00",
          hrChegadaCliente: "09:30",
          hrSaidaCliente: "14:00",
          hrChegadaEmpresa: "15:30",
          totalHoras: "5.5",
          totalValor: "275.00",
        },
        horaTrabalhada: {
          hrInicio: "09:30",
          hrTermino: "14:00",
          totalHoras: "4.5",
          totalValor: "225.00",
        },
        km: {
          km: "45",
          valorPorKm: "1.50",
          totalValor: "67.50",
        },
        materiais: [
          {
            id: "1",
            material: "Gás refrigerante",
            quantidade: "2",
            valorUnitario: "45.00",
            totalValor: "90.00",
          },
          {
            id: "2",
            material: "Filtro",
            quantidade: "1",
            valorUnitario: "35.00",
            totalValor: "35.00",
          },
        ],
        valorTotal: "692.50",
      },
    },
    {
      id: "2",
      cliente: {
        id: "2",
        nome: "Empresa ABC Ltda",
        contato: "Carlos Souza",
        telefone: "(11) 91234-5678",
        endereco: "Av. Paulista, 1500",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        uf: "SP",
      },
      tecnico: {
        id: "2",
        nome: "Ana Silva",
        empresa: "Manutenção Express",
        telefone: "(21) 97654-3210",
      },
      dataAbertura: "22/06/2023",
      dataVisita: "25/06/2023",
      status: "em_andamento",
      descricoes: [
        {
          id: "3",
          numeroSerie: "IL789",
          defeito: "Iluminação",
          observacao: "Luzes piscando intermitentemente.",
        },
      ],
      custos: {
        deslocamento: {
          hrSaidaEmpresa: "09:00",
          hrChegadaCliente: "10:00",
          hrSaidaCliente: "12:00",
          hrChegadaEmpresa: "13:00",
          totalHoras: "4.0",
          totalValor: "200.00",
        },
        horaTrabalhada: {
          hrInicio: "10:00",
          hrTermino: "12:00",
          totalHoras: "2.0",
          totalValor: "100.00",
        },
        km: {
          km: "30",
          valorPorKm: "1.50",
          totalValor: "45.00",
        },
        materiais: [
          {
            id: "3",
            material: "Reator eletrônico",
            quantidade: "2",
            valorUnitario: "25.00",
            totalValor: "50.00",
          },
        ],
        valorTotal: "395.00",
      },
    },
    {
      id: "3",
      cliente: {
        id: "3",
        nome: "Comércio XYZ",
        contato: "Ana Oliveira",
        telefone: "(21) 98888-7777",
        endereco: "Rua do Comércio, 45",
        bairro: "Centro",
        cidade: "Rio de Janeiro",
        uf: "RJ",
      },
      tecnico: {
        id: "3",
        nome: "Roberto Santos",
        empresa: "Fix IT Soluções",
        telefone: "(31) 96543-2109",
      },
      dataAbertura: "10/07/2023",
      dataVisita: "",
      status: "aberto",
      descricoes: [
        {
          id: "4",
          numeroSerie: "EST123",
          defeito: "Estrutura",
          observacao: "Suporte de parede com folga.",
        },
      ],
      custos: {
        deslocamento: {
          hrSaidaEmpresa: "",
          hrChegadaCliente: "",
          hrSaidaCliente: "",
          hrChegadaEmpresa: "",
          totalHoras: "0",
          totalValor: "0",
        },
        horaTrabalhada: {
          hrInicio: "",
          hrTermino: "",
          totalHoras: "0",
          totalValor: "0",
        },
        km: {
          km: "0",
          valorPorKm: "1.50",
          totalValor: "0",
        },
        materiais: [],
        valorTotal: "0",
      },
    },
  ]

  const chamado = chamados.find((c) => c.id === id)

  if (!chamado) {
    return null
  }

  return chamado
}

export default async function ChamadoPage({ params }: { params: { id: string } }) {
  const chamado = await getChamado(params.id)

  if (!chamado) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Chamado #{chamado.id}</h1>
      <ChamadoDetalhes chamado={chamado} />
    </div>
  )
}
