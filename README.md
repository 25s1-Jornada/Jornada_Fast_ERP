
Link design https://www.figma.com/design/eU3nwoDJJMpIJaT8gHCG7s/ERP-fast---2025?node-id=0-1&t=DPh1L6bLszFDyAHT-1

# Sistema ERP - Jornada FAST

Este repositório contém o projeto de desenvolvimento de um sistema ERP criado durante a Jornada FAST 2025.

## 📌 Descrição

O sistema ERP foi desenvolvido com o objetivo de auxiliar na gestão de processos internos, como o controle de produtos, cadastros, e emissão de Ordens de Serviço (O.S).

Além disso, o sistema foi pensado para futuras integrações com outros projetos desenvolvidos paralelamente na jornada, como:

- 📱 **Leitura de QR Code** para identificação e registro de ativos;
- 📊 **Análise de Ordens de Serviço** para geração de indicadores e relatórios gerenciais.


## 📁 Estrutura do Projeto

- `backend/` - Código-fonte do servidor e APIs
- `frontend/` - Interface web do sistema
- `docs/` - Documentação e arquivos complementares

## 🔐 Integridade dos relatórios

Os relatórios de O.S. contam com um hash SHA-256 calculado a partir dos campos críticos (ID, cliente, técnico, status, datas e valor). Durante a exportação:

1. O frontend envia os dados para `POST /api/report-integrity`, que devolve o hash.
2. Esse hash aparece no rodapé do PDF/CSV e também em um card da própria página de relatórios.
3. Ao exportar, o PDF/CSV já recebe (de forma invisível) todas as entradas usadas no cálculo. Basta levar o arquivo para `/verificar-relatorio` e a própria página extrai os dados embutidos antes de chamar `POST /api/report-integrity/verify`.

Como nada fica armazenado no banco, qualquer alteração manual nos dados exige recalcular o hash — se o resultado não for o mesmo, há evidência de manipulação.

## 👨‍💻 Desenvolvido por

Grupo ERP da Jornada FAST — 25S1
.
---
