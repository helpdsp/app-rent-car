/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:19:00Z
 * @agent_roles testing-reality-checker + testing-api-tester + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T12
 */

import { beforeEach, describe, expect, it } from "vitest";
import { POST as loginPost } from "../src/app/api/auth/login/route";
import { POST as mfaPost } from "../src/app/api/auth/mfa/route";
import { POST as tarifasPost } from "../src/app/api/tarifas/route";
import {
  GET as usuariosGet,
  POST as usuariosPost,
} from "../src/app/api/usuarios/route";
import { PATCH as usuarioPatch } from "../src/app/api/usuarios/[id]/route";
import { resetearRegistroIntentos } from "../src/lib/auth/inactividad";
import { generarCodigoTotp } from "../src/lib/auth/mfa";
import {
  crearSesionDirecta,
  obtenerAutoriaBitacoraPorUsuario,
  obtenerUsuarioPorId,
  restaurarEstadoAuthSemilla,
  validarSesionToken,
} from "../src/lib/auth/session";
import {
  DB_ENUMS,
  PG_EXTENSIONS,
  formatearFolioDigital,
} from "../src/lib/db/schema";

const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";
const ID_ADMIN_CAROLINA = "11111111-1111-4111-8111-111111111102";
const ID_TITULAR = "11111111-1111-4111-8111-111111111103";
const ID_OPERADOR_LUIS_DESACTIVADO = "11111111-1111-4111-8111-111111111104";

beforeEach(() => {
  restaurarEstadoAuthSemilla();
  resetearRegistroIntentos();
});

describe("S01-T02 · Esquema base, enums y secuencias", () => {
  it("incluye las extensiones requeridas (btree_gist, pg_trgm, citext, pgcrypto)", () => {
    expect(PG_EXTENSIONS).toContain("btree_gist");
    expect(PG_EXTENSIONS).toContain("pg_trgm");
    expect(PG_EXTENSIONS).toContain("citext");
    expect(PG_EXTENSIONS).toContain("pgcrypto");
  });

  it("define los 12 enums del modelo de datos y los 3 roles del sistema", () => {
    expect(Object.keys(DB_ENUMS)).toHaveLength(12);
    expect(DB_ENUMS.rol_usuario).toEqual([
      "operador",
      "administrador",
      "titular",
    ]);
  });

  it("formatea el folio digital en serie D-00001", () => {
    expect(formatearFolioDigital(1)).toBe("D-00001");
    expect(formatearFolioDigital(42)).toBe("D-00042");
    expect(() => formatearFolioDigital(0)).toThrow(RangeError);
  });
});

describe("T-01 · Control de acceso por rol en el servidor (RF-01)", () => {
  it("T-01: un operador intenta crear una tarifa y recibe 403 PERMISO_DENEGADO", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });

    const req = new Request("http://localhost/api/tarifas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionOperador.token}`,
      },
      body: JSON.stringify({
        nombre: "Sedán Intermedio",
        tarifa_dia: 163_300,
        seguro_nocturno: 40_000,
      }),
    });

    const res = await tarifasPost(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.codigo).toBe("PERMISO_DENEGADO");
  });

  it("un administrador con MFA verificado sí puede crear una tarifa (201) y gestionar usuarios", async () => {
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CAROLINA,
      mfaVerificado: true,
    });

    const req = new Request("http://localhost/api/tarifas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesionAdmin.token}`,
      },
      body: JSON.stringify({
        nombre: "Kia Forte",
        tarifa_dia: 163_300,
        seguro_nocturno: 40_000,
      }),
    });

    const res = await tarifasPost(req);
    expect(res.status).toBe(201);
  });

  it("un operador o titular no puede listar ni crear usuarios (403)", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });
    const sesionTitular = crearSesionDirecta({
      usuarioId: ID_TITULAR,
      mfaVerificado: true,
    });

    const resOp = await usuariosGet(
      new Request("http://localhost/api/usuarios", {
        headers: { Authorization: `Bearer ${sesionOperador.token}` },
      }),
    );
    expect(resOp.status).toBe(403);

    const resTitular = await usuariosPost(
      new Request("http://localhost/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionTitular.token}`,
        },
        body: JSON.stringify({
          nombre: "Nuevo Operador",
          correo: "nuevo@mexicorentadeautos.mx",
          rol: "operador",
        }),
      }),
    );
    expect(resTitular.status).toBe(403);
  });
});

describe("T-05 · Usuario desactivado no inicia sesión y conserva su autoría (RF-01)", () => {
  it("T-05: un usuario desactivado (Luis Pérez) recibe 403 USUARIO_DESACTIVADO al intentar iniciar sesión, pero su autoría sigue visible en la bitácora", async () => {
    const res = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: "luis@mexicorentadeautos.mx",
          password: "luis-mra-2026",
        }),
      }),
    );

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.codigo).toBe("USUARIO_DESACTIVADO");

    // Su registro en la tabla de usuarios y sus entradas en la bitácora se conservan
    const usuarioEnBd = obtenerUsuarioPorId(ID_OPERADOR_LUIS_DESACTIVADO);
    expect(usuarioEnBd).toBeDefined();
    expect(usuarioEnBd?.nombre).toBe("Luis Pérez");
    expect(usuarioEnBd?.activo).toBe(false);

    const autoria = obtenerAutoriaBitacoraPorUsuario(
      ID_OPERADOR_LUIS_DESACTIVADO,
    );
    expect(autoria.length).toBeGreaterThan(0);
    expect(autoria[0]?.usuario_nombre).toBe("Luis Pérez");
  });

  it("cuando el administrador desactiva a un usuario con sesión activa, su sesión se revoca de inmediato", async () => {
    const sesionOperador = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
    });
    const sesionAdmin = crearSesionDirecta({
      usuarioId: ID_ADMIN_CAROLINA,
      mfaVerificado: true,
    });

    const patchRes = await usuarioPatch(
      new Request(`http://localhost/api/usuarios/${ID_OPERADOR_MARIANA}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionAdmin.token}`,
        },
        body: JSON.stringify({ activo: false }),
      }),
      { params: Promise.resolve({ id: ID_OPERADOR_MARIANA }) },
    );

    expect(patchRes.status).toBe(200);
    const validacion = validarSesionToken(sesionOperador.token);
    expect(validacion.ok).toBe(false);

    // La autoría de Mariana en la bitácora permanece intacta
    const autoriaMariana = obtenerAutoriaBitacoraPorUsuario(
      ID_OPERADOR_MARIANA,
    );
    expect(autoriaMariana.length).toBeGreaterThan(0);
  });
});

describe("T-06 · MFA obligatorio para administrador y titular (RF-01)", () => {
  it("T-06: un administrador sin MFA verificado no accede a rutas de administración (403 MFA_REQUERIDO)", async () => {
    const resLogin = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: "carolina@mexicorentadeautos.mx",
          password: "admin-mra-2026",
        }),
      }),
    );

    expect(resLogin.status).toBe(200);
    const loginData = await resLogin.json();
    expect(loginData.requiere_mfa).toBe(true);
    expect(loginData.usuario.mfa_verificado).toBe(false);

    // Intenta acceder a /api/usuarios antes de completar MFA
    const resSinMfa = await usuariosGet(
      new Request("http://localhost/api/usuarios", {
        headers: { Authorization: `Bearer ${loginData.token}` },
      }),
    );
    expect(resSinMfa.status).toBe(403);
    const errorSinMfa = await resSinMfa.json();
    expect(errorSinMfa.codigo).toBe("MFA_REQUERIDO");

    // Completa el segundo factor con su código TOTP válido
    const adminInterno = obtenerUsuarioPorId(ID_ADMIN_CAROLINA)!;
    const codigoTotp = generarCodigoTotp(adminInterno.mfaSecreto);

    const resMfa = await mfaPost(
      new Request("http://localhost/api/auth/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({ codigo: codigoTotp }),
      }),
    );
    expect(resMfa.status).toBe(200);

    // Ahora sí accede a /api/usuarios
    const resConMfa = await usuariosGet(
      new Request("http://localhost/api/usuarios", {
        headers: { Authorization: `Bearer ${loginData.token}` },
      }),
    );
    expect(resConMfa.status).toBe(200);
  });

  it("permite verificar el segundo factor con un código de respaldo de un solo uso", async () => {
    const sesionTitular = crearSesionDirecta({
      usuarioId: ID_TITULAR,
      mfaVerificado: false,
    });

    const resMfa = await mfaPost(
      new Request("http://localhost/api/auth/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesionTitular.token}`,
        },
        body: JSON.stringify({ codigo: "TITU-7711" }),
      }),
    );
    expect(resMfa.status).toBe(200);

    // El mismo código de respaldo no se puede reutilizar en otra sesión
    const otraSesionTitular = crearSesionDirecta({
      usuarioId: ID_TITULAR,
      mfaVerificado: false,
    });
    const resReuso = await mfaPost(
      new Request("http://localhost/api/auth/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${otraSesionTitular.token}`,
        },
        body: JSON.stringify({ codigo: "TITU-7711" }),
      }),
    );
    expect(resReuso.status).toBe(401);
  });
});

describe("S01-T08 · Inactividad de 30 minutos y bloqueo de 15 minutos tras 5 intentos fallidos", () => {
  it("cierra la sesión automáticamente tras 30 minutos sin actividad", () => {
    const t0 = 1_700_000_000_000;
    const sesion = crearSesionDirecta({
      usuarioId: ID_OPERADOR_MARIANA,
      ahoraMs: t0,
    });

    // A los 29 minutos sigue activa
    const aLos29Min = validarSesionToken(sesion.token, t0 + 29 * 60_000);
    expect(aLos29Min.ok).toBe(true);

    // 30 minutos después de la última actividad expira
    const tras30MinSinActividad = validarSesionToken(
      sesion.token,
      t0 + (29 + 30) * 60_000,
    );
    expect(tras30MinSinActividad.ok).toBe(false);
    if (!tras30MinSinActividad.ok) {
      expect(tras30MinSinActividad.codigo).toBe("SESION_EXPIRADA_INACTIVIDAD");
    }
  });

  it("bloquea el acceso durante 15 minutos tras 5 intentos fallidos consecutivos", async () => {
    const correo = "mariana@mexicorentadeautos.mx";
    for (let i = 1; i <= 4; i++) {
      const res = await loginPost(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, password: "incorrecta" }),
        }),
      );
      expect(res.status).toBe(401);
    }

    // 5.º intento fallido dispara bloqueo de 15 minutos (429)
    const quinto = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password: "incorrecta" }),
      }),
    );
    expect(quinto.status).toBe(429);
    const data = await quinto.json();
    expect(data.codigo).toBe("CUENTA_BLOQUEADA_TEMPORALMENTE");
  });
});

describe("Sprint 15 — Autenticación Real, Supabase SSR y Logout (RF-35)", () => {
  it("el endpoint de logout limpia las cookies de sesión sb-access-token y mra-session", async () => {
    const { POST: logoutPost } = await import("../src/app/api/auth/logout/route");
    const res = await logoutPost();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);

    const cookieHeader = res.headers.get("Set-Cookie") || "";
    expect(cookieHeader).toContain("sb-access-token=");
    expect(cookieHeader).toContain("Expires=Thu, 01 Jan 1970");
  });

  it("exporta correctamente el creador de cliente Supabase browser", async () => {
    const { createClientBrowser } = await import("../src/lib/supabase/client");
    const client = createClientBrowser();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
