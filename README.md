# Flashnote (Seu Clone do DontPad)

Flashnote é uma aplicação web inspirada no DontPad, projetada para permitir que usuários criem, salvem e compartilhem notas de texto baseadas em links únicos. Diferente do DontPad tradicional, Flashnote inclui autenticação de usuário (login e senha), permitindo que os usuários gerenciem seus próprios documentos e controlem o acesso de edição através de tokens.

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