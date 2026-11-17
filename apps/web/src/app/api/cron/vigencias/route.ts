/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:50:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T02
 */

import {
  obtenerTodasLasAlertas,
  revisarVigencias,
  type AlertaRow,
} from "@/lib/alertas/revisar";
import { enviarCorreoAlerta } from "@/lib/mail/alertas";
import { registrarAuditoria } from "@/lib/db/sprint2";

/**
 * Valida la autorización para el endpoint cron:
 * - Cabecera `Authorization: Bearer <CRON_SECRET>`
 * - O entorno de test / desarrollo local
 */
function verificarAutorizacionCron(request: Request): boolean {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // Si no está configurado CRON_SECRET, permitimos en desarrollo
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [tipo, token] = authHeader.split(" ");
  return tipo?.toLowerCase() === "bearer" && token === cronSecret;
}

/**
 * GET/POST /api/cron/vigencias — Proceso diario de revisión y notificación de vigencias (RF-10, T-23)
 */
async function ejecutarRevisionVigencias(request: Request) {
  if (!verificarAutorizacionCron(request)) {
    return Response.json(
      { codigo: "NO_AUTORIZADO", error: "Token de cron inválido o no proporcionado" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const fechaParam = url.searchParams.get("fecha") ?? undefined;

  // 1. Revisión idempotente de vigencias
  const { nuevasAlertas, totalRevisados, fechaReferencia } = revisarVigencias(fechaParam);

  // 2. Obtener todas las alertas pendientes para envío de correos
  const todasPendientes = obtenerTodasLasAlertas({ estado: "pendiente" });

  const envios = [];
  for (const alerta of todasPendientes) {
    const resEnvio = await enviarCorreoAlerta(alerta);
    envios.push(resEnvio);
  }

  registrarAuditoria({
    usuario_id: null,
    usuario_nombre: "Cron de Vigencias",
    accion: "EXPORT",
    tabla: "alertas",
    registro_id: "00000000-0000-0000-0000-000000000000",
    registro_descripcion: `Ejecución diaria de cron de vigencias al ${fechaReferencia}: ${totalRevisados} revisados, ${nuevasAlertas.length} nuevas alertas, ${envios.length} correos procesados`,
    valor_anterior: null,
    valor_nuevo: {
      fechaReferencia,
      totalRevisados,
      nuevasAlertas: nuevasAlertas.length,
      envios,
    },
  });

  return Response.json({
    ok: true,
    fecha: fechaReferencia,
    totalRevisados,
    nuevasAlertas: nuevasAlertas.length,
    correosEnviados: envios.filter((e) => e.enviado).length,
    erroresEnvio: envios.filter((e) => !e.enviado).length,
    detalles: envios,
  });
}

export async function GET(request: Request) {
  return ejecutarRevisionVigencias(request);
}

export async function POST(request: Request) {
  return ejecutarRevisionVigencias(request);
}
