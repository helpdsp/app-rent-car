/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:34:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T02, S04-T08
 */

import { beforeEach, describe, expect, it } from "vitest";
import { GET as vehiculosGet, POST as vehiculosPost } from "../src/app/api/vehiculos/route";
import { GET as vehiculoIdGet, PATCH as vehiculoIdPatch } from "../src/app/api/vehiculos/[id]/route";
import { POST as bloqueosPost } from "../src/app/api/vehiculos/[id]/bloqueos/route";
import { GET as disponiblesGet } from "../src/app/api/vehiculos/disponibles/route";
import { crearSesionDirecta, restaurarEstadoAuthSemilla } from "../src/lib/auth/session";
import {
  actualizarVehiculo,
  calcularDisponibilidad,
  crearVehiculo,
  intentarReservarVehiculo,
  obtenerVehiculoPorId,
  registrarBloqueoMantenimiento,
  registrarDocumentoVehiculo,
  resetearEstadoVehiculos,
} from "../src/lib/db/sprint4";
import { consultarBitacora, resetearEstadoSprint2 } from "../src/lib/db/sprint2";

const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";
const ID_ADMIN_CARLOS = "11111111-1111-4111-8111-111111111102";

beforeEach(() => {
  restaurarEstadoAuthSemilla();
  resetearEstadoSprint2();
  resetearEstadoVehiculos();
});

describe("RF-07 · Clave única y placas únicas", () => {
  it("genera claves automáticas consecutivas e impide placas duplicadas", async () => {
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CARLOS,
      mfaVerificado: true,
    });

    const res = await vehiculosPost(
      new Request("http://localhost/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({
          marca: "Nissan",
          modelo: "Versa",
          tipo: "Sedán",
          color: "Gris",
          placas: "NUE-111-A",
          kilometraje_actual: 15_000,
          valor_asegurado: 25_000_000,
          tarifa_dia: 163_300,
        }),
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.clave_auto).toBe(11);
    expect(body.data.clave_formato).toBe("0011");

    // Intento con placas duplicadas
    const resDuplicado = await vehiculosPost(
      new Request("http://localhost/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({
          marca: "Nissan",
          modelo: "Sentra",
          tipo: "Sedán",
          color: "Negro",
          placas: "NUE-111-A",
          kilometraje_actual: 5_000,
          valor_asegurado: 25_000_000,
          tarifa_dia: 163_300,
        }),
      })
    );
    expect(resDuplicado.status).toBe(409);
    const bodyDuplicado = await resDuplicado.json();
    expect(bodyDuplicado.codigo).toBe("PLACAS_DUPLICADAS");
  });
});

describe("T-14 · Vehículo con póliza vencida: no aparece disponible y no puede asignarse", () => {
  it("excluye a un vehículo cuya póliza esté vencida o venza antes del fin del contrato", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    // Simulamos un vehículo con póliza que vence el 2026-11-20
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444008")!; // Kia Forte 0008
    registrarDocumentoVehiculo(
      vehiculo.id,
      {
        tipo: "poliza",
        fecha_expedicion: "2025-11-20",
        fecha_vencimiento: "2026-11-20", // Póliza vence el 20 de noviembre
        aseguradora: "HDI Seguros",
      },
      { id: ID_OPERADOR_MARIANA, nombre: "Mariana", rol: "operador" }
    );

    // Consulta para un periodo posterior al vencimiento (ej. 2026-11-22 al 2026-11-25)
    const req = new Request(
      "http://localhost/api/vehiculos/disponibles?salida=2026-11-22T10:00:00.000Z&entrada=2026-11-25T10:00:00.000Z",
      {
        headers: {
          Authorization: `Bearer ${sesionOperador.token}`,
        },
      }
    );

    const res = await disponiblesGet(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    const estaDisponible = json.data.disponibles.some(
      (v: { id: string }) => v.id === vehiculo.id
    );
    expect(estaDisponible).toBe(false);

    const noDisponibleInfo = json.data.no_disponibles.find(
      (item: { vehiculo: { id: string } }) => item.vehiculo.id === vehiculo.id
    );
    expect(noDisponibleInfo).toBeDefined();
    expect(noDisponibleInfo.motivo).toBe("documentos_vencidos");
    expect(noDisponibleInfo.detalle).toContain("Póliza de seguro");
  });
});

describe("T-15 · Reducir kilometraje: rechazado salvo corrección de administrador auditada", () => {
  it("rechaza si un operador intenta disminuir el odómetro", async () => {
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444003")!; // 47,215 km
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const res = await vehiculoIdPatch(
      new Request(`http://localhost/api/vehiculos/${vehiculo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionOperador.token}`,
        },
        body: JSON.stringify({
          kilometraje_actual: 45_000, // Menor al actual
        }),
      }),
      { params: Promise.resolve({ id: vehiculo.id }) }
    );

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.codigo).toBe("KILOMETRAJE_INVALIDO");
  });

  it("rechaza a un administrador si no proporciona motivo justificado", async () => {
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444003")!;
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CARLOS,
      mfaVerificado: true,
    });

    const res = await vehiculoIdPatch(
      new Request(`http://localhost/api/vehiculos/${vehiculo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({
          kilometraje_actual: 46_000,
          // Sin motivo_correccion_km
        }),
      }),
      { params: Promise.resolve({ id: vehiculo.id }) }
    );

    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.codigo).toBe("MOTIVO_REQUERIDO");
  });

  it("permite a un administrador reducir el odómetro con motivo y queda registrado en la bitácora", async () => {
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444003")!;
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CARLOS,
      mfaVerificado: true,
    });

    const res = await vehiculoIdPatch(
      new Request(`http://localhost/api/vehiculos/${vehiculo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({
          kilometraje_actual: 46_800,
          motivo_correccion_km: "Error tipográfico en captura de entrega anterior",
        }),
      }),
      { params: Promise.resolve({ id: vehiculo.id }) }
    );

    expect(res.status).toBe(200);
    const vActualizado = obtenerVehiculoPorId(vehiculo.id)!;
    expect(vActualizado.kilometraje_actual).toBe(46_800);

    // Verificar entrada en auditoría
    const bitacora = consultarBitacora({ tabla: "vehiculos" });
    const entrada = bitacora.find(
      (b) =>
        b.registro_id === vehiculo.id &&
        b.registro_descripcion?.includes("Motivo corrección km")
    );
    expect(entrada).toBeDefined();
    expect(entrada?.registro_descripcion).toContain("Error tipográfico");
  });
});

describe("T-20 · Concurrencia con 20 intentos paralelos: exclusión GiST de fechas cruzadas", () => {
  it("garantiza que de 20 intentos simultáneos de reservar el mismo auto en fechas que se cruzan, exactamente 1 gana y 19 son rechazados con 409", async () => {
    const vehiculoId = "44444444-4444-4444-8444-444444444003"; // Hyundai Elantra disponible
    const salidaIso = "2026-12-01T10:00:00.000Z";
    const entradaIso = "2026-12-05T10:00:00.000Z";

    // Disparamos 20 intentos concurrentes de reserva para el mismo rango
    const intentos = Array.from({ length: 20 }, (_, i) => {
      const folio = `D-CONCUR-${i + 1}`;
      return intentarReservarVehiculo(vehiculoId, salidaIso, entradaIso, folio);
    });

    const resultados = await Promise.all(intentos);

    const exitosos = resultados.filter((r) => r.ok);
    const fallidos = resultados.filter((r) => !r.ok);

    // Exactamente 1 contrato gana la reserva
    expect(exitosos).toHaveLength(1);
    // Los otros 19 son rechazados por conflicto de exclusión GiST
    expect(fallidos).toHaveLength(19);

    for (const f of fallidos) {
      if (!f.ok) {
        expect(f.codigo).toBe("VEHICULO_NO_DISPONIBLE");
      }
    }
  });
});

describe("T-21 · Contratos consecutivos sin cruce (cierre tocante en límites de rango [A, B) y [B, C))", () => {
  it("permite contratos consecutivos donde el primero termina a las 11:00 y el segundo inicia a las 11:00", async () => {
    const vehiculoId = "44444444-4444-4444-8444-444444444003";

    const r1 = await intentarReservarVehiculo(
      vehiculoId,
      "2026-12-10T11:00:00.000Z",
      "2026-12-13T11:00:00.000Z",
      "D-09001"
    );
    expect(r1.ok).toBe(true);

    // Segundo contrato inicia exactamente al minuto en que termina el primero (11:00)
    const r2 = await intentarReservarVehiculo(
      vehiculoId,
      "2026-12-13T11:00:00.000Z",
      "2026-12-15T11:00:00.000Z",
      "D-09002"
    );
    expect(r2.ok).toBe(true);
  });
});

describe("T-22 · Bloqueo por mantenimiento que cruza un contrato existente", () => {
  it("rechaza el bloqueo con 409 y muestra el folio del contrato activo si cruza fechas", async () => {
    // El Kia Forte clave 0002 tiene contrato vigente 08160 del 15 al 18 de nov 2026
    const vehiculoId = "44444444-4444-4444-8444-444444444002";
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CARLOS,
      mfaVerificado: true,
    });

    const res = await bloqueosPost(
      new Request(`http://localhost/api/vehiculos/${vehiculoId}/bloqueos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({
          desde: "2026-11-16T08:00:00.000Z",
          hasta: "2026-11-17T18:00:00.000Z",
          motivo: "Revisión en taller mecánico",
        }),
      }),
      { params: Promise.resolve({ id: vehiculoId }) }
    );

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.codigo).toBe("CRUCE_CONTRATO_EXISTENTE");
    expect(body.contrato_folio).toBe("08160");
  });
});
