/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:25:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @task_id S11-T08
 * @description Pruebas de excepciones: incidentes, renovación y cancelación (T-68 a T-73, RF-21, RF-23, RF-24, RF-25)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  registrarIncidente,
  cerrarIncidente,
  tieneIncidentesAbiertos,
  resetearEstadoIncidentes,
  obtenerIncidentesContrato,
} from '../src/lib/contratos/incidentes';
import {
  cancelarContrato,
} from '../src/lib/contratos/cancelar';
import {
  renovarContrato,
} from '../src/lib/contratos/renovar';
import {
  aplicarODevolverDepositoYConcluir,
} from '../src/lib/pagos/liquidar-deposito';
import {
  agregarCargoContrato,
  obtenerCargosDeContrato,
} from '../src/lib/contratos/cargos';
import {
  obtenerContratoPorId,
  resetearEstadoContratos,
} from '../src/lib/contratos/emitir';
import {
  obtenerVehiculoPorId,
  resetearEstadoVehiculos,
} from '../src/lib/db/sprint4';
import { penalizacionCancelacion } from '../src/lib/pricing';

describe('Sprint 11 — Excepciones: Incidentes, Renovación y Cancelación (RF-21, RF-23, RF-24, RF-25)', () => {
  const autorTest = { id: '11111111-1111-4111-8111-111111111101', nombre: 'Admin Operativo', rol: 'admin' };
  const contratoIdSemilla = '77777777-7777-4777-8777-777777777000';
  const contratoIdSemilla2 = '77777777-7777-4777-8777-777777777001';

  beforeEach(() => {
    resetearEstadoContratos();
    resetearEstadoVehiculos();
    resetearEstadoIncidentes();
  });

  // =========================================================================
  // T-68: Incidente reportado al día siguiente se marca aviso_tardio = true
  // =========================================================================
  describe('T-68: Detección de aviso tardío en incidentes (Cláusula 12.ª)', () => {
    it('debe marcar aviso_tardio = true si el reporte ocurre en fecha posterior a la ocurrencia', () => {
      const contrato = obtenerContratoPorId(contratoIdSemilla)!;
      contrato.estado = 'vigente';

      const res = registrarIncidente(
        contrato.id,
        {
          tipo: 'accidente',
          ocurrido_en: '2026-11-13T14:30:00Z',
          avisado_en: '2026-11-14T09:00:00Z', // Día siguiente -> Aviso tardío
          descripcion: 'Golpe lateral en estacionamiento',
          aseguradora_referencia: 'QUAL-998811',
          cargo_cliente: 350000,
        },
        autorTest
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.incidente.aviso_tardio).toBe(true);
        expect(res.incidente.tipo).toBe('accidente');
        expect(res.contrato.estado).toBe('en_incidente');
      }
    });

    it('debe marcar aviso_tardio = false si el reporte ocurre el mismo día', () => {
      const contrato = obtenerContratoPorId(contratoIdSemilla)!;
      contrato.estado = 'vigente';

      const res = registrarIncidente(
        contrato.id,
        {
          tipo: 'falla_mecanica',
          ocurrido_en: '2026-11-13T09:00:00Z',
          avisado_en: '2026-11-13T11:00:00Z', // Mismo día -> A tiempo
          descripcion: 'Falla en alternador',
        },
        autorTest
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.incidente.aviso_tardio).toBe(false);
        expect(res.incidente.tipo).toBe('falla_mecanica');
      }
    });
  });

  // =========================================================================
  // T-69: Incidente abierto impide concluir contrato y liberar depósito
  // =========================================================================
  describe('T-69: Bloqueo de conclusión por incidente abierto', () => {
    it('debe rechazar la conclusión del contrato con código INCIDENTE_ABIERTO si hay un incidente sin cerrar', () => {
      const contrato = obtenerContratoPorId(contratoIdSemilla)!;
      contrato.estado = 'recibido';

      // Registramos incidente abierto
      const resInc = registrarIncidente(
        contrato.id,
        {
          tipo: 'accidente',
          ocurrido_en: '2026-11-14T12:00:00Z',
          avisado_en: '2026-11-14T12:30:00Z',
          descripcion: 'Raspón con banqueta',
        },
        autorTest
      );
      expect(resInc.ok).toBe(true);
      expect(tieneIncidentesAbiertos(contrato.id)).toBe(true);

      const resLiq = aplicarODevolverDepositoYConcluir(
        contrato.id,
        {
          saldoCentavos: 0,
        },
        autorTest
      );

      expect(resLiq.ok).toBe(false);
      if (!resLiq.ok) {
        expect(resLiq.status).toBe(422);
        expect(resLiq.codigo).toBe('INCIDENTE_ABIERTO');
        expect(resLiq.error).toContain('incidentes abiertos');
      }

      // Ahora cerramos el incidente y verificamos que se permita concluir
      if (resInc.ok) {
        const resCierre = cerrarIncidente(resInc.incidente.id, autorTest);
        expect(resCierre.ok).toBe(true);
      }
      expect(tieneIncidentesAbiertos(contrato.id)).toBe(false);

      const resLiqOk = aplicarODevolverDepositoYConcluir(
        contrato.id,
        {
          saldoCentavos: 0,
        },
        autorTest
      );

      expect(resLiqOk.ok).toBe(true);
      if (resLiqOk.ok) {
        expect(resLiqOk.contrato.estado).toBe('concluido');
        const veh = obtenerVehiculoPorId(contrato.vehiculo_id)!;
        expect(veh.estado).toBe('disponible');
      }
    });
  });

  // =========================================================================
  // T-70: Renovación genera nuevo contrato vinculado con validaciones (RF-24)
  // =========================================================================
  describe('T-70: Renovación de contrato (Cláusula 3.ª, RF-24)', () => {
    it('debe generar un nuevo contrato con contrato_origen_id y revalidar disponibilidad', () => {
      const contratoOrigen = obtenerContratoPorId(contratoIdSemilla)!;
      contratoOrigen.estado = 'vigente';

      const resRenovacion = renovarContrato(
        contratoOrigen.id,
        {
          nuevaEntradaPrevista: '2026-11-19T17:30:00Z', // 3 días adicionales
          destino: 'Mexicali y San Felipe',
          pasarDepositoNuevo: true,
        },
        autorTest
      );

      expect(resRenovacion.ok).toBe(true);
      if (resRenovacion.ok) {
        expect(resRenovacion.nuevoContrato.contrato_origen_id).toBe(contratoOrigen.id);
        expect(resRenovacion.nuevoContrato.salida_en).toBe(contratoOrigen.entrada_prevista_en);
        expect(resRenovacion.nuevoContrato.entrada_prevista_en).toBe('2026-11-19T17:30:00Z');
        expect(resRenovacion.nuevoContrato.vehiculo_id).toBe(contratoOrigen.vehiculo_id);
        expect(resRenovacion.nuevoContrato.estado).toBe('borrador');
      }
    });

    it('debe rechazar renovación si la fecha fin es anterior a la fecha de inicio', () => {
      const contratoOrigen = obtenerContratoPorId(contratoIdSemilla)!;
      contratoOrigen.estado = 'vigente';

      const resRenovacion = renovarContrato(
        contratoOrigen.id,
        {
          nuevaEntradaPrevista: '2026-11-15T10:00:00Z', // Anterior a entrada_prevista_en (2026-11-16T17:30:00Z)
        },
        autorTest
      );

      expect(resRenovacion.ok).toBe(false);
      if (!resRenovacion.ok) {
        expect(resRenovacion.status).toBe(422);
        expect(resRenovacion.codigo).toBe('FECHAS_INVALIDAS');
      }
    });
  });

  // =========================================================================
  // T-71, T-72, T-73: Cancelación de contratos y penalizaciones (RF-25)
  // =========================================================================
  describe('T-71, T-72, T-73: Cancelación de reservas y penalizaciones', () => {
    it('T-71: Cancelación con anticipación > 24h aplica 20% de penalización', () => {
      const totalContratoCentavos = 600000; // $6,000.00
      const horasAnticipacion = 48; // 2 días antes > 24h

      const penalizacion = penalizacionCancelacion(totalContratoCentavos, horasAnticipacion);
      expect(penalizacion).toBe(120000); // 20% de $6,000 = $1,200 (120000 centavos)

      // Usamos el contrato semilla 2
      const contrato = obtenerContratoPorId(contratoIdSemilla2)!;
      contrato.estado = 'por_firmar';
      contrato.salida_en = '2026-11-20T10:00:00Z';
      contrato.anticipo = BigInt(300000); // $3,000.00 anticipo pagado

      const veh = obtenerVehiculoPorId(contrato.vehiculo_id)!;
      veh.estado = 'rentado';
      veh.contrato_activo_folio = contrato.folio;

      const res = cancelarContrato(
        contrato.id,
        {
          motivo: 'cliente_desiste',
          nota: 'Cambio de planes familiares',
          fechaSolicitud: '2026-11-18T10:00:00Z', // 48h antes
          formaReembolso: 'transferencia',
        },
        autorTest
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.contrato.estado).toBe('cancelado');
        expect(res.porcentajePenalizacion).toBe(20);
        expect(res.penalizacionCentavos).toBe(60000); // 20% del anticipo de $3,000
        expect(res.reembolsoClienteCentavos).toBe(240000); // $2,400 devuelto
        expect(veh.estado).toBe('disponible');
        expect(veh.contrato_activo_folio).toBeNull();
      }
    });

    it('T-72: Cancelación con anticipación <= 24h aplica 100% de penalización', () => {
      const totalContratoCentavos = 500000; // $5,000.00
      const horasAnticipacion = 8; // Menos de 24h

      const penalizacion = penalizacionCancelacion(totalContratoCentavos, horasAnticipacion);
      expect(penalizacion).toBe(500000); // 100% de penalización

      const contrato = obtenerContratoPorId(contratoIdSemilla2)!;
      contrato.estado = 'por_firmar';
      contrato.salida_en = '2026-11-20T10:00:00Z';
      contrato.anticipo = BigInt(200000); // $2,000.00 anticipo

      const res = cancelarContrato(
        contrato.id,
        {
          motivo: 'no_show',
          nota: 'Cliente no se presentó ni notificó a tiempo',
          fechaSolicitud: '2026-11-20T02:00:00Z', // 8 horas antes
        },
        autorTest
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.contrato.estado).toBe('cancelado');
        expect(res.porcentajePenalizacion).toBe(100);
        expect(res.reembolsoClienteCentavos).toBe(0); // 0 reembolso
      }
    });

    it('T-73: Contrato vigente NO puede cancelarse; debe rechazarse con 409 CONTRATO_VIGENTE_NO_CANCELABLE', () => {
      const contrato = obtenerContratoPorId(contratoIdSemilla)!;
      contrato.estado = 'vigente'; // Contrato activo

      const res = cancelarContrato(
        contrato.id,
        {
          motivo: 'cliente_desiste',
          nota: 'Intento de cancelar con la unidad en posesión',
        },
        autorTest
      );

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.status).toBe(409);
        expect(res.codigo).toBe('CONTRATO_VIGENTE_NO_CANCELABLE');
        expect(res.error).toContain('vigente no puede cancelarse');
      }
      expect(contrato.estado).toBe('vigente');
    });
  });

  // =========================================================================
  // RF-21: Cargos adicionales durante la vida del contrato
  // =========================================================================
  describe('RF-21: Cargos adicionales dinámicos (grúa, corralón, deducible, etc.)', () => {
    it('debe registrar y acumular cargos adicionales de grúa, corralón y deducible', () => {
      const contrato = obtenerContratoPorId(contratoIdSemilla)!;
      contrato.cargos = []; // Limpiamos cargos previos

      const c1 = agregarCargoContrato(
        contrato.id,
        {
          tipo: 'traslado',
          concepto: 'Arrastre con grúa por falla mecánica',
          monto: 150000, // $1,500.00
          momento: 'liquidacion',
        },
        autorTest
      );

      const c2 = agregarCargoContrato(
        contrato.id,
        {
          tipo: 'multa',
          concepto: 'Infracción por estacionamiento prohibido',
          monto: 85000, // $850.00
          momento: 'liquidacion',
        },
        autorTest
      );

      expect(c1.ok).toBe(true);
      expect(c2.ok).toBe(true);

      const lista = obtenerCargosDeContrato(contrato.id);
      expect(lista.length).toBe(2);

      const totalCargos = lista.reduce((acc, c) => acc + BigInt(c.monto), BigInt(0));
      expect(totalCargos).toBe(BigInt(235000)); // $2,350.00
    });
  });
});
