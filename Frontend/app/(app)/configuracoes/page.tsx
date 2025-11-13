"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ValoresPadrao {
  deslocamento: {
    valorPorHora: string
  }
  quilometragem: {
    valorPorKm: string
  }
  horasTrabalhadas: {
    valorPorHora: string
  }
}

interface DefeitoEspecifico {
  id: string
  nome: string
  categoria: string
}

const STORAGE_KEY_VALORES = "configuracoes_valores_padrao"
const STORAGE_KEY_DEFEITOS = "configuracoes_defeitos_especificos"

export default function ConfiguracoesPage() {
  const { toast } = useToast()

  const [valoresPadrao, setValoresPadrao] = useState<ValoresPadrao>({
    deslocamento: { valorPorHora: "50.00" },
    quilometragem: { valorPorKm: "1.50" },
    horasTrabalhadas: { valorPorHora: "50.00" },
  })

  const [defeitosEspecificos, setDefeitosEspecificos] = useState<DefeitoEspecifico[]>([
    { id: "1", nome: "Queimado", categoria: "refrigeracao" },
    { id: "2", nome: "Em Massa", categoria: "refrigeracao" },
    { id: "3", nome: "Lâmpada Queimada", categoria: "iluminacao" },
  ])

  const [novoDefeito, setNovoDefeito] = useState({ nome: "", categoria: "refrigeracao" })

  // Carregar configurações do localStorage ao montar o componente
  useEffect(() => {
    const valoresSalvos = localStorage.getItem(STORAGE_KEY_VALORES)
    const defeitosSalvos = localStorage.getItem(STORAGE_KEY_DEFEITOS)

    if (valoresSalvos) {
      setValoresPadrao(JSON.parse(valoresSalvos))
    }

    if (defeitosSalvos) {
      setDefeitosEspecificos(JSON.parse(defeitosSalvos))
    }
  }, [])

  const handleSalvarValores = () => {
    localStorage.setItem(STORAGE_KEY_VALORES, JSON.stringify(valoresPadrao))
    toast({
      title: "Valores salvos",
      description: "Os valores padrão foram atualizados com sucesso.",
    })
  }

  const handleAdicionarDefeito = () => {
    if (!novoDefeito.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do defeito não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    const novoDefeitoObj: DefeitoEspecifico = {
      id: Date.now().toString(),
      nome: novoDefeito.nome,
      categoria: novoDefeito.categoria,
    }

    const novosDefeitos = [...defeitosEspecificos, novoDefeitoObj]
    setDefeitosEspecificos(novosDefeitos)
    localStorage.setItem(STORAGE_KEY_DEFEITOS, JSON.stringify(novosDefeitos))

    setNovoDefeito({ nome: "", categoria: "refrigeracao" })

    toast({
      title: "Defeito adicionado",
      description: "O defeito específico foi adicionado com sucesso.",
    })
  }

  const handleRemoverDefeito = (id: string) => {
    const novosDefeitos = defeitosEspecificos.filter((d) => d.id !== id)
    setDefeitosEspecificos(novosDefeitos)
    localStorage.setItem(STORAGE_KEY_DEFEITOS, JSON.stringify(novosDefeitos))

    toast({
      title: "Defeito removido",
      description: "O defeito específico foi removido com sucesso.",
    })
  }

  const categoriasDefeito = [
    { value: "refrigeracao", label: "Refrigeração" },
    { value: "iluminacao", label: "Iluminação" },
    { value: "estrutura", label: "Estrutura" },
    { value: "outros", label: "Outros" },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie os valores padrão e defeitos específicos do sistema</p>
      </div>

      <Separator />

      {/* Valores Padrão */}
      <Card>
        <CardHeader>
          <CardTitle>Valores Padrão</CardTitle>
          <CardDescription>
            Configure os valores padrão para deslocamento, quilometragem e horas trabalhadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deslocamento">Deslocamento (R$/hora)</Label>
              <Input
                id="deslocamento"
                type="number"
                step="0.01"
                value={valoresPadrao.deslocamento.valorPorHora}
                onChange={(e) =>
                  setValoresPadrao({
                    ...valoresPadrao,
                    deslocamento: { valorPorHora: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quilometragem">Quilometragem (R$/km)</Label>
              <Input
                id="quilometragem"
                type="number"
                step="0.01"
                value={valoresPadrao.quilometragem.valorPorKm}
                onChange={(e) =>
                  setValoresPadrao({
                    ...valoresPadrao,
                    quilometragem: { valorPorKm: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horasTrabalhadas">Horas Trabalhadas (R$/hora)</Label>
              <Input
                id="horasTrabalhadas"
                type="number"
                step="0.01"
                value={valoresPadrao.horasTrabalhadas.valorPorHora}
                onChange={(e) =>
                  setValoresPadrao({
                    ...valoresPadrao,
                    horasTrabalhadas: { valorPorHora: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSalvarValores}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Valores
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Defeitos Específicos */}
      <Card>
        <CardHeader>
          <CardTitle>Defeitos Específicos</CardTitle>
          <CardDescription>Adicione ou remova defeitos específicos para a descrição do defeito</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para adicionar novo defeito */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="nomeDefeito">Nome do Defeito</Label>
              <Input
                id="nomeDefeito"
                placeholder="Ex: Compressor com ruído"
                value={novoDefeito.nome}
                onChange={(e) => setNovoDefeito({ ...novoDefeito, nome: e.target.value })}
              />
            </div>

            <div className="w-full sm:w-48 space-y-2">
              <Label htmlFor="categoriaDefeito">Categoria</Label>
              <select
                id="categoriaDefeito"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={novoDefeito.categoria}
                onChange={(e) => setNovoDefeito({ ...novoDefeito, categoria: e.target.value })}
              >
                {categoriasDefeito.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAdicionarDefeito} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Lista de defeitos por categoria */}
          <div className="space-y-6">
            {categoriasDefeito.map((categoria) => {
              const defeitosDaCategoria = defeitosEspecificos.filter((d) => d.categoria === categoria.value)

              if (defeitosDaCategoria.length === 0) return null

              return (
                <div key={categoria.value}>
                  <h3 className="font-semibold mb-3">{categoria.label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {defeitosDaCategoria.map((defeito) => (
                      <div key={defeito.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <span className="text-sm">{defeito.nome}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoverDefeito(defeito.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {defeitosEspecificos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum defeito específico cadastrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
