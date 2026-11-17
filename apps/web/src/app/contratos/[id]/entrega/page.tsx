/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:45:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T04
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";
import CamaraGuiada from "@/components/entrega/CamaraGuiada";
import { type AnguloObligatorio, ANGULOS_OBLIGATORIOS } from "@/lib/storage/evidencias";

interface DanoItem {
  id: number;
  vista: "frente" | "izquierda" | "derecha" | "atras";
  x: number;
  y: number;
  nota: string;
}

const GASOLINA_NIVELES = [
  { valor: 0, etiqueta: "Vacío" },
  { valor: 1, etiqueta: "1/8" },
  { valor: 2, etiqueta: "2/8" },
  { valor: 3, etiqueta: "3/8" },
  { valor: 4, etiqueta: "4/8" },
  { valor: 5, etiqueta: "5/8" },
  { valor: 6, etiqueta: "6/8" },
  { valor: 7, etiqueta: "7/8" },
  { valor: 8, etiqueta: "Lleno" },
];

function EntregaContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  // Estado del contrato y vehículo
  const [folio, setFolio] = useState("D-00001");
  const [vehiculoInfo, setVehiculoInfo] = useState("Hyundai Elantra · ATU-703-A");
  const [clienteNombre, setClienteNombre] = useState("Ricardo Medina Salazar");
  const [correoDestino, setCorreoDestino] = useState("ricardo.medina@example.com");
  const [kmActualVehiculo, setKmActualVehiculo] = useState(47_215);

  // 1. Inventario (10 conceptos de Mockup 6)
  const [inventario, setInventario] = useState({
    refacciones: true,
    gato: true,
    herramienta: true,
    reflejantes: true,
    tapetes: true,
    radio: true,
    bocinas: true,
    cinturones: true,
    placas: true,
    antena: false, // Por defecto como en mockup
  });

  // 2. Gasolina en octavos (por defecto Lleno = 8)
  const [gasolinaSalida, setGasolinaSalida] = useState<number>(8);

  // 3. Kilometraje de salida
  const [kmSalida, setKmSalida] = useState<number>(47_215);

  // 4. Daños en 4 vistas
  const [danos, setDanos] = useState<DanoItem[]>([
    { id: 1, vista: "derecha", x: 62, y: 43, nota: "Rayón en puerta derecha" },
    { id: 2, vista: "atras", x: 82, y: 54, nota: "Golpe leve en defensa trasera" },
  ]);
  const [nuevoDanoNota, setNuevoDanoNota] = useState("");
  const [vistaSeleccionadaParaDano, setVistaSeleccionadaParaDano] = useState<"frente" | "izquierda" | "derecha" | "atras">("derecha");

  // 5. Fotos y video de evidencia
  // Inicializamos con 4 fotos capturadas como en el mockup 6 ("4 de 6 fotos · 1 video")
  const [fotosCapturadas, setFotosCapturadas] = useState<Record<string, { km?: number; sha256: string }>>({
    frente: { sha256: "sha256_frente_demo_01" },
    atras: { sha256: "sha256_atras_demo_02" },
    izquierda: { sha256: "sha256_izq_demo_03" },
    derecha: { sha256: "sha256_der_demo_04" },
  });
  const [tieneVideo, setTieneVideo] = useState(true);

  // Modal de cámara guiada (Mockup M3)
  const [modalCamaraAbierto, setModalCamaraAbierto] = useState(false);
  const [adminExcepcionNota, setAdminExcepcionNota] = useState("");

  // Estado de envío
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exitoResultado, setExitoResultado] = useState<any | null>(null);

  // Cargar datos iniciales del contrato si están disponibles
  useEffect(() => {
    fetch(`/api/contratos/${id}/entrega`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contrato) {
          if (data.contrato.folio) setFolio(data.contrato.folio);
          if (data.contrato.cliente_nombre) setClienteNombre(data.contrato.cliente_nombre);
        }
        if (data?.vehiculo) {
          setVehiculoInfo(`${data.vehiculo.marca} ${data.vehiculo.modelo} · ${data.vehiculo.placas}`);
          setKmActualVehiculo(data.vehiculo.kilometraje_actual);
          setKmSalida(data.vehiculo.kilometraje_actual);
        }
        if (data?.evidencias && data.evidencias.length > 0) {
          const mapa: Record<string, { km?: number; sha256: string }> = {};
          data.evidencias.forEach((ev: any) => {
            mapa[ev.angulo] = { km: ev.km_capturado, sha256: ev.sha256 };
          });
          setFotosCapturadas(mapa);
        }
      })
      .catch(() => {});
  }, [id]);

  const toggleInventarioItem = (clave: keyof typeof inventario) => {
    setInventario((prev) => ({ ...prev, [clave]: !prev[clave] }));
  };

  const handleAgregarDano = (e: React.MouseEvent<SVGSVGElement>, vista: "frente" | "izquierda" | "derecha" | "atras") => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 120);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 70);

    const nota = prompt("Descripción del daño detectado en la vista " + vista + ":", "Detalle superficial");
    if (!nota || nota.trim() === "") return;

    const nuevoId = danos.length > 0 ? Math.max(...danos.map((d) => d.id)) + 1 : 1;
    setDanos([...danos, { id: nuevoId, vista, x, y, nota: nota.trim() }]);
  };

  const handleEliminarDano = (danoId: number) => {
    setDanos(danos.filter((d) => d.id !== danoId));
  };

  // Simulación / Registro de foto
  const handleRegistrarFoto = async (angulo: AnguloObligatorio, km?: number) => {
    const kmFinal = angulo === "tablero_km" ? (km ?? kmSalida) : undefined;
    if (angulo === "tablero_km" && kmFinal !== undefined) {
      setKmSalida(kmFinal);
    }

    try {
      await fetch(`/api/contratos/${id}/evidencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "foto",
          angulo,
          path: `evidencias/${id}/entrega_${angulo}.jpg`,
          tamano_bytes: 1024 * 720,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: kmFinal,
        }),
      });
    } catch (_) {}

    setFotosCapturadas((prev) => ({
      ...prev,
      [angulo]: { km: kmFinal, sha256: "sha256_local_mock" },
    }));
  };

  const handleCompletarEntrega = async () => {
    setErrorMsg(null);
    setGuardando(true);

    try {
      // 1. Asegurar registro en evidencias para los ángulos marcados
      for (const [ang, meta] of Object.entries(fotosCapturadas)) {
        await fetch(`/api/contratos/${id}/evidencias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "foto",
            angulo: ang,
            path: `evidencias/${id}/entrega_${ang}.jpg`,
            tamano_bytes: 1024 * 650,
            km_capturado: ang === "tablero_km" ? (meta.km ?? kmSalida) : undefined,
          }),
        }).catch(() => {});
      }

      // 2. Llamada formal a completar entrega
      const res = await fetch(`/api/contratos/${id}/entrega`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          km_salida: kmSalida,
          gasolina_salida: gasolinaSalida,
          inventario: {
            ...inventario,
            danos,
          },
          autorizacionAdminNota: adminExcepcionNota || undefined,
          correoDestino,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Ocurrió un error al completar la entrega.");
        setGuardando(false);
        return;
      }

      setExitoResultado(data);
      setGuardando(false);
    } catch (e) {
      setErrorMsg((e as Error).message);
      setGuardando(false);
    }
  };

  const totalFotos = Object.keys(fotosCapturadas).length;

  return (
    <div
      style={{
        width: 1194,
        height: 834,
        boxSizing: "border-box",
        display: "flex",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <SidebarNav seccionActiva="contratos" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          overflowY: "auto",
        }}
      >
        {/* Modal de Cámara Guiada (Mockup M3) */}
        {modalCamaraAbierto && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div style={{ position: "relative" }}>
              <CamaraGuiada
                contratoFolio={folio}
                vehiculoInfo={vehiculoInfo}
                kilometrajeActualVehiculo={kmActualVehiculo}
                kilometrajeInicial={kmSalida}
                angulosIniciales={Object.keys(fotosCapturadas) as AnguloObligatorio[]}
                onFotoCapturada={(ang, km) => handleRegistrarFoto(ang, km)}
                onCerrar={() => setModalCamaraAbierto(false)}
                onFinalizar={(km) => {
                  setKmSalida(km);
                  setModalCamaraAbierto(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Encabezado */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#6B645A",
              }}
            >
              CONTRATO {folio} · FIRMADO
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Entrega del vehículo
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            {vehiculoInfo}
            <br />
            <b style={{ color: "#1E1A16", fontSize: 16 }}>{clienteNombre}</b>
          </div>
        </header>

        {/* Pasos del contrato */}
        <ol
          aria-label="Pasos del contrato"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Cliente
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Vehículo y fechas
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Cobro y garantía
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Firma
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li
            aria-current="step"
            style={{ display: "flex", alignItems: "center", gap: 8, color: "#B5141B" }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#B5141B",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              5
            </span>
            Entrega
          </li>
        </ol>

        {/* Mensaje de error o éxito */}
        {errorMsg && (
          <div
            role="alert"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#FCE8E6",
              border: "1px solid #D93025",
              color: "#C5221F",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {exitoResultado && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: "#E6F4EA",
              border: "1px solid #137333",
              color: "#137333",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              ✓ Vehículo entregado formalmente. Contrato {folio} ahora está <b>VIGENTE</b>.
              {exitoResultado.envio_correo?.exito && (
                <div style={{ fontSize: 13, color: "#14583A", marginTop: 4 }}>
                  Contrato y reglamento enviados por correo a {correoDestino}.
                </div>
              )}
            </div>
            <Link
              href="/tablero"
              style={{
                padding: "8px 18px",
                background: "#137333",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Ir al Tablero
            </Link>
          </div>
        )}

        {/* Cuadrícula de 2 columnas (5fr y 6fr) */}
        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: 18,
          }}
        >
          {/* Columna Izquierda: Inventario, Gasolina, Kilometraje */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* 1. Inventario (10 conceptos) */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Inventario</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {[
                  { clave: "refacciones", label: "Refacciones" },
                  { clave: "gato", label: "Gato" },
                  { clave: "herramienta", label: "Herramienta" },
                  { clave: "reflejantes", label: "Reflejantes" },
                  { clave: "tapetes", label: "Tapetes" },
                  { clave: "radio", label: "Radio" },
                  { clave: "bocinas", label: "Bocinas" },
                  { clave: "cinturones", label: "Cinturones" },
                  { clave: "placas", label: "Placas" },
                  { clave: "antena", label: "Antena" },
                ].map(({ clave, label }) => {
                  const activa = inventario[clave as keyof typeof inventario];
                  return (
                    <button
                      key={clave}
                      type="button"
                      onClick={() => toggleInventarioItem(clave as keyof typeof inventario)}
                      aria-pressed={activa}
                      style={{
                        minHeight: 44,
                        border: activa ? "2px solid #14583A" : "1px solid #CFC8B8",
                        borderRadius: 10,
                        background: activa ? "#E3F3EA" : "#fff",
                        color: activa ? "#14583A" : "#4A443B",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: activa ? 700 : 600,
                        cursor: "pointer",
                      }}
                    >
                      {activa ? `✓ ${label}` : `${label} (falta)`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Gasolina de salida en octavos */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gasolina de salida</h2>
              <div
                role="group"
                aria-label="Nivel de gasolina en octavos"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(9, 1fr)",
                  gap: 6,
                }}
              >
                {GASOLINA_NIVELES.map(({ valor, etiqueta }) => {
                  const seleccionado = gasolinaSalida === valor;
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setGasolinaSalida(valor)}
                      aria-pressed={seleccionado}
                      style={{
                        height: 48,
                        border: seleccionado ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 10,
                        background: seleccionado ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 13,
                        fontWeight: seleccionado ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      {etiqueta}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: 13, color: "#6B645A" }}>
                El vehículo se entrega con tanque lleno y debe devolverse igual.
              </div>
            </div>

            {/* 3. Kilometraje de salida y foto de tablero obligatoria */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Kilometraje de salida
                <input
                  type="number"
                  value={kmSalida}
                  onChange={(e) => setKmSalida(Number(e.target.value))}
                  min={kmActualVehiculo}
                  style={{
                    height: 52,
                    border: "1px solid #CFC8B8",
                    borderRadius: 12,
                    padding: "0 14px",
                    font: "inherit",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#1E1A16",
                    background: "#fff",
                  }}
                />
              </label>
              <div style={{ fontSize: 13, color: "#6B645A" }}>
                Debe ser igual o mayor al kilometraje actual del vehículo ({kmActualVehiculo.toLocaleString()} km).
              </div>
              <button
                type="button"
                onClick={() => setModalCamaraAbierto(true)}
                style={{
                  height: 48,
                  border: "2px dashed #B5141B",
                  borderRadius: 12,
                  background: fotosCapturadas["tablero_km"] ? "#E3F3EA" : "#FBE9E7",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 700,
                  color: fotosCapturadas["tablero_km"] ? "#14583A" : "#8E1016",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4,
                  cursor: "pointer",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                {fotosCapturadas["tablero_km"]
                  ? `✓ Tablero y km registrado (${fotosCapturadas["tablero_km"].km ?? kmSalida} km)`
                  : "Foto del tablero con el kilometraje (obligatoria)"}
              </button>
            </div>
          </div>

          {/* Columna Derecha: Daños, Fotos/Video, Finalización */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* 4. Daños existentes (diagrama de 4 vistas) */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Daños existentes</h2>
                <span style={{ fontSize: 13, color: "#6B645A" }}>Toque el diagrama para marcar</span>
              </div>

              {/* 4 vistas SVG de Mockup 6 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {/* Vista Frente */}
                <div
                  style={{
                    background: "#FBF9F3",
                    border: "1px solid #E3DCCB",
                    borderRadius: 10,
                    padding: 6,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    viewBox="0 0 120 70"
                    width="100%"
                    aria-label="Vista frontal"
                    role="img"
                    onClick={(e) => handleAgregarDano(e, "frente")}
                  >
                    <path d="M22 52 V34 Q22 20 40 18 H80 Q98 20 98 34 V52 Z" fill="#E8E1CF" stroke="#4A443B" strokeWidth="2" />
                    <rect x="28" y="24" width="64" height="14" rx="4" fill="#fff" stroke="#4A443B" strokeWidth="1.5" />
                    <circle cx="34" cy="46" r="4" fill="#4A443B" />
                    <circle cx="86" cy="46" r="4" fill="#4A443B" />
                    <rect x="26" y="52" width="14" height="10" rx="3" fill="#4A443B" />
                    <rect x="80" y="52" width="14" height="10" rx="3" fill="#4A443B" />
                    {danos.filter((d) => d.vista === "frente").map((d) => (
                      <g key={d.id}>
                        <circle cx={d.x} cy={d.y} r="9" fill="#B5141B" />
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{d.id}</text>
                      </g>
                    ))}
                  </svg>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Frente</div>
                </div>

                {/* Vista Izquierda */}
                <div
                  style={{
                    background: "#FBF9F3",
                    border: "1px solid #E3DCCB",
                    borderRadius: 10,
                    padding: 6,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    viewBox="0 0 120 70"
                    width="100%"
                    aria-label="Vista lateral izquierda"
                    role="img"
                    onClick={(e) => handleAgregarDano(e, "izquierda")}
                  >
                    <path d="M8 50 V40 L24 38 L38 22 H78 L96 38 L112 42 V50 Z" fill="#E8E1CF" stroke="#4A443B" strokeWidth="2" />
                    <path d="M42 26 H76 L90 38 H38 Z" fill="#fff" stroke="#4A443B" strokeWidth="1.5" />
                    <circle cx="32" cy="52" r="8" fill="#4A443B" />
                    <circle cx="88" cy="52" r="8" fill="#4A443B" />
                    {danos.filter((d) => d.vista === "izquierda").map((d) => (
                      <g key={d.id}>
                        <circle cx={d.x} cy={d.y} r="9" fill="#B5141B" />
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{d.id}</text>
                      </g>
                    ))}
                  </svg>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Izquierda</div>
                </div>

                {/* Vista Derecha */}
                <div
                  style={{
                    background: "#FBF9F3",
                    border: "1px solid #E3DCCB",
                    borderRadius: 10,
                    padding: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <svg
                    viewBox="0 0 120 70"
                    width="100%"
                    aria-label="Vista lateral derecha"
                    role="img"
                    onClick={(e) => handleAgregarDano(e, "derecha")}
                  >
                    <path d="M8 50 V42 L24 38 L38 22 H78 L96 38 L112 40 V50 Z" fill="#E8E1CF" stroke="#4A443B" strokeWidth="2" />
                    <path d="M42 26 H76 L90 38 H38 Z" fill="#fff" stroke="#4A443B" strokeWidth="1.5" />
                    <circle cx="32" cy="52" r="8" fill="#4A443B" />
                    <circle cx="88" cy="52" r="8" fill="#4A443B" />
                    {danos.filter((d) => d.vista === "derecha").map((d) => (
                      <g key={d.id}>
                        <circle cx={d.x} cy={d.y} r="9" fill="#B5141B" />
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{d.id}</text>
                      </g>
                    ))}
                  </svg>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Derecha</div>
                </div>

                {/* Vista Atrás */}
                <div
                  style={{
                    background: "#FBF9F3",
                    border: "1px solid #E3DCCB",
                    borderRadius: 10,
                    padding: 6,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    viewBox="0 0 120 70"
                    width="100%"
                    aria-label="Vista trasera"
                    role="img"
                    onClick={(e) => handleAgregarDano(e, "atras")}
                  >
                    <path d="M22 52 V34 Q22 20 40 18 H80 Q98 20 98 34 V52 Z" fill="#E8E1CF" stroke="#4A443B" strokeWidth="2" />
                    <rect x="30" y="24" width="60" height="12" rx="4" fill="#fff" stroke="#4A443B" strokeWidth="1.5" />
                    <rect x="24" y="40" width="12" height="6" rx="2" fill="#B5141B" />
                    <rect x="84" y="40" width="12" height="6" rx="2" fill="#B5141B" />
                    {danos.filter((d) => d.vista === "atras").map((d) => (
                      <g key={d.id}>
                        <circle cx={d.x} cy={d.y} r="9" fill="#B5141B" />
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{d.id}</text>
                      </g>
                    ))}
                  </svg>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Atrás</div>
                </div>
              </div>

              {/* Lista descriptiva de daños */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
                {danos.map((d) => (
                  <div key={d.id} style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          background: "#B5141B",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: "none",
                        }}
                      >
                        {d.id}
                      </span>
                      <span>{d.nota}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarDano(d.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6B645A",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Fotos y video del estado */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                minHeight: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Fotos y video del estado</h2>
                <span style={{ fontSize: 13, color: "#6B645A" }}>
                  {totalFotos} de 6 fotos · {tieneVideo ? "1 video" : "0 videos"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { angulo: "frente", titulo: "Frente" },
                  { angulo: "atras", titulo: "Atrás" },
                  { angulo: "izquierda", titulo: "Izquierda" },
                  { angulo: "derecha", titulo: "Derecha" },
                  { angulo: "tablero_km", titulo: "Tablero y km" },
                  { angulo: "interior", titulo: "Interior" },
                ].map(({ angulo, titulo }) => {
                  const tiene = !!fotosCapturadas[angulo];
                  if (tiene) {
                    return (
                      <div
                        key={angulo}
                        style={{
                          height: 64,
                          borderRadius: 10,
                          background: "#E8E1CF",
                          color: "#4A443B",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {titulo} ✓
                      </div>
                    );
                  }
                  return (
                    <button
                      key={angulo}
                      type="button"
                      onClick={() => {
                        handleRegistrarFoto(angulo as AnguloObligatorio);
                      }}
                      style={{
                        height: 64,
                        border: "2px dashed #B0A793",
                        borderRadius: 10,
                        background: "#FBF9F3",
                        font: "inherit",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#4A443B",
                        cursor: "pointer",
                      }}
                    >
                      + {titulo}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setTieneVideo(!tieneVideo)}
                style={{
                  height: 52,
                  border: "1px solid #CFC8B8",
                  borderRadius: 26,
                  background: tieneVideo ? "#E3F3EA" : "#fff",
                  font: "inherit",
                  fontSize: 16,
                  fontWeight: 600,
                  color: tieneVideo ? "#14583A" : "#1E1A16",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="6" width="13" height="12" rx="2" />
                  <path d="M16 10l5-3v10l-5-3" />
                </svg>
                {tieneVideo ? "Video de recorrido grabado ✓" : "Grabar video de recorrido"}
              </button>

              {/* Botón para abrir vista móvil de celular */}
              <button
                type="button"
                onClick={() => setModalCamaraAbierto(true)}
                style={{
                  height: 44,
                  borderRadius: 22,
                  background: "#2A2620",
                  color: "#CFC8B8",
                  border: "none",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                📱 Abrir visor de cámara asistida (M3)
              </button>

              {/* Campo para excepción de administrador si faltan fotos */}
              {totalFotos < 6 && (
                <div style={{ marginTop: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6B645A" }}>
                    Autorización de administrador por excepción (nota justificada):
                    <input
                      type="text"
                      placeholder="Ej: Autorizado por daño en cámara frontal"
                      value={adminExcepcionNota}
                      onChange={(e) => setAdminExcepcionNota(e.target.value)}
                      style={{
                        width: "100%",
                        height: 38,
                        borderRadius: 8,
                        border: "1px solid #CFC8B8",
                        padding: "0 10px",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Campo editable de correo para envío automático (RF-20) */}
              <div style={{ marginTop: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B645A" }}>
                  Enviar contrato digital y reglamento a:
                  <input
                    type="email"
                    value={correoDestino}
                    onChange={(e) => setCorreoDestino(e.target.value)}
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 8,
                      border: "1px solid #CFC8B8",
                      padding: "0 10px",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  />
                </label>
              </div>

              {/* Acciones de finalización */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "#6B645A", maxWidth: 300 }}>
                  Al completar, el contrato pasa a Vigente y el cliente recibe el contrato y el reglamento por correo.
                </div>
                <button
                  type="button"
                  onClick={handleCompletarEntrega}
                  disabled={guardando}
                  style={{
                    height: 60,
                    padding: "0 28px",
                    borderRadius: 30,
                    background: guardando ? "#8A8478" : "#B5141B",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    border: "none",
                    cursor: guardando ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {guardando ? "Procesando..." : "Completar entrega"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function EntregaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando entrega...</div>}>
      <EntregaContent />
    </Suspense>
  );
}
