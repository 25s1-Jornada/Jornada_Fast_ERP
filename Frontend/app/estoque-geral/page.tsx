import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Archive, History, PlusCircle } from "lucide-react"

export default function EstoqueGeralPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Estoque Geral</h1>
        <p className="text-muted-foreground mt-2">Gerencie produtos, armários e movimentações de estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Produtos
            </CardTitle>
            <CardDescription>Gerenciamento de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de produtos: 32</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cadastre e gerencie informações de produtos para o estoque.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/estoque-geral/produtos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/estoque-geral/produtos/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Archive className="mr-2 h-5 w-5" />
              Armários
            </CardTitle>
            <CardDescription>Gerenciamento de armários</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de armários: 12</p>
            <p className="text-sm text-muted-foreground mt-2">Cadastre e gerencie armários para organizar o estoque.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/estoque-geral/armarios">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/estoque-geral/armarios/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Armário
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Estoque
            </CardTitle>
            <CardDescription>Gerenciamento de estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de itens em estoque: 45</p>
            <p className="text-sm text-muted-foreground mt-2">
              Gerencie o estoque de produtos nos armários e suas movimentações.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/estoque-geral/estoque">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/estoque-geral/estoque/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Item
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
