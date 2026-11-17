/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:00:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T04
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";
import ComparacionFotos from "@/components/recepcion/ComparacionFotos";
import RecepcionMovil from "@/components/recepcion/RecepcionMovil";
import { type ComparacionAnguloItem } from "@/app/api/contratos/[id]/comparacion-fotos/route";

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

function RecepcionContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id =
    typeof routeParams?.id === "string"
      ? routeParams.id
      : "77777777-7777-4777-8777-777777777002"; // Contrato 08155 (Mazda 3, Andrés Cota)

  // Datos base del contrato
  const [folio, setFolio] = useState("08155");
  const [vehiculoInfo, setVehiculoInfo] = useState("Mazda 3");
  const [clienteNombre, setClienteNombre] = useState("Andrés Cota");
  const [esRezagado, setEsRezagado] = useState(true);
  const [tiempoRetraso, setTiempoRetraso] = useState("2 h 20 min");

  // Fechas
  const [entradaPrevista, setEntradaPrevista] = useState("16/11/2026 · 11:00");
  const [entradaReal, setEntradaReal] = useState("16/11/2026 · 13:20");

  // Kilometraje (Mockup 7: salida 31,480 km, entrada 33,120 km)
  const [kmSalida, setKmSalida] = useState(31_480);
  const [kmEntrada, setKmEntrada] = useState(33_120);

  // Gasolina (Mockup 7: salida lleno = 8, entrada 5/8)
  const [gasolinaSalida, setGasolinaSalida] = useState(8);
  const [gasolinaEntrada, setGasolinaEntrada] = useState(5);

  // Cargos de liquidación editables
  const [cargoGasolina, setCargoGasolina] = useState(300);
  const [cargoLimpieza, setCargoLimpieza] = useState(500);
  const [otrosCargos, setOtrosCargos] = useState<Array<{ concepto: string; monto: number }>>([]);

  // Depósito en garantía (Mockup 7: $8,000 en efectivo)
  const [depositoGarantia, setDepositoGarantia] = useState(8_000);

  // Comparaciones de fotos por ángulo
  const [comparaciones, setComparaciones] = useState<ComparacionAnguloItem[]>([]);
  const [vistaMovilActiva, setVistaMovilActiva] = useState(false);

  // Estados de proceso
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [concluidoExito, setConcluidoExito] = useState(false);

  // Cargar comparaciones de fotos y datos de recepción
  useEffect(() => {
    fetch(`/api/contratos/${id}/comparacion-fotos`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.comparaciones) {
          setComparaciones(data.comparaciones);
        }
      })
      .catch(() => {});

    fetch(`/api/contratos/${id}/recepcion`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contrato) {
          if (data.contrato.folio) setFolio(data.contrato.folio);
          if (data.contrato.cliente_nombre) setClienteNombre(data.contrato.cliente_nombre);
          if (data.contrato.km_salida) setKmSalida(data.contrato.km_salida);
          if (data.contrato.gasolina_salida) setGasolinaSalida(data.contrato.gasolina_salida);
        }
        if (data?.vehiculo) {
          setVehiculoInfo(`${data.vehiculo.marca} ${data.vehiculo.modelo}`);
        }
      })
      .catch(() => {});
  }, [id]);

  // Cálculos de liquidación basados en contrato de referencia 08155 / 08160
  const dias = 3;
  const tarifaDia = 1_633;
  const rentaBase = dias * tarifaDia; // $4,899
  const tarifaHora = 204;
  const horasRetraso = 3; // 2 h 20 min redondea a 3 horas
  const cargoRetraso = horasRetraso * tarifaHora; // $612

  const kmRecorridos = Math.max(0, kmEntrada - kmSalida);
  const kmIncluidos = dias * 500; // 1,500
  const kmExcedente = Math.max(0, kmRecorridos - kmIncluidos); // 140 km
  const cargoKm = kmExcedente * 3; // $420

  const sumaOtrosCargos = otrosCargos.reduce((acc, c) => acc + c.monto, 0);
  const totalRenta =
    rentaBase + cargoRetraso + cargoKm + cargoGasolina + cargoLimpieza + sumaOtrosCargos; // $6,731
  const anticipo = rentaBase; // $4,899
  const saldo = Math.max(0, totalRenta - anticipo); // $1,832

  const depositoAplicado = Math.min(depositoGarantia, saldo);
  const depositoDevuelto = Math.max(0, depositoGarantia - depositoAplicado);

  const handleAgregarOtroCargo = () => {
    const concepto = prompt("Concepto del cargo o bonificación (ej. 'Traslado Mexicali-Tijuana'):");
    if (!concepto) return;
    const montoStr = prompt("Monto en pesos (negativo para bonificación):", "250");
    if (!montoStr) return;
    const monto = parseFloat(montoStr);
    if (isNaN(monto)) return;
    setOtrosCargos([...otrosCargos, { concepto, monto }]);
  };

  const handleAplicarDepositoYConcluir = async () => {
    setErrorMsg(null);
    setGuardando(true);

    try {
      // 1. Registrar recepción
      const resRecepcion = await fetch(`/api/contratos/${id}/recepcion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          km_entrada: kmEntrada,
          gasolina_entrada: gasolinaEntrada,
          autorizacionAdminNota: "Recepción formal con liquidación",
        }),
      });

      if (!resRecepcion.ok) {
        const err = await resRecepcion.json();
        setErrorMsg(err.error || "Error al registrar la recepción.");
        setGuardando(false);
        return;
      }

      // 2. Concluir contrato aplicando depósito
      const resConcluir = await fetch(`/api/contratos/${id}/concluir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saldoCentavos: saldo * 100,
          formaPagoSaldo: "efectivo",
        }),
      });

      if (!resConcluir.ok) {
        const err = await resConcluir.json();
        setErrorMsg(err.error || "Error al concluir el contrato.");
        setGuardando(false);
        return;
      }

      setConcluidoExito(true);
      setGuardando(false);
    } catch (e) {
      setErrorMsg((e as Error).message);
      setGuardando(false);
    }
  };

  if (vistaMovilActiva) {
    return (
      <div style={{ background: "#14110D", padding: "20px 0", minHeight: "100vh" }}>
        <button
          onClick={() => setVistaMovilActiva(false)}
          style={{
            display: "block",
            margin: "0 auto 12px",
            padding: "8px 16px",
            background: "#fff",
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Volver a vista de mostrador
        </button>
        <RecepcionMovil
          folio={folio}
          vehiculoInfo={vehiculoInfo}
          esRezagado={esRezagado}
          tiempoRetraso={tiempoRetraso}
          comparaciones={comparaciones}
          totalCentavos={totalRenta * 100}
          anticipoCentavos={anticipo * 100}
          saldoCentavos={saldo * 100}
          depositoTotalCentavos={depositoGarantia * 100}
          onConcluir={handleAplicarDepositoYConcluir}
        />
      </div>
    );
  }

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
        {/* Encabezado Mockup 7 */}
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
              CONTRATO No. {folio} · {vehiculoInfo.toUpperCase()} · {clienteNombre.toUpperCase()}
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Recepción y liquidación
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => setVistaMovilActiva(true)}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 20,
                border: "1px solid #CFC8B8",
                background: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              📱 Vista móvil (M4)
            </button>
            {esRezagado && (
              <span
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 20,
                  background: "#FBE9E7",
                  color: "#8E1016",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                Rezagado · {tiempoRetraso}
              </span>
            )}
          </div>
        </header>

        {/* Notificaciones de error o éxito */}
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

        {concluidoExito && (
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
              ✓ Contrato {folio} concluido exitosamente. Depósito aplicado y saldo liquidado. Vehículo ahora disponible.
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
              Volver al Tablero
            </Link>
          </div>
        )}

        {/* Sección principal en 2 columnas (5fr y 6fr) */}
        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: 18,
          }}
        >
          {/* Columna Izquierda: Datos devolución, Gasolina, Comparación de fotos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* 1. Datos de la devolución */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Datos de la devolución</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 12,
                  fontSize: 14,
                }}
              >
                <div>
                  <div style={{ color: "#6B645A", fontSize: 12, fontWeight: 600 }}>ENTRADA PREVISTA</div>
                  {entradaPrevista}
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: 12, fontWeight: 600 }}>ENTRADA REAL</div>
                  <b>{entradaReal}</b>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
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
                  Km de entrada
                  <input
                    type="number"
                    value={kmEntrada}
                    onChange={(e) => setKmEntrada(Number(e.target.value))}
                    min={kmSalida}
                    style={{
                      height: 52,
                      border: "1px solid #CFC8B8",
                      borderRadius: 12,
                      padding: "0 14px",
                      font: "inherit",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#1E1A16",
                      background: "#fff",
                    }}
                  />
                </label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#4A443B",
                  }}
                >
                  Km de salida
                  <div
                    style={{
                      height: 52,
                      borderRadius: 12,
                      padding: "0 14px",
                      background: "#F6F2E8",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#1E1A16",
                    }}
                  >
                    {kmSalida.toLocaleString()} km
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#6B645A" }}>
                Recorridos {kmRecorridos.toLocaleString()} km · incluidos {kmIncluidos.toLocaleString()} (3 días × 500) · excedente {kmExcedente} km
              </div>
            </div>

            {/* 2. Gasolina de entrada */}
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
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gasolina de entrada</h2>
                <span style={{ fontSize: 13, color: "#6B645A" }}>Salida: lleno</span>
              </div>

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
                  const seleccionado = gasolinaEntrada === valor;
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setGasolinaEntrada(valor)}
                      aria-pressed={seleccionado}
                      style={{
                        height: 46,
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

              {gasolinaEntrada < gasolinaSalida && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#7A4A00",
                    background: "#FFF1D6",
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  Falta {gasolinaSalida - gasolinaEntrada}/8 de tanque respecto a la salida: se sugiere un cargo por gasolina ($300).
                </div>
              )}
            </div>

            {/* 3. Comparación de fotos entrega y hoy */}
            <ComparacionFotos
              comparaciones={
                comparaciones.length > 0
                  ? comparaciones
                  : [
                      {
                        angulo: "frente",
                        etiqueta: "Frente",
                        entrega: {
                          id: "e1",
                          contrato_id: id,
                          momento: "entrega",
                          tipo: "foto",
                          angulo: "frente",
                          path: "evidencias/frente.jpg",
                          tamano_bytes: 450000,
                          sha256: "d5a84e2a6c118742b291a271bb484",
                          dispositivo: "Tableta 1",
                          nota: null,
                          tomada_en: "2026-11-13T11:00:00Z",
                          subida_por: "usr1",
                          km_capturado: null,
                          created_at: "2026-11-13T11:00:00Z",
                        },
                        recepcion: {
                          id: "r1",
                          contrato_id: id,
                          momento: "recepcion",
                          tipo: "foto",
                          angulo: "frente",
                          path: "evidencias/frente_rec.jpg",
                          tamano_bytes: 460000,
                          sha256: "b9910d54c18a221f759c231bb890",
                          dispositivo: "Tableta 1",
                          nota: null,
                          tomada_en: "2026-11-16T13:20:00Z",
                          subida_por: "usr1",
                          km_capturado: null,
                          created_at: "2026-11-16T13:20:00Z",
                        },
                        danos_entrega: [],
                        danos_recepcion: [{ id: 1, vista: "frente", nota: "Rayón en defensa delantera" }],
                        danos_nuevos: [{ id: 1, vista: "frente", nota: "Rayón en defensa delantera" }],
                      },
                    ]
              }
            />
          </div>

          {/* Columna Derecha: Aside Liquidación Mockup 7 */}
          <aside
            aria-label="Liquidación"
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: 16,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minHeight: 0,
            }}
          >
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>Liquidación</h2>

            {/* Renta Base */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "9px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>
                Renta base
                <span style={{ display: "block", fontSize: 13, color: "#6B645A" }}>
                  {dias} días × ${tarifaDia.toLocaleString("es-MX")}
                </span>
              </span>
              <b>${rentaBase.toLocaleString("es-MX")}</b>
            </div>

            {/* Retraso */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "9px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>
                Retraso en devolución
                <span style={{ display: "block", fontSize: 13, color: "#6B645A" }}>
                  2 h 20 min = {horasRetraso} horas × ${tarifaHora.toLocaleString("es-MX")}
                </span>
              </span>
              <b>${cargoRetraso.toLocaleString("es-MX")}</b>
            </div>

            {/* Kilometraje excedente */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "9px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>
                Kilometraje excedente
                <span style={{ display: "block", fontSize: 13, color: "#6B645A" }}>
                  {kmExcedente} km × $3
                </span>
              </span>
              <b>${cargoKm.toLocaleString("es-MX")}</b>
            </div>

            {/* Gasolina faltante */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>
                Gasolina faltante
                <span style={{ display: "block", fontSize: 13, color: "#6B645A" }}>
                  3/8 de tanque · monto editable
                </span>
              </span>
              <input
                type="number"
                value={cargoGasolina}
                onChange={(e) => setCargoGasolina(Number(e.target.value))}
                style={{
                  width: 96,
                  height: 44,
                  border: "1px solid #CFC8B8",
                  borderRadius: 10,
                  textAlign: "right",
                  padding: "0 12px",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              />
            </div>

            {/* Limpieza */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>
                Limpieza
                <span style={{ display: "block", fontSize: 13, color: "#6B645A" }}>
                  Entre $500 y $5,000 según el caso
                </span>
              </span>
              <input
                type="number"
                value={cargoLimpieza}
                onChange={(e) => setCargoLimpieza(Number(e.target.value))}
                style={{
                  width: 96,
                  height: 44,
                  border: "1px solid #CFC8B8",
                  borderRadius: 10,
                  textAlign: "right",
                  padding: "0 12px",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              />
            </div>

            {/* Otros cargos dinámicos */}
            {otrosCargos.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderTop: "1px solid #EFE9DB",
                  fontSize: 14,
                }}
              >
                <span>{c.concepto}</span>
                <b>${c.monto.toLocaleString("es-MX")}</b>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAgregarOtroCargo}
              style={{
                height: 44,
                border: "1px dashed #B0A793",
                borderRadius: 12,
                background: "#fff",
                font: "inherit",
                fontSize: 14,
                fontWeight: 600,
                color: "#1E1A16",
                marginTop: 4,
                cursor: "pointer",
              }}
            >
              + Otro cargo o bonificación
            </button>

            {/* Totales Mockup 7 */}
            <div
              style={{
                marginTop: 6,
                background: "#F6F2E8",
                borderRadius: 14,
                padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "4px 12px",
                fontSize: 15,
                alignItems: "baseline",
              }}
            >
              <span>Total de la renta</span>
              <b style={{ fontSize: 18 }}>${totalRenta.toLocaleString("es-MX")}</b>
              <span>Anticipo pagado</span>
              <b>− ${anticipo.toLocaleString("es-MX")}</b>
              <span style={{ fontWeight: 700 }}>Saldo a cobrar</span>
              <b
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 30,
                  color: "#B5141B",
                }}
              >
                ${saldo.toLocaleString("es-MX")}
              </b>
            </div>

            {/* Desglose de Depósito */}
            <div
              style={{
                border: "1px solid #E3DCCB",
                borderRadius: 14,
                padding: "10px 16px",
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Depósito en garantía (efectivo)</span>
                <b>${depositoGarantia.toLocaleString("es-MX")}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#4A443B" }}>
                <span>Se aplica al saldo</span>
                <span>− ${depositoAplicado.toLocaleString("es-MX")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>Se devuelve al cliente</b>
                <b style={{ color: "#14583A" }}>${depositoDevuelto.toLocaleString("es-MX")}</b>
              </div>
            </div>

            {/* Botones de acción final */}
            <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
              <Link
                href={`/contratos/${id}/incidente`}
                style={{
                  height: 56,
                  padding: "0 22px",
                  borderRadius: 28,
                  border: "1px solid #CFC8B8",
                  background: "#fff",
                  color: "#1E1A16",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                Registrar incidente
              </Link>
              <button
                type="button"
                onClick={handleAplicarDepositoYConcluir}
                disabled={guardando}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 28,
                  background: guardando ? "#8A8478" : "#B5141B",
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  border: "none",
                  cursor: guardando ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {guardando ? "Concluyendo..." : "Aplicar depósito y concluir"}
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default function RecepcionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando recepción...</div>}>
      <RecepcionContent />
    </Suspense>
  );
}
