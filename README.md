<h1 align="center">Chirpify API</h1>

<p align="center">
  Chirpify API é a API responsável pelo funcionamento do chat Chirpify.
</p>

<p align="center">
  <a href="#tecnologias-utilizadas">Tecnologias Utilizadas</a> |
  <a href="#instalação">Instalação</a> |
  <a href="#configuração">Configuração</a> |
  <a href="#uso">Uso</a> |
  <a href="#deploy">Deploy</a> |
  <a href="#licença">Licença</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

## Tecnologias Utilizadas 🛠️

- Node.js
- socket.io
- TypeScript
- express
- Prisma
- Dotenv
- cors
- bcrypt
- jwt
- sqlite3

## Instalação ⚙️
Siga os passos abaixo para instalar e configurar o projeto:

1. Clone o repositório: <br>
 ```
  $ git clone https://github.com/viniciuspra/Chirpify-chat-server.git
 ```

2. Acesse o diretório do projeto:
 ```
  $ cd [DIRETÓRIO_DO_PROJETO]
 ```

3. Instale as dependências:
 ```
  $ npm install
 ```

## Configuração 🔧
Antes de executar o projeto, é necessário configurar as variáveis de ambiente. Siga as etapas abaixo:

1. Renomeie o arquivo `.env.example` para `.env`.
2. Abra o arquivo `.env` e preencha as seguintes variáveis de ambiente:
- `PORT` - Porta em que o servidor irá rodar.
- `JWT_SECRET_KEY` - Chave secreta para a geração de tokens JWT.
- 
## Uso 🚀
Para iniciar o servidor em modo de desenvolvimento, execute o seguinte comando:

```
 $ npm run dev
```


## Licença 📄:

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

 
