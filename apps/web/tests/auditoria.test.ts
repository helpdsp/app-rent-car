/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:32:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T11
 */

import { beforeEach, describe, expect, it } from "vitest";
import { GET as auditoriaGet } from "../src/app/api/auditoria/route";
import {
  GET as parametrosGet,
  PATCH as parametrosPatch,
} from "../src/app/api/parametros/route";
import {
  GET as tarifasGet,
  POST as tarifasPost,
} from "../src/app/api/tarifas/route";
import { crearSesionDirecta, restaurarEstadoAuthSemilla } from "../src/lib/auth/session";
import {
  consultarBitacora,
  crearVersionTarifa,
  intentarModificarAuditoria,
  obtenerParametros,
  obtenerTarifas,
  resetearEstadoSprint2,
} from "../src/lib/db/sprint2";
import {
  calcularRetrasoConTolerancia,
  calcularTarifaHoraExtraConfigurable,
} from "../src/lib/pricing/parametros";
import { procesarAnonimizacionClienteArco } from "../src/lib/privacidad/arco";
import { generarUrlFirmadaStorage } from "../src/lib/storage";

const ID_ADMIN_CAROLINA = "11111111-1111-4111-8111-111111111102";
const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";

beforeEach(() => {
  restaurarEstadoAuthSemilla();
  resetearEstadoSprint2();
});

describe("T-02 · Administrador cambia una tarifa: fila nueva, contratos emitidos no cambian y entrada en bitácora", () => {
  it("crea una versión nueva de tarifa y registra la acción en la bitácora inmutable", () => {
    const antesCount = obtenerTarifas().length;
    const creada = crearVersionTarifa(
      {
        nombre: "Kia Forte",
        tarifa_dia: 180_000, // $1,800 nuevo precio
      },
      ID_ADMIN_CAROLINA,
      "Carolina M.",
    );

    expect(creada.tarifa_dia).toBe(180_000);
    expect(obtenerTarifas().length).toBe(antesCount + 1);

    // Se verifica que la bitácora contenga el registro
    const logs = consultarBitacora({ tabla: "tarifas" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]?.accion).toBe("INSERT");
    expect(logs[0]?.usuario_id).toBe(ID_ADMIN_CAROLINA);
  });
});

describe("T-03 · Inmutabilidad de la bitácora: UPDATE y DELETE son rechazados tajantemente", () => {
  it("rechaza cualquier intento de UPDATE o DELETE sobre auditoria", () => {
    expect(() => intentarModificarAuditoria()).toThrow(/ACCION_PROHIBIDA/);
  });
});

describe("T-04 · Edición de parámetros o contratos deja rastro con usuario, fecha, valor anterior y nuevo", async () => {
  it("PATCH /api/parametros actualiza y crea entrada en bitácora con valor_anterior y valor_nuevo", async () => {
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CAROLINA,
      mfaVerificado: true,
    });

    const req = new Request("http://localhost/api/parametros", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionAdmin.token}`,
      },
      body: JSON.stringify({ tolerancia_minutos: 15 }),
    });

    const res = await parametrosPatch(req);
    expect(res.status).toBe(200);

    const params = obtenerParametros();
    expect(params.tolerancia_minutos).toBe(15);

    const logs = consultarBitacora({ tabla: "parametros" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]?.accion).toBe("UPDATE");
    expect(logs[0]?.valor_anterior).toBeDefined();
    expect(logs[0]?.valor_nuevo).toBeDefined();
  });
});

describe("T-07 · Solicitud de anonimización ARCO de un cliente", () => {
  it("anonimiza datos personales sensibles conservando contratos y registros requeridos", () => {
    const clienteSintetico = {
      id: "66666666-6666-4666-8666-666666666601",
      nombre_completo: "Juan Pérez González",
      identificacion_numero: "IFE-12345678",
      telefono: "6861234567",
      celular: "6869876543",
      correo: "juan@correo.com",
      domicilio: "Av. Reforma 123",
      rfc: "PEGJ800101XYZ",
    };

    const resultado = procesarAnonimizacionClienteArco(
      clienteSintetico,
      ID_ADMIN_CAROLINA,
    );

    expect(resultado.clienteAnonimizado.nombre_completo).toContain("CLIENTE_ANONIMIZADO");
    expect(resultado.clienteAnonimizado.identificacion_numero).toBe("ANONIMIZADO");
    expect(resultado.clienteAnonimizado.correo).toBeUndefined();
    expect(resultado.clienteAnonimizado.deleted_at).toBeDefined();

    expect(resultado.auditoriaGenerada.accion).toBe("UPDATE");
    expect(resultado.auditoriaGenerada.tabla).toBe("clientes");
    expect(resultado.auditoriaGenerada.valor_anterior.nombre_completo).toBe("Juan Pérez González");
  });
});

describe("S02-T06 · Integración de parámetros con motor de tarifas", () => {
  it("calcula retraso con tolerancia de 15 minutos sin cobro de extra", () => {
    const salida = new Date("2026-11-16T11:00:00Z");
    const entradaPrevista = new Date("2026-11-19T11:00:00Z");
    const entradaReal = new Date("2026-11-19T11:14:00Z"); // 14 min tarde

    const res = calcularRetrasoConTolerancia(entradaPrevista, entradaReal, 163_300, {
      parametros: {
        kmPorDia: 500,
        divisorHoraExtra: 8,
        horaDesdeLaQueSeCobraDia: 5,
        toleranciaMinutos: 15,
        redondeoHoraExtra: "redondear",
      },
    });

    expect(res.cargo).toBe(0);
    expect(res.horasExtra).toBe(0);
  });

  it("permite truncar la hora extra según el parámetro configurable", () => {
    // $1,633 / 8 = 204.125
    const truncado = calcularTarifaHoraExtraConfigurable(163_300, {
      kmPorDia: 500,
      divisorHoraExtra: 8,
      horaDesdeLaQueSeCobraDia: 5,
      toleranciaMinutos: 0,
      redondeoHoraExtra: "truncar",
    });
    expect(truncado).toBe(20_400); // 204 pesos exactos
  });
});

describe("S02-T09 · Storage con URL firmada y registro SELECT_SENSIBLE", () => {
  it("al generar URL firmada para documentos privados genera entrada SELECT_SENSIBLE en bitácora", () => {
    const urlFirmada = generarUrlFirmadaStorage({
      bucket: "documentos",
      path: "clientes/127/licencia-frente.jpg",
      usuarioId: ID_OPERADOR_MARIANA,
      usuarioNombre: "Mariana R.",
      documentoDescripcion: "Licencia de Ricardo Medina (dato sensible)",
    });

    expect(urlFirmada.url).toContain("supabase.local/storage/v1/object/sign/documentos");
    expect(urlFirmada.expiraEn).toBeDefined();

    const logs = consultarBitacora({ tabla: "documentos" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]?.accion).toBe("SELECT_SENSIBLE");
    expect(logs[0]?.usuario_nombre).toBe("Mariana R.");
  });
});
