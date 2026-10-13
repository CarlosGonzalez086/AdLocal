import { describe, expect, it, vi } from "vitest";
import { citasComercioApi } from "../services/citasComercioApi";
import { diaAgenda, horaCita } from "../utils/citaFecha";
import { comercioApi } from "../services/comercioApi";
import { comercioCreateSchema } from "../schemas/comercioCreate.schema";
const http=vi.hoisted(()=>({get:vi.fn(),put:vi.fn()}));
vi.mock("../api/httpUsuario",()=>({httpUsuario:http}));
describe("Agenda: contrato con versión y hora local",()=>{
  it("protege una actualización con la versión vista por el operador",()=>{
    const dto={versionCita:9,estado:2 as const,nombreAtiende:"Operador"}; citasComercioApi.actualizar(1,"cita",dto);
    expect(http.put).toHaveBeenCalledWith("/Citas/cita",dto,{params:{comercioId:1}});
  });
  it("el filtro conserva el día local de Ciudad de México",()=>{
    expect(diaAgenda(new Date("2026-10-13T02:00:00Z"))).toBe("2026-10-12");
    citasComercioApi.agenda(1,"2026-10-12"); expect(http.get).toHaveBeenCalledWith("/Citas/agenda",{params:{comercioId:1,fecha:"2026-10-12"}});
  });
  it("muestra la hora guardada sin convertirla a otra zona",()=>{ expect(horaCita("2030-05-21T09:30:00")).toBe("09:30"); });
  it("envía zona actual y nueva por el comando independiente",()=>{
    comercioApi.zonaHoraria(1,"America/Tijuana","America/Mexico_City");
    expect(http.put).toHaveBeenCalledWith("/comercios/1/zona-horaria",{zonaHoraria:"America/Tijuana",zonaHorariaAnterior:"America/Mexico_City"});
  });
  it("el schema de creación conserva la zona elegida",()=>{
    const data=comercioCreateSchema.parse({nombre:"Comercio",lat:20,lng:-100,estadoId:1,municipioId:1,zonaHoraria:"America/Cancun"});
    expect(data.zonaHoraria).toBe("America/Cancun");
  });
  it("calcula el día para cada comercio al cambiar de agenda",()=>{
    const ahora=new Date("2026-10-13T06:30:00Z"); expect(diaAgenda(ahora,"America/Tijuana")).toBe("2026-10-12"); expect(diaAgenda(ahora,"America/Cancun")).toBe("2026-10-13");
  });
});
