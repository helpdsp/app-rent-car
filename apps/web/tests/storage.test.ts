/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:33:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 16
 * @sprint_number 16
 * @task_id S16-T07
 */

import { describe, it, expect, beforeEach } from "vitest";
import { comprimirImagenAWebP } from "../src/lib/storage/image-compression";
import { POST as uploadHandler } from "../src/app/api/storage/upload/route";
import { POST as signedUrlHandler } from "../src/app/api/storage/signed-url/route";
import { NextRequest } from "next/server";
import { consultarBitacora } from "../src/lib/db/sprint2";

describe("Sprint 16: Almacenamiento y Compresión WebP (RF-36)", () => {
  describe("Compresión de imágenes en cliente (WebP)", () => {
    it("debe procesar un Blob y retornar estructura de ResultadoCompresion con ahorro", async () => {
      // Crear un blob de prueba simulando foto de 500 KB
      const bytesOriginales = new Uint8Array(500_000);
      const fakeBlob = new Blob([bytesOriginales], { type: "image/jpeg" });

      const resultado = await comprimirImagenAWebP(fakeBlob, {
        maxAncho: 1200,
        calidad: 0.8,
      });

      expect(resultado).toBeDefined();
      expect(resultado.tamanoOriginalBytes).toBe(500_000);
      expect(resultado.tamanoFinalBytes).toBeLessThanOrEqual(resultado.tamanoOriginalBytes);
      expect(resultado.dataUrl).toContain("data:image/webp;base64");
      expect(resultado.ahorroPorcentaje).toBeGreaterThanOrEqual(0);
    });
  });

  describe("API /api/storage/upload", () => {
    it("debe rechazar solicitudes con parámetros incompletos (400)", async () => {
      const formData = new FormData();
      formData.append("bucket", "evidencias-entrega");

      const req = new NextRequest("http://localhost:3000/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const res = await uploadHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.ok).toBe(false);
      expect(json.error).toContain("Faltan parámetros requeridos");
    });

    it("debe rechazar buckets no permitidos (400)", async () => {
      const formData = new FormData();
      const dummyFile = new File(["dummy content"], "archivo.png", { type: "image/png" });
      formData.append("file", dummyFile);
      formData.append("bucket", "bucket-malicioso-hacker");
      formData.append("path", "hacked.png");

      const req = new NextRequest("http://localhost:3000/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const res = await uploadHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.ok).toBe(false);
      expect(json.error).toContain("no es válido");
    });

    it("debe rechazar archivos con tipos MIME no autorizados (415)", async () => {
      const formData = new FormData();
      const scriptFile = new File(["malware"], "script.exe", { type: "application/x-msdownload" });
      formData.append("file", scriptFile);
      formData.append("bucket", "evidencias-entrega");
      formData.append("path", "script.exe");

      const req = new NextRequest("http://localhost:3000/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const res = await uploadHandler(req);
      const json = await res.json();

      expect(res.status).toBe(415);
      expect(json.ok).toBe(false);
      expect(json.error).toContain("no permitido");
    });

    it("debe aceptar archivos válidos (WebP/JPEG/PNG) y registrar auditoría", async () => {
      const formData = new FormData();
      const fakeWebP = new File([new Uint8Array(10_000)], "foto_frente.webp", {
        type: "image/webp",
      });
      formData.append("file", fakeWebP);
      formData.append("bucket", "evidencias-entrega");
      formData.append("path", "contratos/D-00001/frente.webp");

      const req = new NextRequest("http://localhost:3000/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const res = await uploadHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.ok).toBe(true);
      expect(json.bucket).toBe("evidencias-entrega");
      expect(json.path).toBe("contratos/D-00001/frente.webp");

      // Verificar registro en bitácora de auditoría inmutable
      const logs = consultarBitacora();
      const logUpload = logs.find(
        (l) => l.registro_id === "evidencias-entrega/contratos/D-00001/frente.webp"
      );
      expect(logUpload).toBeDefined();
      expect(logUpload?.accion).toBe("INSERT");
    });
  });

  describe("API /api/storage/signed-url", () => {
    it("debe rechazar solicitud sin parámetros requeridos (400)", async () => {
      const req = new NextRequest("http://localhost:3000/api/storage/signed-url", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await signedUrlHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.ok).toBe(false);
    });

    it("debe generar URL firmada con tiempo de expiración y registrar auditoría de lectura sensible", async () => {
      const req = new NextRequest("http://localhost:3000/api/storage/signed-url", {
        method: "POST",
        body: JSON.stringify({
          bucket: "licencias",
          path: "clientes/licencia_123.jpg",
          expiraEnSegundos: 600,
        }),
      });

      const res = await signedUrlHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.ok).toBe(true);
      expect(json.signedUrl).toBeDefined();
      expect(json.expiraEnSegundos).toBe(600);

      // Verificar que se auditó el acceso a datos sensibles
      const logs = consultarBitacora();
      const logSensible = logs.find(
        (l) => l.accion === "SELECT_SENSIBLE" && l.registro_id === "licencias/clientes/licencia_123.jpg"
      );
      expect(logSensible).toBeDefined();
    });
  });
});
