"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Edit } from "lucide-react"

// Tipos para os dados do chamado
interface Cliente {
  id: string
  nome: string
  contato: string
  telefone: string
  endereco: string
  bairro: string
  cidade: string
  uf: string
}

interface Tecnico {
  id: string
  nome: string
  empresa: string
  telefone: string
}

interface Descricao {
  id: string
  numeroSerie: string
  defeito: string
  observacao: string
}

interface Material {
  id: string
  material: string
  quantidade: string
  valorUnitario: string
  totalValor: string
}

interface Custos {
  deslocamento: {
    hrSaidaEmpresa: string
    hrChegadaCliente: string
    hrSaidaCliente: string
    hrChegadaEmpresa: string
    totalHoras: string
    totalValor: string
  }
  horaTrabalhada: {
    hrInicio: string
    hrTermino: string
    totalHoras: string
    totalValor: string
  }
  km: {
    km: string
    valorPorKm: string
    totalValor: string
  }
  materiais: Material[]
  valorTotal: string
}

interface Chamado {
  id: string
  cliente: Cliente
  tecnico: Tecnico
  dataAbertura: string
  dataVisita: string
  status: string
  descricoes: Descricao[]
  custos: Custos
}

interface ChamadoDetalhesProps {
  chamado: Chamado
}

export function ChamadoDetalhes({ chamado }: ChamadoDetalhesProps) {
  const [activeTab, setActiveTab] = useState("descricao")

  // Função para renderizar o status com a cor apropriada
  const renderStatus = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "em_andamento":
        return <Badge className="bg-blue-500">Em Andamento</Badge>
      case "aberto":
        return <Badge className="bg-yellow-500">Aberto</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chamados">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            Cliente: {chamado.cliente.nome} | Técnico: {chamado.tecnico.nome}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>Data de Abertura: {chamado.dataAbertura}</div>
            <div>Status: {renderStatus(chamado.status)}</div>
          </div>
        </div>
        <Link href={`/chamados/${chamado.id}/editar`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Chamado
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="descricao">DESCRIÇÃO DO CHAMADO</TabsTrigger>
          <TabsTrigger value="custos">CUSTOS SERVIÇO</TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba DESCRIÇÃO DO CHAMADO */}
        <TabsContent value="descricao" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Descrições</h3>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Descrição
            </Button>
          </div>

          {chamado.descricoes.map((descricao) => (
            <Card key={descricao.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">N° Série:</p>
                    <p>{descricao.numeroSerie}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Defeito:</p>
                    <p>{descricao.defeito}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium">Observação:</p>
                    <p>{descricao.observacao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Conteúdo da aba CUSTOS SERVIÇO */}
        <TabsContent value="custos" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Data Visita: {chamado.dataVisita || "Não agendada"}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custos de Deslocamento */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Custos Deslocamento</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Custos de Deslocamento</DialogTitle>
                        <DialogDescription>Detalhes dos custos de deslocamento</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <p className="text-sm font-medium">Hr Saída Empresa:</p>
                          <p>{chamado.custos.deslocamento.hrSaidaEmpresa || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hr Chegada Cliente:</p>
                          <p>{chamado.custos.deslocamento.hrChegadaCliente || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hr Saída Cliente:</p>
                          <p>{chamado.custos.deslocamento.hrSaidaCliente || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hr Chegada Empresa:</p>
                          <p>{chamado.custos.deslocamento.hrChegadaEmpresa || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Hr:</p>
                          <p>{chamado.custos.deslocamento.totalHoras || "0"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total R$:</p>
                          <p>R$ {chamado.custos.deslocamento.totalValor || "0,00"}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-right font-medium">R$ {chamado.custos.deslocamento.totalValor || "0,00"}</div>
              </CardContent>
            </Card>

            {/* Custos Hora Trabalhada */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Custos Hora Trabalhada</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Custos de Hora Trabalhada</DialogTitle>
                        <DialogDescription>Detalhes dos custos de hora trabalhada</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <p className="text-sm font-medium">Hr Início:</p>
                          <p>{chamado.custos.horaTrabalhada.hrInicio || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hr Término:</p>
                          <p>{chamado.custos.horaTrabalhada.hrTermino || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Hr:</p>
                          <p>{chamado.custos.horaTrabalhada.totalHoras || "0"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total R$:</p>
                          <p>R$ {chamado.custos.horaTrabalhada.totalValor || "0,00"}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-right font-medium">R$ {chamado.custos.horaTrabalhada.totalValor || "0,00"}</div>
              </CardContent>
            </Card>

            {/* Custos KM */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Custos KM</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Custos de Quilometragem</DialogTitle>
                        <DialogDescription>Detalhes dos custos de quilometragem</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <p className="text-sm font-medium">KM:</p>
                          <p>{chamado.custos.km.km || "0"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">R$/KM:</p>
                          <p>R$ {chamado.custos.km.valorPorKm || "0,00"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total R$:</p>
                          <p>R$ {chamado.custos.km.totalValor || "0,00"}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-right font-medium">R$ {chamado.custos.km.totalValor || "0,00"}</div>
              </CardContent>
            </Card>

            {/* Despesas c/ Materiais */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Despesas c/ Materiais</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Despesas com Materiais</DialogTitle>
                        <DialogDescription>Detalhes das despesas com materiais</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Valor Unit.</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {chamado.custos.materiais.length > 0 ? (
                              chamado.custos.materiais.map((material) => (
                                <TableRow key={material.id}>
                                  <TableCell>{material.material}</TableCell>
                                  <TableCell>{material.quantidade}</TableCell>
                                  <TableCell>R$ {material.valorUnitario}</TableCell>
                                  <TableCell className="text-right">R$ {material.totalValor}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                  Nenhum material registrado
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-right font-medium">
                  R${" "}
                  {chamado.custos.materiais
                    .reduce((total, material) => total + Number.parseFloat(material.totalValor), 0)
                    .toFixed(2) || "0,00"}
                </div>
              </CardContent>
            </Card>

            {/* Valor Total */}
            <Card className="md:col-span-2 bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Valor Total R$</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right text-xl font-bold">R$ {chamado.custos.valorTotal || "0,00"}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
