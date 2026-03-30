import express from 'express';

import session from 'express-session';

const host = '0.0.0.0';

const porta = 3005;

const app = express();

let listacadastro = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({

    secret: 'm1nh4ch4ve',
    resave: true,
    saveUninitialized: true,
    cookie:{
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
    }
}));

app.get('/',(req,res) => {

    res.write(`

        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { font-family: Arial, sans-serif; background: #f8f9fa; }
            .login-container { max-width: 400px; margin-top: 80px; }
        </style>
        </head>
        <body>

   
        <div class="container login-container">
            <h2 class="text-center mb-4">Login</h2>
            <form action="/login" method="POST">
                <div class="mb-3">
                    <label class="form-label">Email:</label>
                    <input type="text" class="form-control" placeholder="Digite o usuário" name="email" id="email"> 
                </div>
                <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input type="password" class="form-control" placeholder="Digite a senha" name="senha" id ="senha">
                </div>
                 <button type="submit" class="btn btn-primary w-100">Entrar</button>
            </form>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        
        
        `);

    res.end();

});

app.get('/cadastrofornecedor',estaAutenticado, (req, res) => {
    res.write(`

<html lang="pt-br">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Formulario de cadastro de fornecedor</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/telainicial">Sistema</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="/telainicial">Home</a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="fornecedorDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Fornecedor
          </a>
          <ul class="dropdown-menu" aria-labelledby="fornecedorDropdown">
            <li><a class="dropdown-item" href="/cadastrofornecedor">Cadastrar Produto</a></li>
            <li><a class="dropdown-item" href="/listacadastro">Lista de Produto</a></li>
          </ul>
        </li>
      </ul>

      
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
        <div class="container mt-5">

    <h2 class="mb-4">Cadastro de Produto</h2>

    <form action="/cadastrofornecedor" method="POST">

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Código de Barras:</label>
                <input type="text" class="form-control" name="codigo_barras">
            </div>

            <div class="col-md-6 mb-3">
                <label class="form-label">Descrição do Produto:</label>
                <input type="text" class="form-control" name="descricao">
            </div>

        </div>

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Preço de Custo:</label>
                <input type="number" step="0.01" class="form-control" name="preco_custo">
            </div>

            <div class="col-md-6 mb-3">
                <label class="form-label">Preço de Venda:</label>
                <input type="number" step="0.01" class="form-control" name="preco_venda">
            </div>

        </div>

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Data de Validade:</label>
                <input type="date" class="form-control" name="validade">
            </div>

            <div class="col-md-6 mb-3">
                <label class="form-label">Quantidade em Estoque:</label>
                <input type="number" class="form-control" name="quantidade">
            </div>

        </div>

        <div class="mb-3">
            <label class="form-label">Nome do Fabricante:</label>
            <input type="text" class="form-control" name="fabricante">
        </div>

        <button type="submit" class="btn btn-primary">Cadastrar</button>

    </form>

</div>

        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

    </body>
    </html>

    `);

    res.end();
});

app.post('/cadastrofornecedor',estaAutenticado,(req,res) => {

    const codigo_barras = req.body.codigo_barras;
    const descricao = req.body.descricao;
    const preco_custo = req.body.preco_custo;
    const preco_venda = req.body.preco_venda;
    const validade = req.body.validade;
    const quantidade = req.body.quantidade;
    const fabricante = req.body.fabricante;

    if(!codigo_barras || !descricao || !preco_custo || !preco_venda || !validade || !quantidade || !fabricante){

        let html = `

<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro de Produto</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/telainicial">Sistema</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="/telainicial">Home</a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="fornecedorDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Fornecedor
          </a>
          <ul class="dropdown-menu" aria-labelledby="fornecedorDropdown">
            <li><a class="dropdown-item" href="/cadastrofornecedor">Cadastrar Produto</a></li>
            <li><a class="dropdown-item" href="/listacadastro">Lista de Produto</a></li>
          </ul>
        </li>
      </ul>

      
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
<div class="container mt-5">

    <h2 class="mb-4">Cadastro de Produto</h2>

    <form action="/cadastrofornecedor" method="POST">

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Código de Barras</label>
                <input type="text" class="form-control" name="codigo_barras" value="${codigo_barras}">
            </div>
        `;

        if(!codigo_barras){
            html += `<div class="alert alert-danger">Informe o código de barras!</div>`;
        }

        html += `
            <div class="col-md-6 mb-3">
                <label class="form-label">Descrição</label>
                <input type="text" class="form-control" name="descricao" value="${descricao}">
            </div>
        `;

        if(!descricao){
            html += `<div class="alert alert-danger">Informe a descrição!</div>`;
        }

        html += `</div>

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Preço de Custo</label>
                <input type="number" step="0.01" class="form-control" name="preco_custo" value="${preco_custo}">
            </div>
        `;

        if(!preco_custo){
            html += `<div class="alert alert-danger">Informe o preço de custo!</div>`;
        }

        html += `
            <div class="col-md-6 mb-3">
                <label class="form-label">Preço de Venda</label>
                <input type="number" step="0.01" class="form-control" name="preco_venda" value="${preco_venda}">
            </div>
        `;

        if(!preco_venda){
            html += `<div class="alert alert-danger">Informe o preço de venda!</div>`;
        }

        html += `</div>

        <div class="row">

            <div class="col-md-6 mb-3">
                <label class="form-label">Data de Validade</label>
                <input type="date" class="form-control" name="validade" value="${validade}">
            </div>
        `;

        if(!validade){
            html += `<div class="alert alert-danger">Informe a validade!</div>`;
        }

        html += `
            <div class="col-md-6 mb-3">
                <label class="form-label">Quantidade</label>
                <input type="number" class="form-control" name="quantidade" value="${quantidade}">
            </div>
        `;

        if(!quantidade){
            html += `<div class="alert alert-danger">Informe a quantidade!</div>`;
        }

        html += `

        </div>

        <div class="mb-3">
            <label class="form-label">Fabricante</label>
            <input type="text" class="form-control" name="fabricante" value="${fabricante}">
        </div>
        `;

        if(!fabricante){
            html += `<div class="alert alert-danger">Informe o fabricante!</div>`;
        }

        html += `

        <button type="submit" class="btn btn-primary">Cadastrar</button>

    </form>

</div>

</body>
</html>
`;

        res.send(html);

    }else{

        listacadastro.push({
            codigo_barras,
            descricao,
            preco_custo,
            preco_venda,
            validade,
            quantidade,
            fabricante
        });

        res.redirect("/listacadastro");
    }
});

app.get('/listacadastro', estaAutenticado,(req, res) => {

    let linhas = "";

    for (let produto of listacadastro) {
        linhas += `
            <tr>
                <td>${produto.codigo_barras}</td>
                <td>${produto.descricao}</td>
                <td>R$ ${produto.preco_custo}</td>
                <td>R$ ${produto.preco_venda}</td>
                <td>${produto.validade}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.fabricante}</td>
            </tr>
        `;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Produtos Cadastrados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/telainicial">Sistema</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="/telainicial">Home</a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="fornecedorDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Fornecedor
          </a>
          <ul class="dropdown-menu" aria-labelledby="fornecedorDropdown">
            <li><a class="dropdown-item" href="/cadastrofornecedor">Cadastrar Produto</a></li>
            <li><a class="dropdown-item" href="/listacadastro">Lista de Produto</a></li>
          </ul>
        </li>
      </ul>

      
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

        <div class="container mt-4">
            <h2>Produtos Cadastrados</h2>

            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Código de Barras</th>
                        <th>Descrição</th>
                        <th>Preço Custo</th>
                        <th>Preço Venda</th>
                        <th>Validade</th>
                        <th>Quantidade</th>
                        <th>Fabricante</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas}
                </tbody>
            </table>

            <a href="/cadastrofornecedor" class="btn btn-primary">Novo Produto</a>
        </div>

        </body>
        </html>
    `);
});




app.get('/telainicial',estaAutenticado,(req,res) => {
      res.write(`

        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Home - Sistema</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>

         
       <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/telainicial">Sistema</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="/telainicial">Home</a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="fornecedorDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Fornecedor
          </a>
          <ul class="dropdown-menu" aria-labelledby="fornecedorDropdown">
            <li><a class="dropdown-item" href="/cadastrofornecedor">Cadastrar Produto</a></li>
            <li><a class="dropdown-item" href="/listacadastro">Lista de Produto</a></li>
          </ul>
        </li>
      </ul>

      
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
        

        
            <div class="container mt-5">
                <div class="card p-4 shadow-sm text-center">
                    <h2 class="mb-4">Bem-vindo ao Sistema de Cadastro</h2>
                    <p>Use o menu acima para navegar pelas funcionalidades do sistema.</p>
                </div>
            </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        
        `);

        res.end();


});

app.post('/login',(req,res) => {

    const email = req.body.email;
    const senha = req.body.senha;

    if(email == 'admin@teste.com.br' && senha == 'admin'){
        req.session.logado = true;
        res.redirect('/telainicial');

    }else{

        res.redirect('/');

    }

});

function estaAutenticado(req,res,next){

    if(req.session?.logado){
        next();

    }else{
        res.redirect("/");
    }
}

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/");
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`)
});