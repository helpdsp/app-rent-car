/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:46:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T04
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerTodasLasAlertas, type AlertaRow } from "./revisar";

/**
 * Marca como atendidas las alertas asociadas a un documento cuando se sube su renovación (RF-10, T-25)
 */
export function marcarAlertasComoAtendidas(
  documentoId: string,
  autor?: { id: string; nombre: string },
  opciones?: { entidadId?: string; tipoDocumento?: string }
): AlertaRow[] {
  const alertas = obtenerTodasLasAlertas();
  const alertasActualizadas: AlertaRow[] = [];
  const ahora = new Date().toISOString();

  for (const alerta of alertas) {
    const coincideId = alerta.documento_id === documentoId;
    const coincideEntidad =
      opciones?.entidadId &&
      opciones?.tipoDocumento &&
      alerta.entidad_id === opciones.entidadId &&
      alerta.tipo_documento === opciones.tipoDocumento;

    if ((coincideId || coincideEntidad) && alerta.estado !== "atendida") {
      const estadoAnterior = alerta.estado;
      alerta.estado = "atendida";
      alerta.updated_at = ahora;
      alertasActualizadas.push(alerta);

      registrarAuditoria({
        usuario_id: autor?.id ?? null,
        usuario_nombre: autor?.nombre ?? "Sistema (Renovación de documento)",
        accion: "UPDATE",
        tabla: "alertas",
        registro_id: alerta.id,
        registro_descripcion: `Alerta para ${alerta.tipo_documento} (${alerta.entidad_descripcion}) marcada como ATENDIDA por renovación`,
        valor_anterior: { estado: estadoAnterior },
        valor_nuevo: { estado: "atendida", updated_at: ahora },
      });
    }
  }

  return alertasActualizadas;
}
