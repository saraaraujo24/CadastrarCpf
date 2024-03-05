const express = require("express")
const morgan = require("morgan");
const app = express();
const mongoose = require('mongoose')
const cors = require("cors");

const bodyParser= require("body-parser");

app.use(morgan("dev"));
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model do documento
const Cadas = mongoose.model('Cadastro', {
  _id: String,
  name: String,
  cpf:String,
  dataN:String,
  sexo:String,
  naturalidade:Array,
  celular:String,
  telefone:String,
  uf:String,
  cidade:String,
  bairro:String,
  lagradouro:String,
  numero:String,
  complemento:String,
 
});


app.post('/Cadastro', async (req, res) => {
  try {

    const { _id, cpf,name,dataN,sexo,naturalidade,
      celular,telefone,uf,cidade,bairro,lagradouro,numero,complemento} = req.body;
     
    

    const post = new Cadas({ _id,cpf,name,dataN,sexo,naturalidade,
      celular,telefone,uf,cidade,bairro,lagradouro,numero,complemento,});

    await post.save();

    res.json({ message: 'Dados salvos com sucesso!' });
  } catch (err) {
    res.status(409).json({ error: "CPF já cadastrado." });
    console.error(err);
 
  }
})


app.listen(8007, ()=> {
    console.log("Rodando");
})

