const express = require("express"); //carreguei o express
const app = express(); //criei a aplicação do servidor

// Produto - Modelo  //Modelo do cadastro para ajudar
//   - Codigo
//   - Nome
//   - Preco
//   - Descricao

const produtos = []; //Cria um array global para guardar os produtos que serão criados

app.use(express.json()); //Faz o express utilizar padrão JSON nas requisições

//Middleware para logar no console as informações das requisições
app.use((req, res, next) => {
  console.log("Horario:", Date.now()); //Hora da requisição
  console.log("Tipo:", req.method); //Tipo da requisição
  console.log("Caminho:", req.originalUrl); //Caminho
  console.log("--------------------------");
  next(); //Sai do middleware de forma que continua o processamento normal do App
});

//Crud - Rota para criação de novo produto
app.post("/produtos", (req, res) => {
  const produto = req.body; //guarda em uma variável o objeto do produto enviado no corpo da requisição
  //Valida se o código está preenchido:
  if (!req.body.codigo) {
    res.status(400); //Altera status para 400 - Request errada
    res.json({ message: `Código obrigatório!` }); //Retorna mensagem de campo obrigatório
  } else {
    //Procura se já existe algum produto com o mesmo código
    const produtoExistente = produtos.find(
      (produto) => produto.codigo == req.body.codigo
    );
    //Se existir...
    if (produtoExistente) {
      res.status(400); //Altera status para 400 - Request errada
      res.json({ message: `Produto ${req.body.codigo} já existe!` }); //..retorna mensagem de erro
    } else {
      //Se não tiver nada de errado:
      produtos.push(produto); //guarda o produto na lista temporária
      res.status(201); //define o status de retorno 201 - Criado
      res.json(produto); //retorna no corpo da resposta o produto criado
    }
  }
});

// cRud - Rota para leitura de produtos
app.get("/produtos", (req, res) => {
  res.json(produtos); //retorna no corpo da resposta, a lista de todos os produtos guardados
});

// cRud - Rota para leitura de produto individual pelo código
app.get("/produto/:cod", (req, res) => {
  //Procura na lista de produtos pelo produto que tem o CODIGO igual ao COD informado no parâmetro da URL
  const produto = produtos.find((produto) => produto.codigo == req.params.cod);
  //Se o produto existir, retorna no corpo da resposta o produto encontrado
  if (produto) res.json(produto);
  //Se não encontrou, define o status como 404 - não encontrado, e finaliza o processamento
  else res.status(404).end();
});

// crUd - Rota para alteração de um produto
app.put("/produto/:cod", (req, res) => {
  //Busca o index do produto passado no parâmetro COD da URL
  const idx = produtos.findIndex((produto) => produto.codigo == req.params.cod);
  //Se não encontrou, define o status como 404 - não encontrado, e finaliza o processamento
  if (idx < 0) res.status(404).end();

  //Caso tenha encontrado...
  //... altera os campos do produto na posição (index) encontrada acima com os dados informados
  // no corpo da requisição.
  produtos[idx].nome = req.body.nome;
  produtos[idx].preco = req.body.preco;
  produtos[idx].descricao = req.body.descricao;

  //Define o status como 200 - Ok
  res.status(200);

  //Retorna no corpo da resposta, o produto com os dados alterados.
  res.json(produtos[idx]);
});

// cruD - Rota para exclusão de um produto
app.delete("/produto/:cod", (req, res) => {
  //Busca o index do produto passado no parâmetro da URL
  const idx = produtos.findIndex((produto) => produto.codigo == req.params.cod);
  // Se não encontrou...
  if (idx < 0) {
    //... define o status como 404 - Não encontrado, e finaliza o processamento.
    res.status(404).end();
  }
  // Se encontrou...
  else {
    //... exclui o produto da lista de produtos pelo index
    produtos.splice(idx, 1);
    //Define o status como 200 - Ok
    res.status(200);
    //Retorna no corpo da resposta uma mensagem de que o produto foi excluído com sucesso.
    res.json({ message: `Produto ${req.params.cod} excluido com sucesso!` });
  }
});

//Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor escutando na porta 3000");
});
