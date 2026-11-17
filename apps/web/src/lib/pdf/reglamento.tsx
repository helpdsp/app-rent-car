/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:05:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T03
 */

import React from "react";

export interface ReglamentoInput {
  folioContrato: string;
  clienteNombre: string;
  vehiculoDescripcion: string;
  vehiculoPlacas: string;
  salidaEn: string;
  entradaPrevistaEn: string;
  firmaArrendatarioBase64?: string | null;
}

export const REGLAS_OPERATIVAS = [
  {
    num: 1,
    titulo: "Devolución puntual y tolerancia",
    detalle:
      "La renta vence a las 24 horas exactas de su salida. Se otorgan 59 minutos de cortesía; a partir del minuto 60 se cobra hora extra ($204/h en sedán). A partir de la 5.ª hora de retraso se factura el día completo.",
  },
  {
    num: 2,
    titulo: "Política de combustible",
    detalle:
      "El vehículo se entrega con nivel de gasolina medido en octavos y debe restituirse idéntico. Cada octavo faltante se cobra a precio de bomba más $150 de cargo por servicio.",
  },
  {
    num: 3,
    titulo: "Kilometraje y límites",
    detalle:
      "La renta incluye 500 km diarios acumulables durante el contrato. El km excedente cuesta $3.00 MXN por kilómetro.",
  },
  {
    num: 4,
    titulo: "Prohibición de cruce fronterizo",
    detalle:
      "Queda estrictamente prohibido cruzar a Estados Unidos sin permiso formal por escrito. Intentar el cruce sin autorización invalida toda cobertura de seguro y activa el reporte de abuso de confianza.",
  },
  {
    num: 5,
    titulo: "Inspección de daños y limpieza",
    detalle:
      "Se realiza una inspección fotográfica de 6 ángulos al salir y al entrar. Manchas severas en tapicería o lodo excesivo causan cargo de limpieza de $500 a $1,500.",
  },
  {
    num: 6,
    titulo: "Protocolo en accidentes o fallas",
    detalle:
      "Detenga la unidad inmediatamente y llame a la oficina (686 555 0000). No admita responsabilidad ni firme convenios particulares sin presencia del ajustador de la aseguradora.",
  },
];

export function PlantillaReglamento({ datos }: { datos: ReglamentoInput }) {
  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        color: "#1E1A16",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #B5141B",
          paddingBottom: 12,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 18, color: "#B5141B", fontWeight: 700 }}>
            MÉXICO RENTA DE AUTOS
          </h1>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Reglamento Operativo de Arrendamiento Vehicular
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11 }}>
          <div>Folio de Contrato: <b>{datos.folioContrato}</b></div>
          <div>Cliente: <b>{datos.clienteNombre}</b></div>
          <div>Auto: <b>{datos.vehiculoDescripcion} ({datos.vehiculoPlacas})</b></div>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {REGLAS_OPERATIVAS.map((r) => (
          <div
            key={r.num}
            style={{
              border: "1px solid #E3DCCB",
              borderRadius: 8,
              padding: "8px 12px",
              background: "#FDFCF9",
            }}
          >
            <b style={{ color: "#14583A" }}>{r.num}. {r.titulo}:</b> {r.detalle}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          borderTop: "1px solid #CFC8B8",
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ maxWidth: 380, fontSize: 10, color: "#6B645A" }}>
          Declaro haber recibido copia de este reglamento y comprendo que el incumplimiento de cualquiera de estas disposiciones faculta a la arrendadora para exigir la restitución inmediata de la unidad o deducir los cargos del depósito en garantía.
        </div>
        <div style={{ textAlign: "center", width: 220 }}>
          {datos.firmaArrendatarioBase64 ? (
            <img
              src={datos.firmaArrendatarioBase64}
              alt="Firma del arrendatario"
              style={{ maxHeight: 50, maxWidth: 200, margin: "0 auto" }}
            />
          ) : (
            <div style={{ height: 40, borderBottom: "1px solid #1E1A16" }} />
          )}
          <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>
            Firma de Conformidad
          </div>
          <div style={{ fontSize: 10, color: "#6B645A" }}>{datos.clienteNombre}</div>
        </div>
      </div>
    </div>
  );
}
