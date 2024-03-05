import { FormLabel, Box, Input, HStack,FormControl, Center} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import React from "react";
import axios from "axios";
import { useState } from "react";
import "./App.css";
import { useEstados } from "./hooks/useEstados";
import { useCidades } from "./hooks/useCidades";




const App = () => {
  
  const {estados} = useEstados();
  const [selectedEstado, setSelectedEstado] = useState("")
  const [selectedCidade, setSelectedCidade] = useState("")
  const {cidades,loading:loadingCidades} = useCidades({uf:selectedEstado})

  const handleEstadoUpdate = (e) => {
    setSelectedEstado(e.target.value);
  }

  const handleCidadeUpdate= (e) => {
    setSelectedCidade(e.target.value)
  }


  const [name, setName] = useState('')
  const [cpfInput, setCpfInput] = useState('');
  const [dataN, setDataN] = useState(''); 
  const [celular, setCelular] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('Masculino'); 
//Cep
  const [cep, setCep] = useState("");
  const [lagradouro, setLagradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const url = "https://viacep.com.br/ws/";


  async function buscarCep(e) {
    //evita o carregamento 
    e.preventDefault();

    if (!cep) {
      // Handle empty CEP input
      setErrorMessage("Por favor, insira um CEP válido.");
      return;
    }
    try {
      const response = await fetch(`${url}/${cep}/json/`);
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP. Tente novamente mais tarde.");
      }
       const data = await response.json();
      // Update address fields with fetched data
      setLagradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
      // Clear error message if successful
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching CEP:", error);
      setErrorMessage("Erro ao buscar CEP. Por favor, verifique o CEP e tente novamente.");
    }
  }

  const handleCepChange = (event) => {
    setCep(event.target.value);
  };

  function handleCpfChange(event) {
    setCpfInput(event.target.value); 
  }

  function isValidCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
  }

  function btnFunction() {

    if (isValidCPF(cpfInput)) {
       const cpf = cpfInput.replace(/\D/g, ''); 
       const naturalidade = {   
        estado:selectedEstado,
        cidade:selectedCidade,   
      }
 
      axios.post('http://localhost:8007/Cadastro', {
          
        _id: cpfInput.replace(/\D/g, ''),
        cpf,name,dataN,sexo,naturalidade,
        celular,telefone,uf,cidade,bairro,lagradouro,numero,complemento
      })
      .then(response => {
        console.log(response);
        window.location.reload();
        alert("Paciente Cadastrado com sucesso")
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          // Show CPF duplication warning
          alert("CPF já cadastrado. Por favor, informe outro CPF.");
        } else {
           alert("Cpf inválido Por Favor!")
          console.error(error);
        }
      });
    }
  }

  return (
    <div className='CadastroPaciente'>   
      <div className="modal-content">
        <div className="container-modal">
          <div className="wrap-modal">
            <form>
              <Center as="header"h={50}w={480}bg="#f29ef3" color="white"
                fontWeight="bold"fontSize="4xl" pb="8">
                <h2>Cadastro de Paciente</h2>
              </Center><br></br>
                <FormControl display="flex" flexDir="column" gap="4">
                  <HStack spacing="80">
                    <Box w="100%" h="50">
                      <FormLabel htmlFor="nome">Nome Completo</FormLabel>
                      <Input id="nome" type="nome" 
                      onChange={e => setName(e.target.value)}
                      />
                    </Box> 
                    <Box w="100%" h="50">
                      <FormLabel htmlFor="cpf">Cpf</FormLabel>
                      <InputMask id="cpf" mask="999.999.999-99"
                        className={cpfInput !== "" ? "has-val input" : "input"}
                        type="CPF" onChange={handleCpfChange}/>
                    </Box>
                  </HStack>
                  <HStack spacing="80">
                  <Box w="100%" h="50">
                      <FormLabel htmlFor="nasc">Data de Nascimento</FormLabel>
                      <Input id="nasc" type="date" onChange={e => setDataN(e.target.value)}/>
                    </Box>
                    <Box w="100%" h="50">
                    <FormLabel>Selecione seu Sexo</FormLabel>
                      <select id="sexo" value={sexo}  onChange={e => setSexo(e.target.value)} >
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                      </select>

                    </Box>
                  </HStack>
                 <HStack>
                    <Box className="selEstado" w="100%" h="" >
                      <>Naturalidade</>
                      <p >Estado<br></br>
                        <select  value={selectedEstado} onChange={handleEstadoUpdate}>
                          {estados.map((estado) =>(
                            <option  key={estado.id} value={estado.sigla}>
                              {estado.nome}
                              </option>
                          ))}
                        </select></p>
                        </Box>
                        <Box className="selEstado" w="100%" h="50" >
                        {loadingCidades? (
                          <p>Carregando cidades...aguarde</p>
                        ):(
                      <p>Cidade:<br></br> <select id="city" value={selectedCidade} onChange={handleCidadeUpdate} >
                          {cidades.map((cidade) =>(
                              <option id="city"  key={cidade.id}>{cidade.nome}</option>
                            ))}
                        </select></p> 
                        )}
                    </Box>
                  </HStack>             
                  <HStack spacing="81">
                    <Box w="100%" h="50" >
                      <FormLabel htmlFor="cel">Celular</FormLabel>
                      <Input id="cel" type="number"onChange={e => setCelular(e.target.value)}/>
                    </Box>
                    <Box w="100%"  h="50">
                      <FormLabel htmlFor="Telefone">Telefone</FormLabel>
                      <Input id="Telefone" type="number"onChange={e => setTelefone(e.target.value)}/>
                    </Box>
                  </HStack>
                </FormControl>                  
                  <div width="md" h="auto" borderwidth={1} borderradius={8} p={4}>
                        {errorMessage && (
                          <div mb={4} color="red.500">
                            {errorMessage}
                          </div>
                        )}                 
                        <p>Endereço Atual :</p>
                    <input  id="cep" type="text" placeholder="Insira o CEP" 
                      value={cep} onChange={handleCepChange}/>
                    <button onClick={buscarCep}>Buscar</button>
                    <HStack spacing="81">
                      <Box mt={4}  w="56%">    
                        <>Estado:</><br></br>
                        <input  id="estado" type="text" value={uf} onChange={e => setUf(e.target.value)} /> 
                      </Box>
                      <Box mt={4}  w="56%">    
                          <>Cidade:</><br></br>
                          <input id="cidade" type="text" value={cidade} onChange={e => setCidade(e.target.value)} /> 
                        </Box>
                    </HStack>
                    <HStack spacing="81" >
                      <Box mt={4}  w="56%">    
                        <>Bairro:</><br></br>
                        <input  id="bairro" type="text" value={bairro} onChange={e => setBairro(e.target.value)} /> 
                      </Box>
                      <Box mt={4}  w="56%">    
                        <>Rua:</><br></br>
                        <input id="rua" type="text" value={lagradouro} onChange={e => setLagradouro(e.target.value)} />   
                      </Box> 
                    </HStack>
                    <HStack spacing="81">
                  <Box mt={4}  w="56%">    
                      <>Numero:</><br></br>
                      <input id="numero" type="text" value={numero} onChange={e => setNumero(e.target.value)} /> 
                    </Box>
                    <Box mt={4}  w="56%">    
                      <>Completo:</><br></br>
                      <input  id="complemento" type="text" value={complemento} onChange={e => setComplemento(e.target.value)} /> 
                    </Box>
                  </HStack>     
                  </div>
                <br></br><br></br>
                <div className="container-login-form-btn">
                  <button type="submit" 
                  className="login-form-btn" 
                  onClick={btnFunction}>Cadastrar</button> 
                </div>
            </form>     
          </div>
        </div>
      </div> 
    </div>
  );
};

export default App;






