"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface DefeitoEquipamento {
  id: string
  numeroSerie: string
  categoriaProblema: string
  defeitos: {
    refrigeracao: {
      queimado: boolean
      emMassa: boolean
      emCurto: boolean
      correnteAlta: boolean
      naoParte: boolean
      semCompressao: boolean
      travadoSujo: boolean
      comBarulho: boolean
      naoSucciona: boolean
      desarmando: boolean
      nPonto: boolean
      naoGelado: boolean
      filtroEntupido: boolean
      capilarObstruido: boolean
      micromorQuebrado: boolean
      micromorTravado: boolean
      controladorQueimado: boolean
      regulagemParametros: boolean
    }
    iluminacao: {
      lampadaQueimada: boolean
      semAlimentacao: boolean
      emCurto: boolean
    }
    estrutura: {
      perfilCurvoVidro: boolean
      perfilSuporteIlum: boolean
      lenteVedacao: boolean
      perfilPortaEsquerda: boolean
      perfilPortaDireita: boolean
      pivotadorParaboque: boolean
      pontaParaboque: boolean
      cantoGeral: boolean
      acriloGeral: boolean
      perfilFrontal: boolean
      paraboqueFrontal: boolean
      paraboqueLateral: boolean
    }
    outros: {
      eletrico: boolean
      hidraulico: boolean
      mecanico: boolean
      software: boolean
      limpeza: boolean
      manutencaoPreventiva: boolean
    }
  }
  observacoes: string
}

interface ConfirmacaoAtendimento {
  data: string
  nomeLegivel: string
  telefone: string
  carimbo: string
}

interface DescricaoDefeitoData {
  confirmacaoAtendimento: ConfirmacaoAtendimento
  equipamentos: DefeitoEquipamento[]
  servicoFinalizado: boolean | null
  pendencia: string
}

interface DescricaoDefeitoFormProps {
  onSalvar: (data: DescricaoDefeitoData) => void
  dadosIniciais?: DescricaoDefeitoData
}

const categoriasProblema = [
  { value: "refrigeracao", label: "Refrigeração" },
  { value: "iluminacao", label: "Iluminação" },
  { value: "estrutura", label: "Estrutura" },
  { value: "outros", label: "Outros" },
]

export function DescricaoDefeitoForm({ onSalvar, dadosIniciais }: DescricaoDefeitoFormProps) {
  const [formData, setFormData] = useState<DescricaoDefeitoData>(
    dadosIniciais || {
      confirmacaoAtendimento: {
        data: new Date().toISOString().split("T")[0],
        nomeLegivel: "",
        telefone: "",
        carimbo: "",
      },
      equipamentos: [
        {
          id: "eq-1",
          numeroSerie: "",
          categoriaProblema: "",
          defeitos: {
            refrigeracao: {
              queimado: false,
              emMassa: false,
              emCurto: false,
              correnteAlta: false,
              naoParte: false,
              semCompressao: false,
              travadoSujo: false,
              comBarulho: false,
              naoSucciona: false,
              desarmando: false,
              nPonto: false,
              naoGelado: false,
              filtroEntupido: false,
              capilarObstruido: false,
              micromorQuebrado: false,
              micromorTravado: false,
              controladorQueimado: false,
              regulagemParametros: false,
            },
            iluminacao: {
              lampadaQueimada: false,
              semAlimentacao: false,
              emCurto: false,
            },
            estrutura: {
              perfilCurvoVidro: false,
              perfilSuporteIlum: false,
              lenteVedacao: false,
              perfilPortaEsquerda: false,
              perfilPortaDireita: false,
              pivotadorParaboque: false,
              pontaParaboque: false,
              cantoGeral: false,
              acriloGeral: false,
              perfilFrontal: false,
              paraboqueFrontal: false,
              paraboqueLateral: false,
            },
            outros: {
              eletrico: false,
              hidraulico: false,
              mecanico: false,
              software: false,
              limpeza: false,
              manutencaoPreventiva: false,
            },
          },
          observacoes: "",
        },
      ],
      servicoFinalizado: null,
      pendencia: "",
    },
  )

  const handleConfirmacaoChange = (field: keyof ConfirmacaoAtendimento, value: string) => {
    setFormData({
      ...formData,
      confirmacaoAtendimento: {
        ...formData.confirmacaoAtendimento,
        [field]: value,
      },
    })
  }

  const handleAddEquipamento = () => {
    const novoEquipamento: DefeitoEquipamento = {
      id: `eq-${Date.now()}`,
      numeroSerie: "",
      categoriaProblema: "",
      defeitos: {
        refrigeracao: {
          queimado: false,
          emMassa: false,
          emCurto: false,
          correnteAlta: false,
          naoParte: false,
          semCompressao: false,
          travadoSujo: false,
          comBarulho: false,
          naoSucciona: false,
          desarmando: false,
          nPonto: false,
          naoGelado: false,
          filtroEntupido: false,
          capilarObstruido: false,
          micromorQuebrado: false,
          micromorTravado: false,
          controladorQueimado: false,
          regulagemParametros: false,
        },
        iluminacao: {
          lampadaQueimada: false,
          semAlimentacao: false,
          emCurto: false,
        },
        estrutura: {
          perfilCurvoVidro: false,
          perfilSuporteIlum: false,
          lenteVedacao: false,
          perfilPortaEsquerda: false,
          perfilPortaDireita: false,
          pivotadorParaboque: false,
          pontaParaboque: false,
          cantoGeral: false,
          acriloGeral: false,
          perfilFrontal: false,
          paraboqueFrontal: false,
          paraboqueLateral: false,
        },
        outros: {
          eletrico: false,
          hidraulico: false,
          mecanico: false,
          software: false,
          limpeza: false,
          manutencaoPreventiva: false,
        },
      },
      observacoes: "",
    }

    setFormData({
      ...formData,
      equipamentos: [...formData.equipamentos, novoEquipamento],
    })
  }

  const handleRemoveEquipamento = (id: string) => {
    setFormData({
      ...formData,
      equipamentos: formData.equipamentos.filter((eq) => eq.id !== id),
    })
  }

  const handleEquipamentoChange = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      equipamentos: formData.equipamentos.map((eq) => {
        if (eq.id === id) {
          if (field === "numeroSerie" || field === "observacoes" || field === "categoriaProblema") {
            return { ...eq, [field]: value }
          } else {
            // Para defeitos aninhados
            const [categoria, subcategoria] = field.split(".")
            return {
              ...eq,
              defeitos: {
                ...eq.defeitos,
                [categoria]: {
                  ...eq.defeitos[categoria as keyof typeof eq.defeitos],
                  [subcategoria]: value,
                },
              },
            }
          }
        }
        return eq
      }),
    })
  }

  const renderDefeitosCategoria = (equipamento: DefeitoEquipamento) => {
    const categoria = equipamento.categoriaProblema

    if (!categoria) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>Selecione uma categoria do problema para exibir as opções de defeitos</p>
        </div>
      )
    }

    switch (categoria) {
      case "refrigeracao":
        return (
          <div className="space-y-4">
            {/* Compressor */}
            <div>
              <h5 className="font-medium text-sm mb-2 text-muted-foreground">Compressor</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {Object.entries({
                  queimado: "Queimado",
                  emMassa: "Em Massa",
                  emCurto: "Em Curto",
                  correnteAlta: "Corrente Alta",
                  naoParte: "Não Parte",
                  semCompressao: "Sem Compressão",
                  travadoSujo: "Travado Sujo",
                  comBarulho: "Com Barulho",
                  naoSucciona: "Não Succiona",
                  desarmando: "Desarmando",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${equipamento.id}-refrigeracao-${key}`}
                      checked={equipamento.defeitos.refrigeracao[key as keyof typeof equipamento.defeitos.refrigeracao]}
                      onCheckedChange={(checked) =>
                        handleEquipamentoChange(equipamento.id, `refrigeracao.${key}`, checked)
                      }
                    />
                    <Label
                      htmlFor={`${equipamento.id}-refrigeracao-${key}`}
                      className="text-xs sm:text-sm leading-tight"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Vazamento */}
            <div>
              <h5 className="font-medium text-sm mb-2 text-muted-foreground">Vazamento</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries({
                  nPonto: "N° Ponto",
                  naoGelado: "Não Gelado",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${equipamento.id}-refrigeracao-${key}`}
                      checked={equipamento.defeitos.refrigeracao[key as keyof typeof equipamento.defeitos.refrigeracao]}
                      onCheckedChange={(checked) =>
                        handleEquipamentoChange(equipamento.id, `refrigeracao.${key}`, checked)
                      }
                    />
                    <Label htmlFor={`${equipamento.id}-refrigeracao-${key}`} className="text-xs sm:text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Outros (dentro de Refrigeração) */}
            <div>
              <h5 className="font-medium text-sm mb-2 text-muted-foreground">Outros</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {Object.entries({
                  filtroEntupido: "Filtro Entupido",
                  capilarObstruido: "Capilar Obstruído",
                  micromorQuebrado: "Micromor Quebrado",
                  micromorTravado: "Micromor Travado",
                  controladorQueimado: "Controlador Queimado",
                  regulagemParametros: "Regulagem Parâmetros",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${equipamento.id}-refrigeracao-${key}`}
                      checked={equipamento.defeitos.refrigeracao[key as keyof typeof equipamento.defeitos.refrigeracao]}
                      onCheckedChange={(checked) =>
                        handleEquipamentoChange(equipamento.id, `refrigeracao.${key}`, checked)
                      }
                    />
                    <Label
                      htmlFor={`${equipamento.id}-refrigeracao-${key}`}
                      className="text-xs sm:text-sm leading-tight"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "iluminacao":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries({
              lampadaQueimada: "Lâmpada Queimada",
              semAlimentacao: "Sem Alimentação",
              emCurto: "Em Curto",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`${equipamento.id}-iluminacao-${key}`}
                  checked={equipamento.defeitos.iluminacao[key as keyof typeof equipamento.defeitos.iluminacao]}
                  onCheckedChange={(checked) => handleEquipamentoChange(equipamento.id, `iluminacao.${key}`, checked)}
                />
                <Label htmlFor={`${equipamento.id}-iluminacao-${key}`} className="text-xs sm:text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        )

      case "estrutura":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {Object.entries({
              perfilCurvoVidro: "01-Perfil Curvo Vidro",
              perfilSuporteIlum: "02-Perfil Suporte Ilum.",
              lenteVedacao: "03-Lente Vedação",
              perfilPortaEsquerda: "04-Perfil Porta Esquerda",
              perfilPortaDireita: "05-Perfil Porta Direita",
              pivotadorParaboque: "06-Pivotador Paraboque",
              pontaParaboque: "07-Ponta Paraboque",
              cantoGeral: "08-Canto Geral",
              acriloGeral: "09-Acrilo Geral",
              perfilFrontal: "10-Perfil Frontal",
              paraboqueFrontal: "11-Paraboque Frontal",
              paraboqueLateral: "12-Paraboque Lateral",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`${equipamento.id}-estrutura-${key}`}
                  checked={equipamento.defeitos.estrutura[key as keyof typeof equipamento.defeitos.estrutura]}
                  onCheckedChange={(checked) => handleEquipamentoChange(equipamento.id, `estrutura.${key}`, checked)}
                />
                <Label htmlFor={`${equipamento.id}-estrutura-${key}`} className="text-xs sm:text-sm leading-tight">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        )

      case "outros":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries({
              eletrico: "Elétrico",
              hidraulico: "Hidráulico",
              mecanico: "Mecânico",
              software: "Software",
              limpeza: "Limpeza",
              manutencaoPreventiva: "Manutenção Preventiva",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`${equipamento.id}-outros-${key}`}
                  checked={equipamento.defeitos.outros[key as keyof typeof equipamento.defeitos.outros]}
                  onCheckedChange={(checked) => handleEquipamentoChange(equipamento.id, `outros.${key}`, checked)}
                />
                <Label htmlFor={`${equipamento.id}-outros-${key}`} className="text-xs sm:text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const handleSubmit = () => {
    onSalvar(formData)
  }

  return (
    <div className="space-y-6">
      {/* Confirmação do Atendimento */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmação do atendimento (Cliente)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data:</Label>
              <Input
                id="data"
                type="date"
                value={formData.confirmacaoAtendimento.data}
                onChange={(e) => handleConfirmacaoChange("data", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeLegivel">Nome (Legível):</Label>
              <Input
                id="nomeLegivel"
                value={formData.confirmacaoAtendimento.nomeLegivel}
                onChange={(e) => handleConfirmacaoChange("nomeLegivel", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone:</Label>
              <Input
                id="telefone"
                value={formData.confirmacaoAtendimento.telefone}
                onChange={(e) => handleConfirmacaoChange("telefone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carimbo">Carimbo:</Label>
              <Input
                id="carimbo"
                value={formData.confirmacaoAtendimento.carimbo}
                onChange={(e) => handleConfirmacaoChange("carimbo", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descrição do Defeito */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">DESCRIÇÃO DO DEFEITO (Técnico)</CardTitle>
            <Button onClick={handleAddEquipamento} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Equipamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Equipamentos */}
            {formData.equipamentos.map((equipamento, index) => (
              <div key={equipamento.id} className="border rounded-lg p-3 sm:p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`serie-${index}`} className="text-sm font-medium">
                          N° Série:
                        </Label>
                        <Input
                          id={`serie-${index}`}
                          value={equipamento.numeroSerie}
                          onChange={(e) => handleEquipamentoChange(equipamento.id, "numeroSerie", e.target.value)}
                          placeholder="Digite o número de série"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`categoria-${index}`} className="text-sm font-medium">
                          Categoria do Problema:
                        </Label>
                        <Select
                          value={equipamento.categoriaProblema}
                          onValueChange={(value) => handleEquipamentoChange(equipamento.id, "categoriaProblema", value)}
                        >
                          <SelectTrigger id={`categoria-${index}`}>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriasProblema.map((categoria) => (
                              <SelectItem key={categoria.value} value={categoria.value}>
                                {categoria.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEquipamento(equipamento.id)}
                    disabled={formData.equipamentos.length === 1}
                    className="self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Descrição dos Defeitos baseada na categoria selecionada */}
                <div className="border rounded-md p-3">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">
                    {equipamento.categoriaProblema
                      ? `Descrição dos Defeitos - ${
                          categoriasProblema.find((c) => c.value === equipamento.categoriaProblema)?.label
                        }`
                      : "Descrição dos Defeitos"}
                  </h4>
                  {renderDefeitosCategoria(equipamento)}
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor={`obs-${index}`} className="text-sm font-medium">
                    Observações:
                  </Label>
                  <Textarea
                    id={`obs-${index}`}
                    value={equipamento.observacoes}
                    onChange={(e) => handleEquipamentoChange(equipamento.id, "observacoes", e.target.value)}
                    rows={3}
                    placeholder="Digite observações sobre este equipamento..."
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Finalização do Serviço */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Label className="text-sm font-medium">Serviço finalizado?</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sim"
                    checked={formData.servicoFinalizado === true}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, servicoFinalizado: checked ? true : null })
                    }
                  />
                  <Label htmlFor="sim" className="text-sm">
                    Sim
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nao"
                    checked={formData.servicoFinalizado === false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, servicoFinalizado: checked ? false : null })
                    }
                  />
                  <Label htmlFor="nao" className="text-sm">
                    Não
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pendencia">Qual pendência? (Descrever abaixo)</Label>
              <Textarea
                id="pendencia"
                value={formData.pendencia}
                onChange={(e) => setFormData({ ...formData, pendencia: e.target.value })}
                rows={4}
                placeholder="Descreva as pendências ou observações finais..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          Salvar Descrição do Defeito
        </Button>
      </div>
    </div>
  )
}
