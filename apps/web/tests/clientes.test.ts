/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:41:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T10
 */

import { beforeEach, describe, expect, it } from "vitest";
import { POST as lecturaPost } from "../src/app/api/archivos/lectura/route";
import { POST as subidaPost } from "../src/app/api/archivos/subida/route";
import { GET as clientesGet, POST as clientesPost } from "../src/app/api/clientes/route";
import { crearSesionDirecta, restaurarEstadoAuthSemilla } from "../src/lib/auth/session";
import {
  crearCliente,
  obtenerClientes,
  registrarDocumentoCliente,
  resetearEstadoClientes,
} from "../src/lib/db/sprint3";
import { consultarBitacora, resetearEstadoSprint2 } from "../src/lib/db/sprint2";

const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";

beforeEach(() => {
  restaurarEstadoAuthSemilla();
  resetearEstadoSprint2();
  resetearEstadoClientes();
});

describe("T-10 · Dos clientes con la misma identificación oficial: detección de duplicado (409)", () => {
  it("rechaza el registro de un cliente con identificación ya registrada", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    // Intentar registrar un cliente con la identificación de Ricardo Medina Salazar (B2302042880)
    const req = new Request("http://localhost/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        nombre_completo: "Ricardo Duplicado",
        identificacion_numero: "B2302042880",
        telefono: "6865551122",
      }),
    });

    const res = await clientesPost(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.codigo).toBe("CLIENTE_DUPLICADO");
    expect(body.mensaje).toContain("Ricardo Medina Salazar");
  });
});

describe("T-11 · RFC inválido: rechazo con 422 y mensaje claro", () => {
  it("responde 422 con mensaje descriptivo si el RFC no cumple el formato del SAT", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const req = new Request("http://localhost/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        nombre_completo: "Empresa Invalida SA",
        identificacion_numero: "ID-999888",
        telefono: "6865550000",
        rfc: "RFC_NO_VALIDO_123",
      }),
    });

    const res = await clientesPost(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.codigo).toBe("VALIDACION_FALLIDA");
    expect(body.mensaje).toContain("RFC no tiene un formato válido");
  });

  it("acepta un RFC válido de persona moral o física (201)", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const req = new Request("http://localhost/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        nombre_completo: "Transportes del Norte SA de CV",
        identificacion_numero: "ACTA-CONST-1234",
        telefono: "6865558899",
        rfc: "TNO950101ABC",
        requiere_factura: true,
      }),
    });

    const res = await clientesPost(req);
    expect(res.status).toBe(201);
  });
});

describe("T-12 · Subida de documentos va directo a Storage con URL firmada", () => {
  it("genera URL firmada para subida directa a Storage privado en /api/archivos/subida", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const req = new Request("http://localhost/api/archivos/subida", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        bucket: "documentos",
        nombreArchivo: "licencia_frente.jpg",
        entidadId: "cliente_127",
      }),
    });

    const res = await subidaPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url_subida).toContain("supabase.local/storage/v1/object/sign/documentos");
    expect(data.path_almacenado).toContain("documentos/cliente_127");
  });
});

describe("T-13 · Leer un documento sensible genera SELECT_SENSIBLE en la bitácora", () => {
  it("al solicitar lectura de documento sensible queda asentado en auditoria con fecha y usuario", async () => {
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
        path: "clientes/127/ine_reverso.jpg",
        documento_descripcion: "Credencial de elector INE (reverso) de Ricardo Medina",
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
    expect(logs[0]?.registro_descripcion).toContain("Credencial de elector");
  });
});

describe("S03-T07 · Búsqueda flexible de clientes", () => {
  it("encuentra al cliente por nombre parcial, teléfono, RFC o identificación", () => {
    const porNombre = obtenerClientes("Medina");
    expect(porNombre.length).toBe(1);
    expect(porNombre[0]?.nombre_completo).toBe("Ricardo Medina Salazar");

    const porTel = obtenerClientes("5550142");
    expect(porTel.length).toBe(1);

    const porId = obtenerClientes("B2302042880");
    expect(porId.length).toBe(1);

    const porRfc = obtenerClientes("GAS900101XYZ");
    expect(porRfc.length).toBe(1);
    expect(porRfc[0]?.nombre_completo).toBe("Ana Sofía Gastélum");
  });
});
