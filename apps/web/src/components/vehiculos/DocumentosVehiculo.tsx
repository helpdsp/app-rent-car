/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:22:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T05
 */

"use client";

import React, { useState } from "react";
import type { DocumentoVehiculoRow } from "@/lib/db/sprint4";

interface DocumentosVehiculoProps {
  vehiculoId: string;
  documentos: DocumentoVehiculoRow[];
  onDocumentoActualizado?: () => void;
}

export function DocumentosVehiculo({
  vehiculoId,
  documentos,
  onDocumentoActualizado,
}: DocumentosVehiculoProps) {
  const [modalAbierto, setModalAbierto] = useState<"tarjeta_circulacion" | "poliza" | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [numero, setNumero] = useState("");
  const [fechaExpedicion, setFechaExpedicion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [aseguradora, setAseguradora] = useState("");
  const [agente, setAgente] = useState("");
  const [agenteContacto, setAgenteContacto] = useState("");

  const tarjeta = documentos.find((d) => d.tipo === "tarjeta_circulacion");
  const poliza = documentos.find((d) => d.tipo === "poliza");

  const abrirModal = (tipo: "tarjeta_circulacion" | "poliza") => {
    const docExistente = tipo === "tarjeta_circulacion" ? tarjeta : poliza;
    setModalAbierto(tipo);
    setError(null);
    setNumero(docExistente?.numero || "");
    setFechaExpedicion(docExistente?.fecha_expedicion || "");
    setFechaVencimiento(docExistente?.fecha_vencimiento || "");
    setAseguradora(docExistente?.aseguradora || "");
    setAgente(docExistente?.agente || "");
    setAgenteContacto(docExistente?.agente_contacto || "");
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAbierto) return;
    setCargando(true);
    setError(null);

    try {
      const res = await fetch(`/api/vehiculos/${vehiculoId}/documentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: modalAbierto,
          numero,
          fecha_expedicion: fechaExpedicion || undefined,
          fecha_vencimiento: fechaVencimiento || undefined,
          aseguradora: modalAbierto === "poliza" ? aseguradora : undefined,
          agente: modalAbierto === "poliza" ? agente : undefined,
          agente_contacto: modalAbierto === "poliza" ? agenteContacto : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar documento");
      }

      setModalAbierto(null);
      if (onDocumentoActualizado) {
        onDocumentoActualizado();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: "16px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1, minHeight: 0 }}>
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Documentos vigentes del vehículo</h2>

      {/* Tarjeta de circulación */}
      <div style={{ border: "1px solid #E3DCCB", borderRadius: "12px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <b style={{ fontSize: "15px" }}>Tarjeta de circulación</b>
          {tarjeta?.vigente ? (
            <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#E3F3EA", color: "#14583A", fontSize: "12px", fontWeight: 700 }}>
              Vigente hasta {tarjeta.fecha_vencimiento ? new Date(tarjeta.fecha_vencimiento).toLocaleDateString("es-MX") : "N/D"}
            </span>
          ) : (
            <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#FBE9E7", color: "#8E1016", fontSize: "12px", fontWeight: 700 }}>
              {tarjeta ? "Vencida" : "Sin registrar"}
            </span>
          )}
        </div>
        <div style={{ fontSize: "13px", color: "#6B645A" }}>
          {tarjeta ? `Número: ${tarjeta.numero ?? "S/N"} · Expedida el ${tarjeta.fecha_expedicion ? new Date(tarjeta.fecha_expedicion).toLocaleDateString("es-MX") : "N/D"}` : "No se ha registrado tarjeta de circulación"}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => alert("Mostrando vista previa del archivo en Storage seguro...")}
            style={{ height: "44px", padding: "0 16px", borderRadius: "22px", border: "1px solid #CFC8B8", background: "#fff", font: "inherit", fontSize: "14px", fontWeight: 600, color: "#1E1A16", cursor: "pointer" }}
          >
            Ver archivo
          </button>
          <button
            type="button"
            onClick={() => abrirModal("tarjeta_circulacion")}
            style={{ height: "44px", padding: "0 16px", borderRadius: "22px", border: "1px dashed #B0A793", background: "#FBF9F3", font: "inherit", fontSize: "14px", fontWeight: 600, color: "#1E1A16", cursor: "pointer" }}
          >
            Subir renovación
          </button>
        </div>
      </div>

      {/* Póliza de seguro */}
      <div style={{ border: "1px solid #E3DCCB", borderRadius: "12px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <b style={{ fontSize: "15px" }}>Póliza de seguro</b>
          {poliza?.vigente ? (
            <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#E3F3EA", color: "#14583A", fontSize: "12px", fontWeight: 700 }}>
              Vigente hasta {poliza.fecha_vencimiento ? new Date(poliza.fecha_vencimiento).toLocaleDateString("es-MX") : "N/D"}
            </span>
          ) : (
            <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#FBE9E7", color: "#8E1016", fontSize: "12px", fontWeight: 700 }}>
              {poliza ? "Vencida" : "Sin registrar"}
            </span>
          )}
        </div>
        <div style={{ fontSize: "13px", color: "#6B645A" }}>
          {poliza ? `${poliza.aseguradora ?? "Aseguradora registrada"} · ${poliza.agente ?? "Agente"} · expedida el ${poliza.fecha_expedicion ? new Date(poliza.fecha_expedicion).toLocaleDateString("es-MX") : "N/D"}` : "No se ha registrado póliza de seguro"}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => alert("Mostrando vista previa del archivo en Storage seguro...")}
            style={{ height: "44px", padding: "0 16px", borderRadius: "22px", border: "1px solid #CFC8B8", background: "#fff", font: "inherit", fontSize: "14px", fontWeight: 600, color: "#1E1A16", cursor: "pointer" }}
          >
            Ver archivo
          </button>
          <button
            type="button"
            onClick={() => abrirModal("poliza")}
            style={{ height: "44px", padding: "0 16px", borderRadius: "22px", border: "1px dashed #B0A793", background: "#FBF9F3", font: "inherit", fontSize: "14px", fontWeight: 600, color: "#1E1A16", cursor: "pointer" }}
          >
            Subir renovación
          </button>
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#6B645A" }}>
        Se avisa por correo a los 30, 15, 7 días y el día del vencimiento. Un vehículo con documentos vencidos no puede ser asignado a contratos.
      </div>

      {/* Modal de renovación */}
      {modalAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-doc-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 26, 22, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              maxWidth: "480px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 id="modal-doc-title" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
              {modalAbierto === "tarjeta_circulacion"
                ? "Renovar Tarjeta de Circulación"
                : "Renovar Póliza de Seguro"}
            </h3>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FBE9E7", color: "#8E1016", fontSize: "13px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleGuardar} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                Número de documento
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ej. TC-BC-998822"
                  style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 12px", font: "inherit", fontSize: "14px" }}
                  required
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                  Fecha de expedición
                  <input
                    type="date"
                    value={fechaExpedicion}
                    onChange={(e) => setFechaExpedicion(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px", font: "inherit", fontSize: "14px" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                  Fecha de vencimiento
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px", font: "inherit", fontSize: "14px" }}
                    required
                  />
                </label>
              </div>

              {modalAbierto === "poliza" && (
                <>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                    Aseguradora
                    <input
                      value={aseguradora}
                      onChange={(e) => setAseguradora(e.target.value)}
                      placeholder="Quálitas, GNP, HDI..."
                      style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 12px", font: "inherit", fontSize: "14px" }}
                    />
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                      Agente
                      <input
                        value={agente}
                        onChange={(e) => setAgente(e.target.value)}
                        placeholder="Nombre de agente o broker"
                        style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 12px", font: "inherit", fontSize: "14px" }}
                      />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#4A443B" }}>
                      Contacto del agente
                      <input
                        value={agenteContacto}
                        onChange={(e) => setAgenteContacto(e.target.value)}
                        placeholder="Teléfono o correo"
                        style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 12px", font: "inherit", fontSize: "14px" }}
                      />
                    </label>
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalAbierto(null)}
                  disabled={cargando}
                  style={{ height: "44px", padding: "0 18px", borderRadius: "22px", border: "1px solid #CFC8B8", background: "#fff", font: "inherit", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  style={{ height: "44px", padding: "0 22px", borderRadius: "22px", border: 0, background: "#B5141B", color: "#fff", font: "inherit", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  {cargando ? "Guardando..." : "Guardar renovación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
