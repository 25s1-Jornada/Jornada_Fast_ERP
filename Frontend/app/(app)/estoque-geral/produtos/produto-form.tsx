"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

const produtoFormSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  codigo: z.string().min(1, {
    message: "O código é obrigatório.",
  }),
  descricao: z.string().optional(),
  categoria: z.string().min(1, {
    message: "A categoria é obrigatória.",
  }),
  preco: z.string().min(1, {
    message: "O preço é obrigatório.",
  }),
  unidade: z.string().min(1, {
    message: "A unidade é obrigatória.",
  }),
})

type ProdutoFormValues = z.infer<typeof produtoFormSchema>

const defaultValues: Partial<ProdutoFormValues> = {
  nome: "",
  codigo: "",
  descricao: "",
  categoria: "",
  preco: "",
  unidade: "",
}

export function ProdutoForm({ produto }: { produto?: ProdutoFormValues }) {
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoFormSchema),
    defaultValues: produto || defaultValues,
  })

  function onSubmit(data: ProdutoFormValues, continueAdding = false) {
    // Simulação de envio para API
    console.log(data)

    // Mostrar mensagem de sucesso
    setSuccess(true)

    // Limpar formulário se continuar adicionando
    if (continueAdding) {
      form.reset(defaultValues)
    } else {
      // Redirecionar após salvar
      setTimeout(() => {
        router.push("/estoque-geral/produtos")
      }, 1500)
    }

    // Esconder mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">Produto salvo com sucesso.</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Código do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                      <SelectItem value="informatica">Informática</SelectItem>
                      <SelectItem value="ferramentas">Ferramentas</SelectItem>
                      <SelectItem value="pecas">Peças</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="un">Unidade (UN)</SelectItem>
                      <SelectItem value="kg">Quilograma (KG)</SelectItem>
                      <SelectItem value="m">Metro (M)</SelectItem>
                      <SelectItem value="l">Litro (L)</SelectItem>
                      <SelectItem value="cx">Caixa (CX)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição detalhada do produto" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Descreva as características do produto.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/estoque-geral/produtos")}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (form.formState.isValid) {
                  onSubmit(form.getValues(), true)
                } else {
                  form.trigger()
                }
              }}
            >
              Salvar e Cadastrar Novo
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
