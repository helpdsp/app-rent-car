/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:30:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T06
 */

"use client";

import React, { useState } from "react";

export interface DatosExtras {
  referencia_nombre?: string;
  referencia_telefono?: string;
  referencia_celular?: string;
  facturar_a_nombre?: string;
  facturar_a_rfc?: string;
  facturar_otra_persona?: boolean;
}

interface ExtrasProps {
  initialValues?: DatosExtras;
  onChange?: (datos: DatosExtras) => void;
}

export function validarRFC(rfc: string): boolean {
  if (!rfc) return true; // Opcional si no se factura a otra persona
  const regexRFC = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/i;
  return regexRFC.test(rfc.trim());
}

export function Extras({ initialValues, onChange }: ExtrasProps) {
  const [refNombre, setRefNombre] = useState(initialValues?.referencia_nombre ?? "Elena Salazar");
  const [refTel, setRefTel] = useState(initialValues?.referencia_telefono ?? "686 555 0123");
  const [refCel, setRefCel] = useState(initialValues?.referencia_celular ?? "686 555 0124");

  const [otraPersona, setOtraPersona] = useState(initialValues?.facturar_otra_persona ?? false);
  const [factNombre, setFactNombre] = useState(initialValues?.facturar_a_nombre ?? "");
  const [factRFC, setFactRFC] = useState(initialValues?.facturar_a_rfc ?? "");
  const [errorRFC, setErrorRFC] = useState<string | null>(null);

  const notificarCambio = (actualizaciones: Partial<DatosExtras>) => {
    if (onChange) {
      onChange({
        referencia_nombre: refNombre,
        referencia_telefono: refTel,
        referencia_celular: refCel,
        facturar_otra_persona: otraPersona,
        facturar_a_nombre: factNombre,
        facturar_a_rfc: factRFC,
        ...actualizaciones,
      });
    }
  };

  const handleRFCChange = (val: string) => {
    const mayus = val.toUpperCase();
    setFactRFC(mayus);
    if (mayus && !validarRFC(mayus)) {
      setErrorRFC("Formato de RFC inválido (ej. MRA101010ABC)");
    } else {
      setErrorRFC(null);
    }
    notificarCambio({ facturar_a_rfc: mayus });
  };

  return (
    <>
      {/* Tarjeta: Referencia del cliente */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E3DCCB",
          borderRadius: 16,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Referencia del cliente</h2>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
            Nombre
            <input
              value={refNombre}
              onChange={(e) => {
                setRefNombre(e.target.value);
                notificarCambio({ referencia_nombre: e.target.value });
              }}
              style={{
                height: 44,
                border: "1px solid #CFC8B8",
                borderRadius: 10,
                padding: "0 12px",
                font: "inherit",
                fontSize: 15,
                fontWeight: 400,
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
            Teléfono
            <input
              value={refTel}
              onChange={(e) => {
                setRefTel(e.target.value);
                notificarCambio({ referencia_telefono: e.target.value });
              }}
              style={{
                height: 44,
                border: "1px solid #CFC8B8",
                borderRadius: 10,
                padding: "0 12px",
                font: "inherit",
                fontSize: 15,
                fontWeight: 400,
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
            Celular
            <input
              value={refCel}
              onChange={(e) => {
                setRefCel(e.target.value);
                notificarCambio({ referencia_celular: e.target.value });
              }}
              style={{
                height: 44,
                border: "1px solid #CFC8B8",
                borderRadius: 10,
                padding: "0 12px",
                font: "inherit",
                fontSize: 15,
                fontWeight: 400,
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <div />
        </div>
        <button
          type="button"
          style={{
            marginTop: "auto",
            height: 48,
            border: "1px dashed #B0A793",
            borderRadius: 12,
            background: "#FBF9F3",
            font: "inherit",
            fontSize: 15,
            fontWeight: 600,
            color: "#1E1A16",
            cursor: "pointer",
          }}
        >
          + Agregar segundo auto
        </button>
      </div>

      {/* Tarjeta: Facturar a */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E3DCCB",
          borderRadius: 16,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Facturar a</h2>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: otraPersona ? "#14583A" : "#6B645A",
              cursor: "pointer",
            }}
            onClick={() => {
              const nuevo = !otraPersona;
              setOtraPersona(nuevo);
              notificarCambio({ facturar_otra_persona: nuevo });
            }}
          >
            Otra persona
            <span
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: otraPersona ? "#14583A" : "#CFC8B8",
                padding: 3,
                boxSizing: "border-box",
                display: "inline-flex",
                transition: "background 0.2s ease",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  background: "#fff",
                  transform: otraPersona ? "translateX(20px)" : "translateX(0)",
                  transition: "transform 0.2s ease",
                }}
              />
            </span>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
            Nombre o razón social
            <input
              placeholder={otraPersona ? "Ej. Transportes del Norte S.A." : "Igual al cliente"}
              disabled={!otraPersona}
              value={factNombre}
              onChange={(e) => {
                setFactNombre(e.target.value);
                notificarCambio({ facturar_a_nombre: e.target.value });
              }}
              style={{
                height: 44,
                border: "1px solid #CFC8B8",
                borderRadius: 10,
                padding: "0 12px",
                font: "inherit",
                fontSize: 15,
                fontWeight: 400,
                color: "#1E1A16",
                background: otraPersona ? "#fff" : "#F6F2E8",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
            RFC
            <input
              placeholder={otraPersona ? "TNO010101XYZ" : "Igual al cliente"}
              disabled={!otraPersona}
              value={factRFC}
              onChange={(e) => handleRFCChange(e.target.value)}
              style={{
                height: 44,
                border: errorRFC ? "1px solid #8E1016" : "1px solid #CFC8B8",
                borderRadius: 10,
                padding: "0 12px",
                font: "inherit",
                fontSize: 15,
                fontWeight: 400,
                color: "#1E1A16",
                background: otraPersona ? "#fff" : "#F6F2E8",
              }}
            />
            {errorRFC && <span style={{ color: "#8E1016", fontSize: 11 }}>{errorRFC}</span>}
          </label>
        </div>
        <div style={{ fontSize: 12, color: "#6B645A", lineHeight: 1.5 }}>
          Si se deja vacío se usan los datos fiscales del cliente. Sirve cuando otra persona o empresa paga la renta. El sistema solo captura estos datos; no emite la factura.
        </div>
      </div>
    </>
  );
}
