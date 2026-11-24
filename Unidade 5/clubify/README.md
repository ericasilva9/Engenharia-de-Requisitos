
# Clubify — Sistema de Gestão de Sócios

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

## 📖 Sobre o projeto

O Clubify é um Sistema de Gestão de Sócios desenvolvido como projeto acadêmico da disciplina de Engenharia de Requisitos do curso de Bacharelado em Engenharia de Software do Centro Universitário de Brasília (CEUB).

O sistema tem como objetivo centralizar e simplificar os processos de cadastro de sócios, inscrições em modalidades esportivas, acompanhamento de mensalidades, avaliação física e gerenciamento administrativo.

O projeto foi inspirado no Núcleo de Esportes do CEUB e contou com uma visita técnica às instalações esportivas do campus da Asa Sul, além da participação da stakeholder Auzeni Farias, que contribuiu com feedbacks e sugestões para o aprimoramento dos requisitos e das funcionalidades do sistema.

## 🔗 Acesso ao projeto

- **Protótipo no Figma:** [Acessar protótipo interativo](https://www.figma.com/proto/ndmYmNI4wDaGU2mhLOdiZI/Clubify?node-id=0-1&t=66AfOE5Mjmh60eMG-1)
- **Site no GitHub Pages:** [Acessar o Clubify](https://ericasilva9.github.io/Engenharia-de-Requisitos/Unidade%205/clubify/)

## 🔐 Acesso ao painel administrativo

Para testar as funcionalidades administrativas do sistema, acesse a Área do Sócio e utilize as seguintes credenciais:

| Campo | Credencial |
| --- | --- |
| E-mail | `admin@clubify.com` |
| Senha | `admin123` |

> As credenciais são fictícias e destinadas exclusivamente à demonstração acadêmica do sistema.

## ⚙️ Funcionalidades do sistema

### Área pública

- Página inicial de apresentação do Clubify;
- Consulta de modalidades esportivas;
- Consulta de horários e mensalidades;
- Informações sobre categorias;
- Edital e regras de utilização;
- Orientações de segurança da piscina.

### Cadastro e inscrição

O processo de cadastro é dividido em cinco etapas:

1. Dados pessoais;
2. Escolha da modalidade;
3. Avaliação física e acessibilidade;
4. Envio simulado de documentos;
5. Confirmação da inscrição.

### Área do sócio

- Acompanhamento de inscrições;
- Consulta da situação das mensalidades;
- Consulta da situação dos documentos;
- Visualização e edição dos dados cadastrais;
- Consulta das informações de acessibilidade.

### Área administrativa

- Gerenciamento de sócios;
- Consulta e edição dos dados dos sócios;
- Gerenciamento de modalidades e turmas;
- Controle de horários e vagas;
- Validação de documentos;
- Gerenciamento de valores e mensalidades;
- Registro simulado de pagamentos.

## 🏊 Modalidades esportivas

O sistema contempla duas modalidades esportivas:

- **Natação:** atividade aquática orientada por um professor, com controle de horários e capacidade das turmas.
- **Nado Livre:** utilização da piscina nos horários disponibilizados pelo clube.

As modalidades foram planejadas considerando a estrutura da piscina do CEUB da Asa Sul e as orientações recebidas durante o levantamento de requisitos.

## 💻 Tecnologias utilizadas

| Tecnologia | Finalidade |
| --- | --- |
| HTML5 | Estruturação das páginas |
| CSS3 | Estilização e identidade visual |
| JavaScript | Interatividade e funcionalidades |
| JSON | Armazenamento dos dados iniciais |
| localStorage | Persistência local dos dados simulados |
| Figma | Prototipação das interfaces |
| Git | Controle de versão |
| GitHub | Hospedagem do código-fonte |
| GitHub Pages | Publicação do site |
| Miro | Organização das tarefas com Kanban |

## 📂 Estrutura do projeto

A pasta `clubify` reúne os arquivos necessários para a execução do site.

    clubify/
    ├── assets/
    ├── css/
    ├── data/
    ├── js/
    ├── pages/
    │   ├── admin/
    │   ├── cadastro.html
    │   ├── edital.html
    │   ├── login.html
    │   ├── modalidades.html
    │   ├── painel-socio.html
    │   └── perfil.html
    ├── index.html
    └── README.md

| Pasta ou arquivo | Descrição |
| --- | --- |
| `assets/` | Imagens, ícones e recursos visuais |
| `css/` | Estilos e componentes visuais do sistema |
| `data/` | Dados iniciais e fictícios do sistema |
| `js/` | Scripts e funcionalidades em JavaScript |
| `pages/` | Páginas públicas e área do sócio |
| `pages/admin/` | Páginas do painel administrativo |
| `index.html` | Página inicial do Clubify |
| `README.md` | Apresentação e instruções do projeto |

## 🏗️ Arquitetura do sistema

O Clubify utiliza uma arquitetura estática, exclusivamente front-end, sem necessidade de servidor de aplicação ou banco de dados.

Os dados iniciais são representados por arquivos JSON, enquanto os dados gerados durante a utilização do sistema são armazenados no localStorage do navegador.

Essa arquitetura permite demonstrar as funcionalidades do sistema por meio do GitHub Pages.

## 📋 Metodologia de desenvolvimento

O desenvolvimento do projeto foi organizado utilizando a metodologia Kanban, com um quadro de tarefas elaborado no Miro.

O projeto contemplou as seguintes atividades:

- Levantamento de requisitos funcionais e não funcionais;
- Visita técnica às instalações esportivas;
- Coleta de feedbacks da stakeholder;
- Modelagem do sistema;
- Elaboração de diagramas UML e entidade-relacionamento;
- Prototipação de 15 telas no Figma;
- Desenvolvimento do site;
- Revisão da documentação;
- Publicação no GitHub Pages.

## ⚠️ Limitações do projeto

O Clubify é um protótipo funcional desenvolvido exclusivamente para fins acadêmicos.

Portanto:

- Não possui banco de dados real;
- Não possui servidor de aplicação próprio;
- A autenticação é simulada;
- Os pagamentos são simulados;
- O envio de documentos não realiza o armazenamento real dos arquivos;
- Os dados cadastrados ficam armazenados localmente no navegador;
- Não devem ser inseridos dados pessoais ou médicos reais.

O sistema não foi desenvolvido para utilização institucional em produção.

## 👥 Integrantes do grupo

- **Adriano Lisarb Guzman Moura Batista**
- **Erica Pereira Da Silva**
- **Ana Beatriz De Almeida Ramos**
- **Christian Calebe Ferreira Campos Silva**

## 🎓 Informações acadêmicas

| Informação | Descrição |
| --- | --- |
| Instituição | Centro Universitário de Brasília (CEUB) |
| Curso | Bacharelado em Engenharia de Software |
| Disciplina | Engenharia de Requisitos e Design de Interfaces|
| Projeto | Clubify — Sistema de Gestão de Sócios |
| Ano | 2026 |

---

<p align="center">
    <strong>Clubify — Sistema de Gestão de Sócios</strong><br>
    Projeto acadêmico de Engenharia de Requisitos — CEUB<br>
    Brasília, DF — 2026
</p>
