/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T08
 */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { Extras } from "@/components/contratos/Extras";
import { Pagare } from "@/components/contratos/Pagare";

function ExtrasContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  // Conductor adicional
  const [condNombre, setCondNombre] = useState("Mario Esquivel Ruiz");
  const [condTel, setCondTel] = useState("686 555 0177");
  const [condDom, setCondDom] = useState("Calle Sexta 340, Centro");
  const [condCiudad, setCondCiudad] = useState("Mexicali, B.C.");
  const [condLic, setCondLic] = useState("B2201880432");
  const [condVence, setCondVence] = useState("2027-05-24");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      // Registrar conductor adicional si está capturado
      if (condNombre && condLic) {
        await fetch(`/api/contratos/${id}/conductores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: condNombre,
            domicilio: condDom,
            ciudad_estado: condCiudad,
            telefono: condTel,
            licencia_numero: condLic,
            licencia_vencimiento: condVence,
            es_arrendatario: false,
          }),
        });
      }
      router.push(`/contratos/${id}/cobro`);
    } catch {
      router.push(`/contratos/${id}/cobro`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
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
          gap: 14,
        }}
      >
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
              NUEVO CONTRATO · DATOS ADICIONALES (OPCIONALES)
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                lineHeight: 1.1,
              }}
            >
              Conductor, referencia, pagaré y facturación
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            Hyundai Elantra · Ricardo Medina
            <br />
            <b style={{ color: "#1E1A16" }}>16/11 → 19/11</b>
          </div>
        </header>

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 14,
          }}
        >
          {/* Card 1: Conductor adicional */}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                Conductor adicional
              </h2>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  background: "#E3F3EA",
                  color: "#14583A",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Licencia vigente en todo el periodo
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 8,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Nombre
                <input
                  value={condNombre}
                  onChange={(e) => setCondNombre(e.target.value)}
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Teléfono o celular
                <input
                  value={condTel}
                  onChange={(e) => setCondTel(e.target.value)}
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Domicilio
                <input
                  value={condDom}
                  onChange={(e) => setCondDom(e.target.value)}
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Ciudad / Estado
                <input
                  value={condCiudad}
                  onChange={(e) => setCondCiudad(e.target.value)}
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Licencia (número)
                <input
                  value={condLic}
                  onChange={(e) => setCondLic(e.target.value)}
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
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A443B",
                }}
              >
                Vence
                <input
                  value={condVence}
                  onChange={(e) => setCondVence(e.target.value)}
                  placeholder="YYYY-MM-DD"
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
            </div>
            <div style={{ fontSize: 12, color: "#6B645A" }}>
              Firma en la pantalla de firma. Su foto de licencia se agrega como documento.
            </div>
          </div>

          {/* Cards 2 & 4: Referencia y Facturar a */}
          <Extras />

          {/* Card 3: Pagaré */}
          <Pagare />
        </section>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 13, color: "#6B645A" }}>
            Todo en esta pantalla es opcional; el contrato avanza sin llenarla.
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href={`/contratos/${id}/cobro`}
              style={{
                height: 52,
                padding: "0 24px",
                borderRadius: 26,
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
              Omitir
            </Link>
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              style={{
                height: 52,
                padding: "0 28px",
                borderRadius: 26,
                border: 0,
                background: "#B5141B",
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              {guardando ? "Guardando..." : "Guardar y volver al cobro"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function ExtrasPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando datos adicionales...</div>}>
      <ExtrasContent />
    </Suspense>
  );
}
