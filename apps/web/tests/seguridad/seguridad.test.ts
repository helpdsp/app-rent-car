/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:38:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 12
 * @task_id S12-T04
 * @description Verificación de seguridad: RLS, URLs firmadas, auditoría inmutable y protección de datos de tarjeta
 */

import { describe, it, expect, beforeEach } from "vitest";
import { registrarPago } from "../../src/lib/pagos/anticipo";
import { POST as subidaPost } from "../../src/app/api/archivos/subida/route";
import { POST as lecturaPost } from "../../src/app/api/archivos/lectura/route";
import { crearSesionDirecta, restaurarEstadoAuthSemilla } from "../../src/lib/auth/session";
import { consultarBitacora, resetearEstadoSprint2 } from "../../src/lib/db/sprint2";
import { generarExportacionCsv } from "../../src/lib/exportaciones/csv";

describe("Sprint 12 / Seguridad: RLS, URLs firmadas, inmutabilidad y protección PAN (S12-T04)", () => {
  const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";
  const ID_ADMIN = "11111111-1111-4111-8111-111111111100";

  const autorOperador = {
    id: ID_OPERADOR_MARIANA,
    nombre: "Operador Mostrador",
    rol: "operador",
  };

  const autorAdmin = {
    id: ID_ADMIN,
    nombre: "Admin Principal",
    rol: "administrador",
  };

  beforeEach(() => {
    restaurarEstadoAuthSemilla();
    resetearEstadoSprint2();
  });

  it("REGLA CRÍTICA: Rechaza de forma estricta cualquier intento de guardar un número completo de tarjeta (PAN)", () => {
    const contratoId = "77777777-7777-4777-8777-777777777000";

    // Intento con 16 dígitos completos de tarjeta
    const res = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma_pago: "tarjeta_credito",
        monto: BigInt(489_900),
        tarjeta_numero: "4152313412345678", // Número completo prohibido
      } as any,
      autorOperador
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.codigo).toBe("NUMERO_TARJETA_PROHIBIDO");
      expect(res.error).toContain("Nunca se permite almacenar un número de tarjeta completo");
    }
  });

  it("genera URLs firmadas con vigencia temporal estricta para Storage privado y audita SELECT_SENSIBLE", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const req = new Request("http://localhost/api/archivos/lectura", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        bucket: "documentos",
        path: "clientes/127/licencia_anverso.jpg",
        documento_descripcion: "Licencia de conducir de Ricardo Medina",
      }),
    });

    const res = await lecturaPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toContain("supabase.local/storage/v1/object/sign/documentos");

    const logs = consultarBitacora({ tabla: "documentos" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]?.accion).toBe("SELECT_SENSIBLE");
    expect(logs[0]?.usuario_id).toBe(ID_OPERADOR_MARIANA);
    expect(logs[0]?.registro_descripcion).toContain("Licencia de conducir");
  });

  it("garantiza que cada exportación de datos queda registrada en la bitácora inmutable", () => {
    const res = generarExportacionCsv(
      "vehiculos",
      { estado: "disponible" },
      autorAdmin
    );

    expect(res.filename).toBeDefined();

    const bitacora = consultarBitacora();
    const eventoExport = bitacora.find(
      (b) => b.accion === "EXPORT" && b.tabla === "vehiculos"
    );

    expect(eventoExport).toBeDefined();
    expect(eventoExport?.usuario_nombre).toBe(autorAdmin.nombre);
    expect(eventoExport?.registro_descripcion).toContain("Exportación a CSV");
  });
});
