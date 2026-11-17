/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T05
 */

"use client";

import React, { useState } from "react";
import { type AnguloObligatorio, ANGULOS_OBLIGATORIOS } from "@/lib/storage/evidencias";

interface CamaraGuiadaProps {
  contratoFolio?: string;
  vehiculoInfo?: string;
  kilometrajeActualVehiculo?: number;
  kilometrajeInicial?: number;
  angulosIniciales?: AnguloObligatorio[];
  onFotoCapturada?: (angulo: AnguloObligatorio, km?: number) => void;
  onCerrar?: () => void;
  onFinalizar?: (kmSalida: number) => void;
}

const GUIA_ANGULOS: Record<
  AnguloObligatorio,
  {
    titulo: string;
    abreviatura: string;
    instruccion: string;
    requiereKm: boolean;
  }
> = {
  frente: {
    titulo: "Frente",
    abreviatura: "Frente",
    instruccion: "Encuadre el frente completo incluyendo placas y cofre.",
    requiereKm: false,
  },
  atras: {
    titulo: "Atrás",
    abreviatura: "Atrás",
    instruccion: "Encuadre la parte trasera incluyendo placas y cajuela.",
    requiereKm: false,
  },
  izquierda: {
    titulo: "Izquierda",
    abreviatura: "Izq.",
    instruccion: "Encuadre el costado izquierdo completo de salpicadera a salpicadera.",
    requiereKm: false,
  },
  derecha: {
    titulo: "Derecha",
    abreviatura: "Der.",
    instruccion: "Encuadre el costado derecho completo de salpicadera a salpicadera.",
    requiereKm: false,
  },
  tablero_km: {
    titulo: "Tablero y km",
    abreviatura: "Tablero",
    instruccion: "Encuadre el tablero con el motor encendido.\nEl kilometraje debe leerse en la foto.",
    requiereKm: true,
  },
  interior: {
    titulo: "Interior",
    abreviatura: "Interior",
    instruccion: "Encuadre asientos delanteros, consola y tapetes.",
    requiereKm: false,
  },
};

export default function CamaraGuiada({
  contratoFolio = "D-00001",
  vehiculoInfo = "Hyundai Elantra · ATU-703-A",
  kilometrajeActualVehiculo = 47_215,
  kilometrajeInicial = 47_215,
  angulosIniciales = [],
  onFotoCapturada,
  onCerrar,
  onFinalizar,
}: CamaraGuiadaProps) {
  const [capturados, setCapturados] = useState<Set<AnguloObligatorio>>(
    new Set(angulosIniciales)
  );
  const [anguloActual, setAnguloActual] = useState<AnguloObligatorio>(
    () => {
      const pendiente = ANGULOS_OBLIGATORIOS.find((a) => !angulosIniciales.includes(a));
      return pendiente || "tablero_km";
    }
  );
  const [kilometraje, setKilometraje] = useState<number>(kilometrajeInicial);
  const [grabandoVideo, setGrabandoVideo] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState<string | null>(null);

  const progreso = capturados.size;
  const configuracionActual = GUIA_ANGULOS[anguloActual];

  const handleTomarFoto = () => {
    // Validar si requiere km
    if (anguloActual === "tablero_km") {
      if (!kilometraje || kilometraje < kilometrajeActualVehiculo) {
        setMensajeFeedback(
          `El kilometraje debe ser mayor o igual a ${kilometrajeActualVehiculo.toLocaleString()} km.`
        );
        return;
      }
    }

    const nuevosCapturados = new Set(capturados);
    nuevosCapturados.add(anguloActual);
    setCapturados(nuevosCapturados);

    if (onFotoCapturada) {
      onFotoCapturada(anguloActual, anguloActual === "tablero_km" ? kilometraje : undefined);
    }

    setMensajeFeedback(`Foto de ${configuracionActual.titulo} capturada ✓`);
    setTimeout(() => setMensajeFeedback(null), 1800);

    // Avanzar automáticamente al siguiente ángulo no capturado
    const siguiente = ANGULOS_OBLIGATORIOS.find((a) => !nuevosCapturados.has(a));
    if (siguiente) {
      setAnguloActual(siguiente);
    }
  };

  const handleTerminar = () => {
    if (onFinalizar) {
      onFinalizar(kilometraje);
    } else if (onCerrar) {
      onCerrar();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        height: 844,
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "#14110D",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Cabecera Mockup M3 */}
      <header
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: "none",
        }}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar la cámara"
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "#2A2620",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            flex: "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#CFC8B8",
            }}
          >
            ENTREGA · {contratoFolio}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {vehiculoInfo}
          </div>
        </div>

        <span
          style={{
            flex: "none",
            height: 32,
            padding: "0 12px",
            borderRadius: 16,
            background: "#2A2620",
            fontSize: 14,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {progreso} de 6
        </span>
      </header>

      {/* Visor de cámara */}
      <section
        aria-label="Cámara"
        style={{
          flex: 1,
          minHeight: 0,
          margin: "0 16px",
          borderRadius: 20,
          background: "linear-gradient(180deg, #2C2822 0%, #1C1914 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Badge del ángulo actual */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "6px 14px",
            borderRadius: 16,
            background: "#B5141B",
            fontSize: 14,
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          {configuracionActual.titulo}
        </div>

        <div
          style={{
            position: "absolute",
            top: 20,
            right: 16,
            fontSize: 12,
            color: "#CFC8B8",
            zIndex: 2,
          }}
        >
          {grabandoVideo ? "Grabando video..." : "Vista de la cámara"}
        </div>

        {/* Notificación flotante de feedback */}
        {mensajeFeedback && (
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 20,
              right: 20,
              padding: "8px 12px",
              background: "rgba(20, 88, 58, 0.95)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textAlign: "center",
              zIndex: 10,
            }}
          >
            {mensajeFeedback}
          </div>
        )}

        {/* Guía visual en pantalla con mira central */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: 78,
            height: 200,
            border: "3px dashed #fff",
            borderRadius: 24,
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: 178,
            width: 40,
            height: 2,
            background: "#fff",
            opacity: 0.6,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Instrucción guiada */}
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: 290,
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1.4,
            color: "#F6F2E8",
            whiteSpace: "pre-line",
          }}
        >
          {configuracionActual.instruccion}
        </div>

        {/* Campo de odómetro si es ángulo tablero_km */}
        {anguloActual === "tablero_km" && (
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 14,
              padding: "12px 14px",
              borderRadius: 16,
              background: "rgba(20, 17, 13, 0.94)",
              border: "1px solid #4A443B",
              zIndex: 3,
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#CFC8B8",
              }}
            >
              KILOMETRAJE DE SALIDA
              <input
                type="number"
                value={kilometraje}
                onChange={(e) => setKilometraje(Number(e.target.value))}
                min={kilometrajeActualVehiculo}
                style={{
                  height: 50,
                  border: "1px solid #6B645A",
                  borderRadius: 12,
                  padding: "0 14px",
                  font: "inherit",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  background: "#2A2620",
                }}
              />
            </label>
            <div style={{ marginTop: 6, fontSize: 12, color: "#CFC8B8" }}>
              Igual o mayor al actual del vehículo ({kilometrajeActualVehiculo.toLocaleString()} km). La foto y el número quedan ligados (T-75).
            </div>
          </div>
        )}
      </section>

      {/* Selector de ángulos con indicador de avance Mockup M3 */}
      <div
        role="list"
        aria-label="Ángulos"
        style={{
          flex: "none",
          padding: "12px 16px 0",
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 6,
        }}
      >
        {ANGULOS_OBLIGATORIOS.map((ang) => {
          const cfg = GUIA_ANGULOS[ang];
          const yaCapturado = capturados.has(ang);
          const esActivo = anguloActual === ang;

          let bg = "#2A2620";
          let color = "#CFC8B8";
          let border = "1px dashed #6B645A";
          let icono = "○";

          if (yaCapturado) {
            bg = "#2F3A33";
            color = "#8FD3AE";
            border = "none";
            icono = "✓";
          }

          if (esActivo) {
            border = "2px solid #B5141B";
            color = "#fff";
            icono = "●";
          }

          return (
            <button
              key={ang}
              type="button"
              onClick={() => setAnguloActual(ang)}
              role="listitem"
              aria-current={esActivo ? "true" : undefined}
              style={{
                height: 52,
                borderRadius: 10,
                background: bg,
                color,
                border,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                boxSizing: "border-box",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>{icono}</span>
              {cfg.abreviatura}
            </button>
          );
        })}
      </div>

      {/* Barra de disparador y acciones */}
      <footer
        style={{
          flex: "none",
          padding: "14px 16px 22px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setGrabandoVideo(!grabandoVideo)}
          style={{
            justifySelf: "start",
            height: 48,
            padding: "0 16px",
            borderRadius: 24,
            border: "1px solid #4A443B",
            background: grabandoVideo ? "#B5141B" : "#2A2620",
            color: "#fff",
            font: "inherit",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {grabandoVideo ? "Detener" : "Video"}
        </button>

        {/* Botón disparador de obturador */}
        <button
          type="button"
          onClick={handleTomarFoto}
          aria-label="Tomar foto"
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            border: "4px solid #fff",
            background: "#B5141B",
            padding: 0,
            cursor: "pointer",
            boxShadow: "0 0 16px rgba(181, 20, 27, 0.4)",
          }}
        />

        <button
          type="button"
          onClick={handleTerminar}
          style={{
            justifySelf: "end",
            height: 48,
            padding: "0 16px",
            borderRadius: 24,
            background: progreso === 6 ? "#14583A" : "#2A2620",
            color: progreso === 6 ? "#fff" : "#CFC8B8",
            fontSize: 14,
            fontWeight: 600,
            border: "1px solid #4A443B",
            cursor: "pointer",
          }}
        >
          {progreso === 6 ? "Listo (6/6)" : `Terminar (${progreso}/6)`}
        </button>
      </footer>
    </div>
  );
}
