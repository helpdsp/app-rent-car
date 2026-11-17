/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:00:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T02
 */

import React from "react";

export interface ParametrosLegalesContrato {
  registroProfeco?: string | null;
  ciudadJurisdiccion?: string | null;
  telefonoFallas?: string | null;
}

export const PARAMETROS_LEGALES_DEFAULT: ParametrosLegalesContrato = {
  registroProfeco: "", // TODO(cliente): Registro PROFECO pendiente por confirmar
  ciudadJurisdiccion: "Mexicali, Baja California",
  telefonoFallas: "686 555 0000",
};

export const LISTA_21_CLAUSULAS = [
  {
    numero: "1.ª",
    titulo: "Objeto",
    texto:
      "La arrendadora otorga en arrendamiento al arrendatario el vehículo automotor descrito en la carátula de este contrato, en óptimas condiciones mecánicas, de carrocería y de seguridad, obligándose el arrendatario a restituirlo en el mismo estado en la fecha y lugar convenidos.",
  },
  {
    numero: "2.ª",
    titulo: "Inventario y estado",
    texto:
      "El arrendatario recibe el vehículo con los accesorios, herramientas, llanta de refacción y documentos señalados en el inventario digital y fotográfico realizado al momento de la entrega.",
  },
  {
    numero: "3.ª",
    titulo: "Término y prórroga",
    texto:
      "La duración del arrendamiento se estipula en la carátula. Cualquier prórroga requerirá acuerdo expreso y por escrito con la arrendadora y el pago anticipado de la tarifa correspondiente.",
  },
  {
    numero: "4.ª",
    titulo: "Horas extra y retrasos",
    texto:
      "Se concede una tolerancia de hasta 59 minutos para la devolución. A partir de la hora de retraso se cobrará la hora extra pactada (tarifa diaria ÷ 8). A partir de la 5.ª hora se computará un día adicional completo.",
  },
  {
    numero: "5.ª",
    titulo: "Kilometraje incluido y excedente",
    texto:
      "El arrendamiento incluye 500 kilómetros por cada 24 horas de renta. El kilometraje excedente se facturará a la tarifa estipulada en la carátula (tarifa diaria ÷ 500 o tarifa especial pactada).",
  },
  {
    numero: "6.ª",
    titulo: "Combustible",
    texto:
      "El vehículo debe devolverse con el mismo nivel de combustible con el que fue entregado. La falta de combustible se cobrará al precio de mercado más un cargo administrativo por servicio de recarga.",
  },
  {
    numero: "7.ª",
    titulo: "Territorio de circulación",
    texto:
      "El vehículo únicamente podrá transitar dentro del estado de Baja California y rutas expresamente autorizadas en el destino señalado en la carátula, siempre sobre caminos pavimentados.",
  },
  {
    numero: "8.ª",
    titulo: "Depósito en garantía",
    texto:
      "El arrendatario otorga un depósito en garantía para asegurar el cumplimiento de todas las obligaciones pactadas. Dicho depósito se devolverá una vez liquidado el contrato o se aplicará a saldos insolutos, daños o deducibles.",
  },
  {
    numero: "9.ª",
    titulo: "Salida del país",
    texto:
      "Queda terminantemente prohibido cruzar el vehículo a los Estados Unidos de América u otro país sin el permiso notarial y escrito expreso de la arrendadora y la póliza de seguro transfronteriza contratada.",
  },
  {
    numero: "10.ª",
    titulo: "Conductores autorizados",
    texto:
      "El vehículo solo podrá ser conducido por el arrendatario y los conductores adicionales registrados en el presente contrato, quienes deberán contar con licencia de conducir vigente durante todo el periodo.",
  },
  {
    numero: "11.ª",
    titulo: "Prohibiciones de uso",
    texto:
      "Se prohíbe destinar el vehículo a transporte público, escolar, de carga pesada, arrastre de remolques, competencias deportivas, actividades ilícitas o conducirlo bajo los efectos del alcohol o estupefacientes.",
  },
  {
    numero: "12.ª",
    titulo: "Mantenimiento y fallas mecánicas",
    texto:
      "En caso de falla mecánica, el arrendatario deberá detener la marcha de inmediato y reportar el incidente al teléfono de asistencia de la arrendadora.",
  },
  {
    numero: "13.ª",
    titulo: "Siniestros y accidentes",
    texto:
      "En caso de choque, volcadura o accidente, el arrendatario deberá notificar de inmediato a la arrendadora y a la compañía de seguros, permanecer en el lugar y no realizar acuerdos ni transacciones sin autorización.",
  },
  {
    numero: "14.ª",
    titulo: "Deducibles de seguro",
    texto:
      "En caso de siniestro con culpa o sin tercero identificado, el arrendatario cubrirá el deducible pactado en la carátula (30 % sobre el valor comercial en accidente o robo total).",
  },
  {
    numero: "15.ª",
    titulo: "Robo del vehículo",
    texto:
      "En caso de robo, el arrendatario deberá presentar formal denuncia ante el Ministerio Público dentro de las dos horas siguientes al hecho y entregar copia certificada y las llaves originales a la arrendadora.",
  },
  {
    numero: "16.ª",
    titulo: "Infracciones y multas",
    texto:
      "Todas las infracciones a los reglamentos de tránsito cometidas durante el periodo del arrendamiento serán por cuenta exclusiva del arrendatario, aun cuando se notifiquen con posterioridad.",
  },
  {
    numero: "17.ª",
    titulo: "Pérdida de llaves o placas",
    texto:
      "El extravío o daño a las llaves, chip electrónico, control o placas causará un cargo de reposición conforme al tabulador de precios vigente más los gastos de traslado y grúa.",
  },
  {
    numero: "18.ª",
    titulo: "Rescisión contractual",
    texto:
      "La arrendadora podrá rescindir el contrato y recoger el vehículo en cualquier momento si el arrendatario incumple cualquiera de las cláusulas, sin necesidad de declaración judicial.",
  },
  {
    numero: "19.ª",
    titulo: "Pagaré en garantía",
    texto:
      "Cuando se pacte en la carátula, el arrendatario suscribirá un pagaré mercantil como título de crédito accesorio en garantía del cumplimiento de las obligaciones contractuales.",
  },
  {
    numero: "20.ª",
    titulo: "Inmutabilidad del contrato digital",
    texto:
      "El presente contrato se emite en formato digital inmutable y cuenta con una huella criptográfica SHA-256 generada al momento de la firma táctil, garantizando su integridad y autenticidad.",
  },
  {
    numero: "21.ª",
    titulo: "Jurisdicción y registro PROFECO",
    texto:
      "Para la interpretación y cumplimiento de este contrato, las partes se someten expresamente a la jurisdicción de los tribunales de la ciudad estipulada en la carátula, renunciando a cualquier otro fuero. Contrato de adhesión registrado ante PROFECO según corresponda.",
  },
];

export function ClausulasLegales({
  parametros = PARAMETROS_LEGALES_DEFAULT,
}: {
  parametros?: ParametrosLegalesContrato;
}) {
  const ciudad = parametros.ciudadJurisdiccion || "Mexicali, Baja California";
  const profeco = parametros.registroProfeco
    ? `Contrato de Adhesión registrado ante la Procuraduría Federal del Consumidor (PROFECO) bajo el número ${parametros.registroProfeco}.`
    : "Registro PROFECO: [EN TRÁMITE / PENDIENTE]";
  const telefono = parametros.telefonoFallas || "686 555 0000";

  return (
    <div style={{ fontSize: 10, lineHeight: 1.4, color: "#1E1A16", fontFamily: "sans-serif" }}>
      <h3 style={{ fontSize: 13, textAlign: "center", margin: "4px 0 8px", textTransform: "uppercase" }}>
        Cláusulas Generales del Contrato de Arrendamiento
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
        {LISTA_21_CLAUSULAS.map((c) => {
          let textoModificado = c.texto;
          if (c.numero === "12.ª") {
            textoModificado = `${c.texto} Teléfono de asistencia y reporte de fallas: ${telefono}.`;
          } else if (c.numero === "21.ª") {
            textoModificado = `Para la interpretación y cumplimiento de este contrato, las partes se someten expresamente a la jurisdicción de los tribunales competentes de ${ciudad}, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros. ${profeco}`;
          }

          return (
            <div key={c.numero} style={{ marginBottom: 4 }}>
              <b>{c.numero} {c.titulo}.—</b> {textoModificado}
            </div>
          );
        })}
      </div>
    </div>
  );
}
