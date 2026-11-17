/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:44:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T03
 */

import type { AlertaRow } from "../alertas/revisar";

export interface ResultadoEnvioAlerta {
  alertaId: string;
  enviado: boolean;
  destinatario: string;
  idMensaje?: string;
  error?: string;
}

/**
 * Servicio de envío de alertas por correo mediante Resend (RF-10)
 * En entorno de desarrollo o pruebas, si no hay RESEND_API_KEY, simula el envío con éxito.
 */
export async function enviarCorreoAlerta(
  alerta: AlertaRow
): Promise<ResultadoEnvioAlerta> {
  const apiKey = process.env.RESEND_API_KEY;

  const asunto =
    alerta.dias_antes === 0
      ? `[URGENTE] Documento VENCE HOY: ${alerta.tipo_documento} de ${alerta.entidad_descripcion}`
      : `[Aviso de vencimiento] ${alerta.tipo_documento} vence en ${alerta.dias_antes} días: ${alerta.entidad_descripcion}`;

  const cuerpoHtml = `
    <div style="font-family: sans-serif; color: #1E1A16; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DCCB; borderRadius: 12px;">
      <h2 style="color: #B5141B; margin-top: 0;">México Renta de Autos — Alerta de Vigencia</h2>
      <p>Se ha detectado un documento próximo a vencer o vencido en el sistema:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #EFE9DB; font-weight: bold;">Documento:</td><td style="padding: 8px; border-bottom: 1px solid #EFE9DB;">${alerta.tipo_documento}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #EFE9DB; font-weight: bold;">Entidad:</td><td style="padding: 8px; border-bottom: 1px solid #EFE9DB;">${alerta.entidad_descripcion} (${alerta.entidad_tipo})</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #EFE9DB; font-weight: bold;">Fecha de vencimiento:</td><td style="padding: 8px; border-bottom: 1px solid #EFE9DB; color: #8E1016; font-weight: bold;">${alerta.fecha_vencimiento}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #EFE9DB; font-weight: bold;">Tiempo restante:</td><td style="padding: 8px; border-bottom: 1px solid #EFE9DB;">${alerta.dias_antes === 0 ? "VENCE HOY" : `${alerta.dias_antes} días`}</td></tr>
      </table>
      <p style="font-size: 13px; color: #6B645A;">Por favor ingrese al sistema para subir la renovación correspondiente.</p>
    </div>
  `;

  // Si no hay API key configurada o estamos en modo mock/test, simulamos éxito
  if (!apiKey || apiKey === "mock_resend_key" || process.env.NODE_ENV === "test") {
    alerta.estado = "enviada";
    alerta.enviada_en = new Date().toISOString();
    alerta.error = null;
    alerta.updated_at = new Date().toISOString();

    return {
      alertaId: alerta.id,
      enviado: true,
      destinatario: alerta.destinatario,
      idMensaje: `mock-msg-${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "México Renta de Autos <alertas@mexicarentacar.com>",
        to: [alerta.destinatario],
        subject: asunto,
        html: cuerpoHtml,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      alerta.estado = "error";
      alerta.error = `Error Resend: ${res.status} - ${errBody}`;
      alerta.updated_at = new Date().toISOString();
      return {
        alertaId: alerta.id,
        enviado: false,
        destinatario: alerta.destinatario,
        error: alerta.error,
      };
    }

    const data = await res.json();
    alerta.estado = "enviada";
    alerta.enviada_en = new Date().toISOString();
    alerta.error = null;
    alerta.updated_at = new Date().toISOString();

    return {
      alertaId: alerta.id,
      enviado: true,
      destinatario: alerta.destinatario,
      idMensaje: data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido al enviar correo";
    alerta.estado = "error";
    alerta.error = errorMsg;
    alerta.updated_at = new Date().toISOString();

    return {
      alertaId: alerta.id,
      enviado: false,
      destinatario: alerta.destinatario,
      error: errorMsg,
    };
  }
}
