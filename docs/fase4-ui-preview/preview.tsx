import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import theme from "../../src/theme/theme";
import "../../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CitaDetalleModal } from "../../src/User/Pages/Citas/Components/CitaDetalleModal";
import type { CitaDto } from "../../src/types/User/citas";
import { ComercioZonaHoraria } from "../../src/User/Pages/Comercio/Components/ComercioZonaHoraria";
import { comercioApi } from "../../src/services/comercioApi";
import { AxiosHeaders } from "axios";
comercioApi.zonaHoraria=async(_id,zona)=>({data:{codigo:"200",mensaje:"Resultado sintético",respuesta:zona},status:200,statusText:"OK",headers:{},config:{headers:new AxiosHeaders()}});
const terminal = new URLSearchParams(location.search).get("modo") === "terminal";
const cita: CitaDto = { uuid:"00000000-0000-0000-0000-000000000004",productoUuid:"00000000-0000-0000-0000-000000000050",version:3,zonaHoraria:"America/Mexico_City",accionesDisponibles:terminal?[]:[2,5],comercio:"Comercio sintético",servicio:"Servicio sintético de atención con nombre extenso para revisar la lectura en móvil",cliente:"Cliente de ejemplo",nombrePersona:"Persona de prueba",notasCliente:"Datos ficticios. Ningún callback llama al API.",fechaInicio:"2030-05-21T09:00:00",fechaFin:"2030-05-21T09:30:00",estado:terminal?5:1,motivoCancelacion:terminal?"Cancelación sintética confirmada":"" };
function Preview(){const[open,setOpen]=useState(true);const[zona,setZona]=useState("America/Mexico_City");const modoZona=new URLSearchParams(location.search).get("modo")==="zona";return <><main className="p-4"><h1>Vista sintética local</h1><p>Callbacks sin conexión a API.</p>{modoZona&&<ComercioZonaHoraria comercioId={999} actual={zona} editable onConfirmada={setZona}/>}</main>{!modoZona&&<CitaDetalleModal cita={open?cita:null} loading={false} onClose={()=>setOpen(false)} onSave={async()=>({success:true})}/>}</>}
ReactDOM.createRoot(document.getElementById("root")!).render(<ThemeProvider theme={theme}><CssBaseline/><Preview/></ThemeProvider>);
