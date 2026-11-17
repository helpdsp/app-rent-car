/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:10:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T01
 */

import React from "react";
import { ClausulasLegales, type ParametrosLegalesContrato } from "./clausulas";

export interface ContratoCaratulaDatos {
  folio: string;
  folioPapel?: string | null;
  fechaEmision: string;
  cliente: {
    nombre: string;
    rfc?: string | null;
    telefono: string;
    domicilio?: string | null;
    licenciaNumero: string;
    licenciaVencimiento: string;
  };
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
    placas: string;
    anio?: number | null;
    kmSalida: number;
    gasolinaSalidaOctavos: number;
  };
  fechas: {
    salida: string;
    entradaPrevista: string;
    destino: string;
    lugarDevolucion: string;
    salidaPaisAutorizada: boolean;
  };
  tarifas: {
    dias: number;
    tarifaDia: number; // en pesos
    anticipo: number; // en pesos
    tarifaHoraExtra: number;
    tarifaKmExtra: number;
    kmIncluidos: number;
    depositoGarantia: number;
  };
  conductoresAdicionales?: Array<{
    nombre: string;
    licenciaNumero: string;
    licenciaVencimiento: string;
    telefono?: string | null;
  }>;
  pagare?: {
    activado: boolean;
    monto: number;
    interesTexto?: string | null;
    ciudadFecha?: string | null;
    suscriptor?: string | null;
  } | null;
  firmas?: {
    arrendatarioBase64?: string | null;
    conductorBase64?: string | null;
    pagareBase64?: string | null;
  } | null;
  parametrosLegales?: ParametrosLegalesContrato;
}

export function CaratulaContratoPDF({ datos }: { datos: ContratoCaratulaDatos }) {
  const folioMostrar = datos.folio || datos.folioPapel || "D-00001";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        background: "#fff",
        color: "#1E1A16",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        lineHeight: 1.4,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      {/* PÁGINA 1: CARÁTULA PRINCIPAL */}
      <section style={{ pageBreakAfter: "always", minHeight: 960, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Header */}
        <header
          style={{
            borderBottom: "2px solid #B5141B",
            paddingBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#B5141B", fontSize: 22, fontWeight: 700 }}>
              MÉXICO RENTA DE AUTOS
            </h1>
            <div style={{ fontSize: 11, color: "#4A443B" }}>
              Calz. de Las Américas 837-E, Mexicali, B.C. · Tel. 686 555 0000
            </div>
          </div>
          <div
            style={{
              border: "2px solid #B5141B",
              borderRadius: 8,
              padding: "4px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" }}>
              CONTRATO DE ARRENDAMIENTO
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#B5141B" }}>
              {folioMostrar}
            </div>
            {datos.folioPapel && (
              <div style={{ fontSize: 9, color: "#6B645A" }}>
                Folio físico: {datos.folioPapel}
              </div>
            )}
          </div>
        </header>

        {/* Rejilla de datos principales */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* Bloque Cliente */}
          <div style={{ border: "1px solid #D8CFB8", borderRadius: 8, padding: "8px 12px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 13, color: "#14583A", fontWeight: 700 }}>
              Datos del Arrendatario
            </h2>
            <div><b>Nombre:</b> {datos.cliente.nombre}</div>
            {datos.cliente.rfc && <div><b>RFC:</b> {datos.cliente.rfc}</div>}
            <div><b>Teléfono:</b> {datos.cliente.telefono}</div>
            {datos.cliente.domicilio && <div><b>Domicilio:</b> {datos.cliente.domicilio}</div>}
            <div>
              <b>Licencia:</b> {datos.cliente.licenciaNumero} (Vence: {datos.cliente.licenciaVencimiento})
            </div>
          </div>

          {/* Bloque Vehículo */}
          <div style={{ border: "1px solid #D8CFB8", borderRadius: 8, padding: "8px 12px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 13, color: "#14583A", fontWeight: 700 }}>
              Datos del Vehículo
            </h2>
            <div><b>Vehículo:</b> {datos.vehiculo.marca} {datos.vehiculo.modelo} ({datos.vehiculo.color})</div>
            <div><b>Placas:</b> {datos.vehiculo.placas}</div>
            <div><b>Kilometraje salida:</b> {datos.vehiculo.kmSalida.toLocaleString("es-MX")} km</div>
            <div><b>Combustible salida:</b> {datos.vehiculo.gasolinaSalidaOctavos}/8 de tanque</div>
          </div>
        </div>

        {/* Bloque Fechas y Destino */}
        <div style={{ border: "1px solid #D8CFB8", borderRadius: 8, padding: "8px 12px" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 13, color: "#14583A", fontWeight: 700 }}>
            Periodo y Ruta Autorizada
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <div><b>Salida:</b> {datos.fechas.salida}</div>
            <div><b>Devolución prevista:</b> {datos.fechas.entradaPrevista}</div>
            <div><b>Destino:</b> {datos.fechas.destino}</div>
            <div><b>Lugar de devolución:</b> {datos.fechas.lugarDevolucion}</div>
            <div>
              <b>Salida del país:</b>{" "}
              {datos.fechas.salidaPaisAutorizada ? "AUTORIZADA CON PERMISO" : "NO AUTORIZADA"}
            </div>
            <div><b>Días de renta:</b> {datos.tarifas.dias} días</div>
          </div>
        </div>

        {/* Bloque Tarifas y Cargos (Caso 08160) */}
        <div style={{ border: "1px solid #D8CFB8", borderRadius: 8, padding: "8px 12px", background: "#FDFCF9" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 13, color: "#14583A", fontWeight: 700 }}>
            Liquidación de Anticipo y Garantía
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            <div><b>Tarifa diaria:</b> ${datos.tarifas.tarifaDia.toLocaleString("es-MX")}</div>
            <div><b>Km incluidos:</b> {datos.tarifas.kmIncluidos.toLocaleString("es-MX")} km</div>
            <div><b>Hora extra:</b> ${datos.tarifas.tarifaHoraExtra.toLocaleString("es-MX")}</div>
            <div><b>Km extra:</b> ${datos.tarifas.tarifaKmExtra.toLocaleString("es-MX")}</div>
          </div>
          <div
            style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid #EFE9DB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <b>Anticipo de renta pagado:</b> ${datos.tarifas.anticipo.toLocaleString("es-MX")} ({datos.tarifas.dias} días × ${datos.tarifas.tarifaDia.toLocaleString("es-MX")})
            </div>
            <div>
              <b>Depósito en garantía:</b> ${datos.tarifas.depositoGarantia.toLocaleString("es-MX")}
            </div>
          </div>
        </div>

        {/* Conductores Adicionales si existen */}
        {datos.conductoresAdicionales && datos.conductoresAdicionales.length > 0 && (
          <div style={{ border: "1px solid #D8CFB8", borderRadius: 8, padding: "8px 12px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 13, color: "#14583A", fontWeight: 700 }}>
              Conductor(es) Adicional(es) Autorizado(s)
            </h2>
            {datos.conductoresAdicionales.map((c, i) => (
              <div key={i} style={{ fontSize: 11 }}>
                • <b>{c.nombre}</b> — Licencia: {c.licenciaNumero} (Vence: {c.licenciaVencimiento})
              </div>
            ))}
          </div>
        )}

        {/* Bloque Pagaré si está activado (RF-26) */}
        {datos.pagare?.activado && (
          <div style={{ border: "1px solid #B0A793", borderRadius: 8, padding: "8px 12px", background: "#FBF7E9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>PAGARÉ MERCANTIL EN GARANTÍA</span>
              <span>BUENO POR: ${datos.pagare.monto.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN</span>
            </div>
            <div style={{ fontSize: 10, marginTop: 4, lineHeight: 1.3 }}>
              Debo(emos) y pagaré(mos) incondicionalmente por este Pagaré a la orden de <b>México Renta de Autos, S.A. de C.V.</b> en la ciudad de Mexicali, B.C., la cantidad de <b>${datos.pagare.monto.toLocaleString("es-MX")} MXN</b>. Valor recibido a mi entera satisfacción. Si no fuera pagado a su vencimiento causará interés moratorio al tipo pactado de {datos.pagare.interesTexto ?? "2.5%"} mensual.
            </div>
            <div style={{ fontSize: 10, marginTop: 4, textAlign: "right" }}>
              Suscriptor: <b>{datos.pagare.suscriptor ?? datos.cliente.nombre}</b> · {datos.pagare.ciudadFecha ?? "Mexicali, B.C."}
            </div>
          </div>
        )}

        {/* Área de Firmas */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #CFC8B8",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            textAlign: "center",
          }}
        >
          <div>
            {datos.firmas?.arrendatarioBase64 ? (
              <img
                src={datos.firmas.arrendatarioBase64}
                alt="Firma del Arrendatario"
                style={{ maxHeight: 60, maxWidth: 220, margin: "0 auto" }}
              />
            ) : (
              <div style={{ height: 50, borderBottom: "1px solid #1E1A16" }} />
            )}
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>
              Firma del Arrendatario
            </div>
            <div style={{ fontSize: 10, color: "#6B645A" }}>{datos.cliente.nombre}</div>
          </div>

          <div>
            <div style={{ height: 50, borderBottom: "1px solid #1E1A16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6B645A" }}>
              [Por la Arrendadora]
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>
              México Renta de Autos
            </div>
            <div style={{ fontSize: 10, color: "#6B645A" }}>Representante Autorizado</div>
          </div>
        </div>

        <div style={{ fontSize: 9, color: "#6B645A", textAlign: "center" }}>
          Contrato firmado digitalmente. La huella criptográfica SHA-256 garantiza su inmutabilidad frente a alteraciones.
        </div>
      </section>

      {/* PÁGINA 2: CLÁUSULAS GENERALES */}
      <section style={{ minHeight: 960, paddingTop: 16 }}>
        <ClausulasLegales parametros={datos.parametrosLegales} />
      </section>
    </div>
  );
}
