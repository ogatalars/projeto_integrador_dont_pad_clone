# Flashnote (Seu Clone do DontPad)

Flashnote é uma aplicação web inspirada no DontPad, projetada para permitir que usuários criem, salvem e compartilhem notas de texto baseadas em links únicos. Diferente do DontPad tradicional, Flashnote inclui autenticação de usuário (login e senha), permitindo que os usuários gerenciem seus próprios documentos e controlem o acesso de edição através de tokens.
Trata-se de um software destinado a fornecer fácil acesso a anotações, sejam elas a pequenas anotações diárias como lembretes, ou anotações referentes a estudo ou trabalho. Tem o objetivo de facilitar essas anotações por ser de acesso online, de onde estiver.

## Justificativa
A criação do Flashnote é justificada pela crescente demanda por ferramentas digitais que otimizem a organização pessoal e profissional, especialmente em um contexto onde a privacidade de dados é uma preocupação constante. A Lei Geral de Proteção de Dados (LGPD), implementada no Brasil em 2020, destaca a importância de proteger informações pessoais, e o Flashnote se alinha a essa exigência ao oferecer um sistema de autenticação que impede o acesso não autorizado. Diferentemente de soluções como o dontpad, que não possui barreiras de segurança, o Flashnote introduz o recurso de login e senha, garantindo que as informações do usuário permaneçam sigilosas e acessíveis apenas a ele.
Além disso, a praticidade é um ponto central: o Flashnote pode ser acessado de qualquer dispositivo com internet, seja um smartphone, tablet ou computador, sem a necessidade de instalações complexas. Essa combinação de segurança e acessibilidade torna o Flashnote uma solução relevante e necessária no mercado atual, atendendo a usuários que buscam eficiência sem comprometer a privacidade.


## Funcionalidades Principais (MVP)

* Registro e Login de Usuários (Autenticação baseada em JWT).
* Criação de novos documentos de texto com URLs (slugs) únicas.
* Edição e salvamento automático (via Ctrl+S) do conteúdo dos documentos.
* Visualização pública de documentos através do slug.
* Geração de um token de edição para permitir que outros usuários (logados) editem um documento específico.
* Listagem e exclusão de documentos pertencentes ao usuário logado.

## Tecnologias Utilizadas

**Backend:**
* Node.js
* Express.js
* TypeScript
* Sequelize (ORM)
* SQLite (para desenvolvimento local)
* JSON Web Tokens (JWT) para autenticação
* bcrypt para hashing de senhas
* `nanoid` para geração de slugs e tokens

**Frontend:**
* React
* TypeScript
* Vite (como ferramenta de build e servidor de desenvolvimento)
* Axios (para chamadas HTTP)
* React Router DOM (para roteamento)
* React Context API (para gerenciamento de estado de autenticação)
* CSS Modules (para estilização escopada)

## Estrutura do Projeto

O projeto é organizado em duas pastas principais na raiz:

* `/server`: Contém todo o código do backend (API Node.js/Express).
* `/client`: Contém todo o código do frontend (Aplicação React).

## Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas:

* Node.js (v18.x ou superior recomendado)
* npm (geralmente vem com o Node.js) ou yarn
* Git

**Ferramentas Opcionais Recomendadas:**
* Um cliente de API como Postman, Insomnia, ou a extensão REST Client para VS Code (para testar o backend diretamente).
* DB Browser for SQLite (ou similar) para inspecionar o banco de dados SQLite local.

## Configuração e Uso Local

Siga os passos abaixo para configurar e rodar o projeto na sua máquina local.

**1. Clone o Repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO_GIT>
   cd <NOME_DA_PASTA_DO_PROJETO>

   2. Configuração do Backend:

Navegue até a pasta do servidor:


cd server

Instale as dependências:


npm install

Crie um arquivo .env na pasta server (copie de server/.env.example se você criar um, ou crie um novo) com o seguinte conteúdo:


# server/.env
PORT=5001
NODE_ENV=development

# Configurações do Sequelize para SQLite
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# Segredos JWT (IMPORTANTE: Gere um segredo forte e único!)
JWT_SECRET=SEU_SEGREDO_JWT_SUPER_FORTE_E_SECRETO_AQUI
JWT_EXPIRES_IN=7d
Nota: Para JWT_SECRET, use uma string longa, aleatória e segura.
Inicie o servidor de desenvolvimento do backend:


npm run dev

O servidor backend estará rodando em http://localhost:5001 (ou a porta definida no seu .env). O arquivo database.sqlite será criado automaticamente na pasta server na primeira vez que o servidor iniciar com sucesso após a configuração dos modelos.
3. Configuração do Frontend:

Abra um novo terminal (mantenha o terminal do backend rodando).
Navegue da raiz do projeto para a pasta do cliente:


cd client 
# (Ou 'cd ../client' se você ainda estiver na pasta 'server')
Instale as dependências:
Bash

npm install

Crie um arquivo .env na pasta client com o seguinte conteúdo, apontando para o seu backend local:

# client/.env
VITE_API_BASE_URL=http://localhost:5001/api
Inicie o servidor de desenvolvimento do frontend:

npm run dev


O frontend estará acessível em http://localhost:5173 (ou a porta indicada pelo Vite no console).
4. Usando a Aplicação:

Abra a URL do frontend (ex: http://localhost:5173) no seu navegador.
Você poderá se registrar como um novo usuário.
Faça login com suas credenciais.
Crie, edite, salve e compartilhe seus documentos de texto!
