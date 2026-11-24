# Clubify — Sistema de Gestão de Sócios

Site estático (HTML, CSS e JavaScript) do projeto de Engenharia de Requisitos — CEUB.
Sem banco de dados: os dados iniciais vêm de arquivos JSON (`data/`) e o que o usuário cria fica no `localStorage` do navegador.

## 1. Imagens (IMPORTANTE)

A pasta `assets/img/` já vem com **ícones provisórios** (desenhos simples gerados só para o site funcionar).
Troque pelos seus, **copiando por cima com os nomes abaixo** (renomeie os seus arquivos; nomes sem espaço, acento ou parênteses evitam problemas no GitHub Pages, que diferencia maiúsculas de minúsculas):

| Seu arquivo | Renomeie para | Onde aparece |
|---|---|---|
| Download - azul escuro.png | `download.png` | Botão "Baixar edital" |
| Editar (Lápis) - azul escuro.png | `editar.png` | Ações nas tabelas do admin |
| Natação (Nadador) - azul escuro.png | `natacao.png` | Cards de Natação e Nado livre |
| Visualizar (Olho) - azul escuro.png | `visualizar.png` | Ações na lista de sócios |
| Piscina (Escada) - azul escuro.png | `piscina.png` | Local "Piscina", regras do edital |
| Usuário (Perfil) - azul escuro.png | `usuario.png` | Home, perfil e detalhe do sócio |
| Logo Clubify (escrita extensa, branca, 2144×733) | `logo-clubify.png` | Cabeçalho e menu lateral (fundo azul-marinho) |
| Logo em ícone (opcional) | `logo.png` | Ícone da aba do navegador |
| Proibido (Bloqueado) - vermelho.png | `proibido.png` | Inativar sócio, excluir turma, aviso de modalidade bloqueada |
| Documento (Arquivo) - azul escuro.png | `documento.png` | Edital, upload e lista de documentos |

Os ícones "azul escuro" ficam em fundos claros. O arquivo `logo-clubify.png` que vem na pasta é só um marcador (texto "clubify"): **substitua pelo seu**, mantendo o nome. Ele é exibido com 44 px de altura no cabeçalho.

## 2. Abrir no VS Code

1. Instale a extensão **Live Server** (Ritwick Dey).
2. Abra a pasta `clubify` no VS Code (File → Open Folder).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

> Não abra o `index.html` com duplo clique: o navegador bloqueia a leitura dos arquivos JSON (`fetch`) em `file://`.

## 3. Dados de teste

| Perfil | E-mail | Senha ou CPF |
|---|---|---|
| Sócio (docente) | maria@exemplo.com | 000.000.000-00 |
| Sócio (colaborador) | joao@exemplo.com | 111.111.111-11 |
| Administrador | admin@clubify.com | admin123 |

Quem se cadastra pelo site entra com o e-mail e o **CPF** como senha.
No painel do administrador, o link "Restaurar dados de exemplo" apaga o que foi cadastrado.

## 4. Publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex.: `clubify`).
2. Envie todos os arquivos desta pasta (arrastar e soltar em *Add file → Upload files*, ou `git add . && git commit && git push`).
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)` e salve.
4. Em alguns minutos o site abre em `https://SEU-USUARIO.github.io/clubify/`.

Todos os caminhos são relativos, então funciona dentro de `/clubify/` sem ajustes.

## 5. Estrutura

```
clubify/
├── index.html                  Página inicial
├── pages/
│   ├── modalidades.html        Modalidades e valores
│   ├── edital.html             Edital, regras e contato
│   ├── login.html              Login
│   ├── cadastro.html           Cadastro e inscrição (5 etapas)
│   ├── painel-socio.html       Painel do sócio
│   ├── perfil.html             Meu perfil
│   └── admin/
│       ├── socios.html         Gestão de sócios
│       ├── socio-detalhe.html  Detalhe do sócio
│       ├── modalidades.html    Gestão de modalidades e turmas
│       └── valores.html        Valores e mensalidades
├── css/style.css               Cores, tipografia e componentes
├── js/
│   ├── storage.js              JSON + localStorage e funções úteis
│   ├── auth.js                 Login simulado
│   ├── main.js                 Cabeçalho, rodapé, avisos e janelas
│   └── (um arquivo .js por tela: login, cadastro, painel, perfil, modalidades, admin-*)
├── data/                       modalidades.json, planos.json, socios-exemplo.json
└── assets/                     img/ (ícones) e edital-clubify.pdf (exemplo)
```

## 6. O que mudou (feedback da stakeholder)

- Categorias: **Colaborador** e **Docente** (`CATEGORIAS` em `js/storage.js`). O "saiba mais" de cada uma está em `CATEGORIA_INFO`.
- Mensalidade de exemplo: R$ 120,00 (edite em `data/planos.json` ou na tela Valores e mensalidades).
- Máximo de 10 vagas por turma, com 1 professor. Dados da piscina (5 raias, 2 alunos por raia) em `PISCINA` no `js/storage.js`.
  **Dimensões e profundidade estão como "XX m"**: troque pelos valores reais.
- Cadastro com a etapa obrigatória **Avaliação física e acessibilidade**; o resultado aparece em Meu perfil → Acessibilidade e no detalhe do sócio (admin).
- Avisos da piscina (profundidade, roupa, touca, orientação) no edital e no cadastro.
- Custo de manutenção (R$ 1.800, exemplo) comparado com a arrecadação na tela Valores e mensalidades.

## 7. Limitações (protótipo)

- Os dados ficam só no navegador de quem usou. Outro computador não vê o que foi cadastrado.
- O login é simulado e não há segurança real.
- Os arquivos enviados não são guardados, só o nome e o status.
- O CPF é validado apenas pela quantidade de dígitos.
