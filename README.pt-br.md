<p align="center">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" align="center" width="30%">
</p>
<p align="center"><h1 align="center">ENCURTADOR DE URL</h1></p>
<p align="center">
	<em><code>❯ API de Encurtador de URL construído com NestJS e PostgreSQL</code></em>
  
 [🇺🇸 Read in English](README.md) | [🇧🇷 Leia em Português](README.pt-br.md)

</p>


## Construído com  
- Node.js  
- TypeScript  
- NestJS  
- PostgreSQL  
- TypeORM  
- JWT  
- Class Validator  
- Docker  
- Docker Compose  
- Jest  
- Swagger  

## Requisitos  
- [Node.js](https://nodejs.org/en/download/) (v20.18.0 ou superior)  
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

## Configuração Local  
1. Clone o repositório  
```sh
git clone https://github.com/rafaelpereira7l/url-shortener.git
```
2. Navegue até o diretório do projeto  
```sh
cd url-shortener
```
3. Crie um arquivo `.env` no diretório raiz e copie o conteúdo do arquivo `.env.example`  
```sh
cp .env.example .env
```
4. Preencha as variáveis de ambiente necessárias no arquivo `.env`  
```sh
NODE_ENV=DEVELOPMENT

BASE_URL=http://localhost:3000

JWT_SECRET=secret
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=url_shortener
```

## Executando a Aplicação  
1. Instale as dependências do projeto  
```sh
pnpm install
```
2. Execute o contêiner do PostgreSQL com Docker  
```sh
docker-compose -f docker-compose.dev.yml up postgres -d
```
3. Inicie o servidor de desenvolvimento  
```sh
# Execute o servidor de desenvolvimento localmente
pnpm run start:dev

# Ou execute o servidor dentro do contêiner Docker
docker-compose -f docker-compose.dev.yml up --build
```
5. Execute os testes unitários  
```sh
# Execute os testes unitários localmente
pnpm run test

# Ou execute os testes dentro do contêiner Docker
docker exec -it url-shortener-app-dev pnpm run test
```
8. Abra o navegador e acesse `http://localhost:3000/api` para visualizar a documentação da API no Swagger UI  

## Capturas de Tela 📷  

<details>
  <summary>Swagger</summary>

  URL: http://localhost:3000/api

  <img src="docs/swagger.png" alt="Swagger API" />
</details>

<details>
  <summary>Testes Unitários</summary>
  <img src="docs/tests.png" alt="Testes Unitários" />
</details>

## Uso  
### Endpoints  
| Método | Endpoint | Descrição |  
| --- | --- | --- |  
| POST | `/user` | Criar um novo usuário |  
| POST | `/sign-in` | Autenticar usuário |  
| GET | `/{code}` | Acessar uma URL encurtada |  
| GET | `/shorten-url` | Listar todas as URLs encurtadas com a contagem de cliques para o usuário atual |  
| POST | `/shorten-url` | Criar uma nova URL encurtada |  
| PATCH | `/shorten-url/{id}` | Atualizar uma URL encurtada |  
| DELETE | `/shorten-url/{id}` | Excluir uma URL encurtada |  

### Autenticação  
A API utiliza autenticação JWT. Para autenticar, inclua o cabeçalho `Authorization` na sua requisição com o valor `Bearer <token>`, onde `<token>` é o JWT obtido no endpoint `/sign-in`.  

Qualquer usuário pode solicitar o encurtamento de uma URL, e há apenas um endpoint disponível para essa finalidade. No entanto, se o usuário estiver autenticado, o sistema registrará que a URL encurtada pertence a ele.  

Usuários autenticados podem listar, editar o endereço de destino e excluir as URLs encurtadas por eles.  

### Exemplo de Requisição  
```sh
curl -X GET \
  http://localhost:3000/shorten-url \
  -H 'Authorization: Bearer <token>'
```

## Executar Testes  
```bash
# Executar testes unitários localmente
pnpm run test

# Ou executar testes dentro do contêiner Docker
docker exec -it url-shortener-app-dev pnpm run test
```

📌 Projeto desenvolvido por [**Rafael Pereira**](https://raffp.dev/) 🚀