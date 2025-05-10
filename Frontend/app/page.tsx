import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Ordens de Serviço</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/clientes">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Gerenciar cadastro de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visualize, adicione e edite informações de clientes.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tecnicos">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Técnicos</CardTitle>
              <CardDescription>Gerenciar cadastro de técnicos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visualize, adicione e edite informações de técnicos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chamados">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Chamados</CardTitle>
              <CardDescription>Gerenciar chamados de serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visualize, adicione e edite chamados de serviço.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
