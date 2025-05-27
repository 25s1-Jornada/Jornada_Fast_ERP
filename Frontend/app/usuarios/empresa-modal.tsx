"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Empresa, type Endereco, TipoEmpresa, enderecosMock } from "./types"
import { EnderecoModal } from "./endereco-modal"

// Schema de validação para a empresa
const empresaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  endereco_id: z.string().min(1, "Endereço é obrigatório"),
  tipo_empresa: z.nativeEnum(TipoEmpresa, {
    errorMap: () => ({ message: "Tipo de empresa é obrigatório" }),
  }),
  email: z.string().email("Email inválido"),
})

type EmpresaFormValues = z.infer<typeof empresaSchema>

interface EmpresaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (empresa: Empresa) => void
  empresa?: Empresa
}

export function EmpresaModal({ isOpen, onClose, onSave, empresa }: EmpresaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enderecos, setEnderecos] = useState<Endereco[]>(enderecosMock)
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false)
  const [currentEndereco, setCurrentEndereco] = useState<Endereco | undefined>(
    empresa?.endereco_id ? enderecos.find((e) => e.id === empresa.endereco_id) : undefined,
  )

  // Inicializa o formulário com os valores da empresa, se existir
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresa
      ? {
          nome: empresa.nome,
          cnpj: empresa.cnpj,
          endereco_id: empresa.endereco_id,
          tipo_empresa: empresa.tipo_empresa,
          email: empresa.email,
        }
      : {
          nome: "",
          cnpj: "",
          endereco_id: "",
          tipo_empresa: undefined as unknown as TipoEmpresa,
          email: "",
        },
  })

  // Função para salvar a empresa
  const handleSave = (values: EmpresaFormValues) => {
    setIsSubmitting(true)

    // Simula uma operação assíncrona
    setTimeout(() => {
      const savedEmpresa: Empresa = {
        id: empresa?.id || Math.random().toString(36).substring(2, 9),
        ...values,
        created_at: empresa?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      onSave(savedEmpresa)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  // Função para abrir o modal de endereço
  const handleOpenEnderecoModal = () => {
    setIsEnderecoModalOpen(true)
  }

  // Função para salvar um novo endereço
  const handleSaveEndereco = (endereco: Endereco) => {
    // Verifica se o endereço já existe
    const existingIndex = enderecos.findIndex((e) => e.id === endereco.id)

    if (existingIndex >= 0) {
      // Atualiza o endereço existente
      const updatedEnderecos = [...enderecos]
      updatedEnderecos[existingIndex] = endereco
      setEnderecos(updatedEnderecos)
    } else {
      // Adiciona o novo endereço
      setEnderecos([...enderecos, endereco])
    }

    // Atualiza o endereço atual e o valor do formulário
    setCurrentEndereco(endereco)
    form.setValue("endereco_id", endereco.id)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{empresa ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="TechSolutions Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="12.345.678/0001-90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecione um endereço" />
                          </SelectTrigger>
                          <SelectContent>
                            {enderecos.map((endereco) => (
                              <SelectItem key={endereco.id} value={endereco.id}>
                                {endereco.logradouro}, {endereco.numero} - {endereco.cidade}/{endereco.uf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleOpenEnderecoModal}>
                        {currentEndereco ? "Editar" : "Novo"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Empresa</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TipoEmpresa.ADMIN}>Administrador</SelectItem>
                          <SelectItem value={TipoEmpresa.REPRESENTANTE}>Representante</SelectItem>
                          <SelectItem value={TipoEmpresa.TECNICO}>Técnico</SelectItem>
                          <SelectItem value={TipoEmpresa.CLIENTE}>Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contato@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Endereço */}
      <EnderecoModal
        isOpen={isEnderecoModalOpen}
        onClose={() => setIsEnderecoModalOpen(false)}
        onSave={handleSaveEndereco}
        endereco={currentEndereco}
      />
    </>
  )
}
