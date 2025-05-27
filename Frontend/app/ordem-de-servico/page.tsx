import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCog, FileText, PlusCircle } from "lucide-react"

export default function OrdemServicoPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ordem de Serviço</h1>
        <p className="text-muted-foreground mt-2">Gerencie chamados, clientes e técnicos para suas ordens de serviço</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Clientes
            </CardTitle>
            <CardDescription>Gerenciamento de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de clientes: 24</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cadastre e gerencie informações de clientes para associar aos chamados.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/ordem-de-servico/clientes">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/ordem-de-servico/clientes/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <UserCog className="mr-2 h-5 w-5" />
              Técnicos
            </CardTitle>
            <CardDescription>Gerenciamento de técnicos</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de técnicos: 8</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cadastre e gerencie informações de técnicos para atribuir aos chamados.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/ordem-de-servico/tecnicos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/ordem-de-servico/tecnicos/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Técnico
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Chamados
            </CardTitle>
            <CardDescription>Gerenciamento de chamados</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total de chamados: 15</p>
            <p className="text-sm text-muted-foreground mt-2">
              Crie e gerencie chamados de serviço, atribuindo clientes e técnicos.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/ordem-de-servico/chamados">
              <Button variant="outline">Ver Todos</Button>
            </Link>
            <Link href="/ordem-de-servico/chamados/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Chamado
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
