"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Empresa, type Endereco, TipoEmpresa } from "./types"
import { EnderecoModal } from "./endereco-modal-fixed"
import { api } from "@/lib/api"

const empresaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  endereco_id: z.string().min(1, "Endereço é obrigatório"),
  tipo_empresa: z.nativeEnum(TipoEmpresa, { errorMap: () => ({ message: "Tipo de empresa é obrigatório" }) }),
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
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false)
  const [currentEndereco, setCurrentEndereco] = useState<Endereco | undefined>(undefined)

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresa
      ? { nome: empresa.nome, cnpj: empresa.cnpj, endereco_id: empresa.endereco_id, tipo_empresa: empresa.tipo_empresa, email: empresa.email }
      : { nome: "", cnpj: "", endereco_id: "", tipo_empresa: undefined as unknown as TipoEmpresa, email: "" },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<any[]>("/api/Endereco")
        const mapped: Endereco[] = (data || []).map((e) => ({
          id: (e.id ?? "").toString(),
          logradouro: e.logradouro || "",
          numero: e.numero || "",
          bairro: e.bairro || "",
          cidade: e.cidade || "",
          uf: e.uf || "",
        }))
        setEnderecos(mapped)
        if (empresa?.endereco_id) setCurrentEndereco(mapped.find((m) => m.id === empresa.endereco_id))
      } catch (e) {
        console.error(e)
      }
    }
    if (isOpen) load()
  }, [isOpen, empresa?.endereco_id])

  const handleSave = (values: EmpresaFormValues) => {
    setIsSubmitting(true)
    const savedEmpresa: Empresa = { id: empresa?.id || "", ...values, created_at: empresa?.created_at || new Date().toISOString(), updated_at: new Date().toISOString() }
    onSave(savedEmpresa)
    setIsSubmitting(false)
    onClose()
  }

  const handleOpenEnderecoModal = () => {
    setIsEnderecoModalOpen(true)
  }

  const handleSaveEndereco = async (endereco: Endereco) => {
    try {
      const payload = {
        Id: endereco.id ? parseInt(endereco.id, 10) : undefined,
        Logradouro: endereco.logradouro,
        Numero: endereco.numero,
        Bairro: endereco.bairro,
        Cidade: endereco.cidade,
        UF: endereco.uf,
      }
      if (payload.Id) await api.put(`/api/Endereco/${payload.Id}`, payload)
      else await api.post(`/api/Endereco`, payload)

      const data = await api.get<any[]>("/api/Endereco")
      const mapped: Endereco[] = (data || []).map((e) => ({
        id: (e.id ?? "").toString(),
        logradouro: e.logradouro || "",
        numero: e.numero || "",
        bairro: e.bairro || "",
        cidade: e.cidade || "",
        uf: e.uf || "",
      }))
      setEnderecos(mapped)
      const selected = mapped.find((e) => e.logradouro === endereco.logradouro && e.numero === endereco.numero) || mapped[mapped.length - 1]
      if (selected) {
        setCurrentEndereco(selected)
        form.setValue("endereco_id", selected.id)
      }
    } catch (e) {
      console.error(e)
      alert("Falha ao salvar endereço")
    }
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
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="TechSolutions Ltda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cnpj" render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="12.345.678/0001-90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endereco_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
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
              )} />

              <FormField control={form.control} name="tipo_empresa" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Empresa</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contato@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <EnderecoModal isOpen={isEnderecoModalOpen} onClose={() => setIsEnderecoModalOpen(false)} onSalvar={handleSaveEndereco} endereco={currentEndereco} />
    </>
  )
}

