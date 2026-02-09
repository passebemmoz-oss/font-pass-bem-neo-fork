import React, {useState, useMemo, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory,} from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Grid } from '@material-ui/core';

import ProgressCircle from "./ProgressCircle";

import api from "../services/api";

export default function ADDTEMA({StatusTheme, CancelarS, datas ,Status}) {

    function Teste(){

        CancelarS(false)
        setquestao("")
        setalternativa_correta("")
        setopcao1("")
        setopcao2("")
        setopcao3("")
        setfoto(null)
        setPartilhaSalva([])
    }

   async function Apagar(){

       const response = await api.delete(`questoes${datas._id}`,{
           headers:{
               id:datas._id,
               temaid:datas.tema_id,
           }
       })
       Status(false)
       alert(response.data)
    }

    useEffect(() => {
        async function GetModulos(){
            const response = await api.get("modulos",{
                headers:{
                  user: "60b6aff95361df172869306b",
                }
              })
              setShareds(response.data)
             
        }
        GetModulos()
        
      }, [])

  const history = useHistory();

  const tema = localStorage.getItem("temaName")
  const tema_id = localStorage.getItem("temaID")

  const row = localStorage.getItem("Pergunta")

  const [foto, setfoto] = React.useState(null)


  const [questao, setquestao] = useState("")
  const [alternativa_correta, setalternativa_correta] = useState("")
  const [progress, setprogress] = useState(false)
  const [shareds, setShareds] = useState([])
  const [partilhadas, setPartilhadas] = useState([])

  const [partilhasalva, setPartilhaSalva] = useState([])

  

  const [opcao1, setopcao1] = useState("")
  const [opcao2, setopcao2] = useState("")
  const [opcao3, setopcao3] = useState("")

  const [statusText , setstatusText] = useState(false)


  useEffect(() => {
    async function GetPergunta(){
        setquestao(datas?.questao)
        setopcao1(datas?.incorecta_alternativas[0])
        setopcao2(datas?.incorecta_alternativas[1])
        setopcao3(datas?.incorecta_alternativas[2])
        setalternativa_correta(datas?.alternativa_correta)

        datas?.partilhadas.map((item, index )=> {
            setPartilhaSalva([...partilhasalva ,item?.nome])
        })

        
    }
    if(Status == true){
        GetPergunta()
    }
    
  }, [Status])



  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])
  
  
  async function EnviarQuestao(){
    if(!foto && !datas.imagem_url){
        alert("Toda questão deve ter uma foto")
        return
    }

    let n_opcoes = 0;

    if (opcao1.trim() !== "") n_opcoes++;
    if (opcao2.trim() !== "") n_opcoes++;
    if (opcao3.trim() !== "") n_opcoes++;

    else if(questao.trim() == "" || alternativa_correta.trim() == ""
        || n_opcoes < 2 ){
        setstatusText(true)
        alert("É obrigatório o preenchimento de todos campos")
        return
    }
    setstatusText(false)

   

    //const data = { tema, foto, questao, alternativa_correta, opcao1, opcao2, opcao3}

    let partilha = ["60b6aff95361df172869306b"]

    await partilhadas.map((item, index )=> {
        partilha.push(item._id)
    })

    const data = new FormData();

    data.append("tema", tema)
    data.append("imagem", foto)
    data.append("questao", questao)
    data.append("alternativa_correta", alternativa_correta)
    data.append("incorecta_alternativas", [opcao1,"1", opcao2,"1", opcao3])
    data.append("partilhada",partilha)


    try{
        setprogress(true)
        const response = await api.put("questoes", data,{
            headers:{
                _id:datas._id,
            }
        });
        setprogress(false)

        alert(response.data)

        Teste()
        
    }catch{
        setprogress(false)
        alert("Erro ao atualizar")
    }
    
  }

  async function ApagarPergunta(){

      try{
          const response = await api.delete(`/questoes/${datas._id}`,{
              headers:{
                  tema_id:tema_id,
              }
          })
          alert(response.data)
          Teste()
      }catch(error){alert(error)}
  }

  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={Status}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Questão</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Questão aqui"
                    fullWidth
                    value={questao}
                    onChange={e => setquestao(e.target.value)}
                    error={questao < 1 && statusText==true}
                />
                <DialogContentText>
                    Adicione  4 opções, uma delas correctas
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção correcta"
                    fullWidth
                    value={alternativa_correta}
                    onChange={e => setalternativa_correta(e.target.value)}
                    error={alternativa_correta < 1 && statusText==true}
                />
            </DialogContent>
            <DialogContent>
                <DialogContentText>
                    Adicione  3 opções erradas
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 1"
                    fullWidth
                    required
                    value={opcao1}
                    onChange={e => setopcao1(e.target.value)}
                    error={opcao1 < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 2"
                    fullWidth
                    required
                    value={opcao2}
                    onChange={e => setopcao2(e.target.value)}
                    error={opcao2 < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 3"
                    fullWidth
                    value={opcao3}
                    onChange={e => setopcao3(e.target.value)}
                    // error={opcao3 < 1 && statusText==true}
                />


                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={shareds}
                    getOptionLabel={(option) => option?.nome}
                    onChange={(event, value) => {
                        setPartilhadas(value);
                                }}
                    filterSelectedOptions
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        //variant="outlined"
                        value={partilhadas}
                        //getOptionSelected={(option, value) => option?.value === value?.value}
                        label="Partilhar novas "
                        placeholder="Selecione modulos ou teste geral"
                    />
                    )}
                /> 

                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opções Partilhadas"
                    multiline
                    fullWidth
                    required
                    disabled
                    value={partilhasalva}
                    
                />
                <label id="foto" 
                style={{backgroundImage: `url(${previwImg || 'http://server.manna.software:3333/files/'+datas?.imagem})`}}
                className={foto ? "temfoto": ""}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        type="file"
                        onChange={(event) => setfoto(event.target.files[0])}
                        
                    />
                    <p> <PhotoCameraIcon/></p>
                    
                    
                </label>
                <p>Link da imagem atual: {'http://server.manna.software:3333/files/'+datas?.imagem}</p>
                
                
            </DialogContent>
            <DialogActions>

            <Button  color="primary" onClick={() => Teste()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => ApagarPergunta()}>
                Apagar
            </Button>
            <Button  color="primary" onClick={() => EnviarQuestao()}>
                Atualizar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}