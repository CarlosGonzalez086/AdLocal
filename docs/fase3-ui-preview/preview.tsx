import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import { useState } from "react";
import theme from "../../src/theme/theme";
import "../../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReembolsoPedidoModal } from "../../src/User/Pages/Pedidos/Components/ReembolsoPedidoModal";
import { InventarioPedidoModal } from "../../src/User/Pages/Pedidos/Components/InventarioPedidoModal";
import { CancelacionPedidoModal } from "../../src/User/Pages/Pedidos/Components/CancelacionPedidoModal";
import { PedidoDetalleModal } from "../../src/User/Pages/Pedidos/Components/PedidoDetalleModal";
import type { PedidoComercioDetalleDto } from "../../src/types/User/pedidosComercio";
const base: PedidoComercioDetalleDto = { uuid:"00000000-0000-0000-0000-000000000003",numeroPedido:"PED-SINTETICO-003",clienteNombre:"Cliente de prueba",clienteEmail:"cliente@example.invalid",total:190,estado:4,estadoPago:3,metodoPago:2,tipoEntrega:1,totalProductos:2,fechaCreacion:"2026-10-12T12:00:00Z",tieneComprobante:true,accionesDisponibles:[5],version:3,restituirReserva:null,inventarioPendiente:false,puedeRegistrarPago:false,puedeReembolsar:true,
productos:[{uuid:"00000000-0000-0000-0000-000000000004",nombre:"Producto sintético con descripción extensa para comprobar la lectura en móvil",cantidad:2,precioUnitario:95,subtotal:190,stockDescontado:2,stockPorRestituir:0,stockRestituido:0}],historial:[{estado:4,evento:"Estado",comentario:"Preparación confirmada por el operador.",fecha:"2026-10-12T12:00:00Z",idUsuarioCambio:7}]};
function Preview(){const [modo,setModo]=useState(new URLSearchParams(location.search).get("modo")??"reembolso");return <><main className="p-4"><h1>Prueba visual local · datos sintéticos</h1><p>Los callbacks no llaman a la API y no mueven dinero.</p>{["reembolso","cancelacion","inventario","detalle"].map(m=><Button key={m} onClick={()=>setModo(m)}>{m}</Button>)}</main>
{modo==="reembolso"&&<ReembolsoPedidoModal pedido={base} cuenta="sintetica-fase3" comercioId={1} onClose={()=>setModo("")} onSave={async dto=>({...base,estado:10,estadoPago:5,reembolso:{uuid:"sintetico",monto:dto.monto,metodo:dto.metodo,referencia:dto.referencia,motivo:dto.motivo,fechaCreacion:new Date().toISOString()}})}/>}
{modo==="cancelacion"&&<CancelacionPedidoModal pedido={{...base,estadoPago:1}} onClose={()=>setModo("")} onSave={async()=>true}/>}
{modo==="inventario"&&<InventarioPedidoModal pedido={{...base,estado:10,inventarioPendiente:true,productos:base.productos.map(p=>({...p,stockDescontado:null}))}} onClose={()=>setModo("")} onSave={async()=>true}/>}
{modo==="detalle"&&<PedidoDetalleModal pedido={base} loading={false} onClose={()=>setModo("")} onCambiarEstado={()=>{}} onRevisarComprobante={()=>{}} onCambiarPago={()=>{}} esDueno onReembolso={()=>setModo("reembolso")} onConciliar={()=>setModo("inventario")}/>}
</>}
ReactDOM.createRoot(document.getElementById("root")!).render(<ThemeProvider theme={theme}><CssBaseline/><Preview/></ThemeProvider>);
