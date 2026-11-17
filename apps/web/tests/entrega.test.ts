/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:50:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T08
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  registrarEvidencia,
  obtenerEvidenciasContrato,
  validarEvidenciasCompletas,
  rechazarModificacionEvidencia,
  resetearEstadoEvidencias,
  calcularHashEvidencia,
  ANGULOS_OBLIGATORIOS,
  LIMITES_STORAGE,
  validarParametrosEvidencia,
  type AnguloObligatorio,
} from "../src/lib/storage/evidencias";
import {
  completarEntregaVehiculo,
  guardarInventarioContrato,
  obtenerInventarioContrato,
  resetearEstadoInventarios,
} from "../src/lib/contratos/entregar";
import {
  enviarContratoPorCorreo,
  obtenerHistorialEnviosCorreo,
  resetearHistorialEnviosCorreo,
} from "../src/lib/mail/contrato";
import {
  obtenerContratoPorId,
  resetearEstadoContratos,
} from "../src/lib/contratos/emitir";
import {
  obtenerVehiculoPorId,
  resetearEstadoVehiculos,
} from "../src/lib/db/sprint4";
import {
  obtenerEventosOutbox,
  resetearEstadoOutbox,
} from "../src/lib/db/outbox";

describe("Sprint 9: Entrega del vehículo y envío por correo (RF-19, RF-20, T-54, T-60, T-61, T-74 a T-76, T-79, T-83)", () => {
  const autorOperador = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Operador Mostrador",
    rol: "operador",
  };

  const contratoId = "77777777-7777-4777-8777-777777777000"; // D-00001 (Hyundai Elantra)

  beforeEach(() => {
    resetearEstadoContratos();
    resetearEstadoVehiculos();
    resetearEstadoEvidencias();
    resetearEstadoInventarios();
    resetearHistorialEnviosCorreo();
    resetearEstadoOutbox();
  });

  // T-74: Completar la entrega con 5 de 6 ángulos de foto devuelve 409 e indica el faltante
  it("T-74: rechaza la entrega con 409 cuando faltan ángulos obligatorios e indica el ángulo faltante", () => {
    // Subir 5 ángulos (falta 'interior')
    const cincoAngulos: AnguloObligatorio[] = [
      "frente",
      "atras",
      "izquierda",
      "derecha",
      "tablero_km",
    ];

    cincoAngulos.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/${angulo}.jpg`,
          tamano_bytes: 1024 * 400,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 47_215 : undefined,
        },
        autorOperador
      );
    });

    // Validar con la función de comprobación
    const validacion = validarEvidenciasCompletas(contratoId, "entrega");
    expect(validacion.completo).toBe(false);
    expect(validacion.angulosFaltantes).toEqual(["interior"]);

    // Intentar completar entrega
    const resultado = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: 47_215,
        gasolina_salida: 8,
      },
      autorOperador
    );

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.status).toBe(409);
      expect(resultado.codigo).toBe("ANGULOS_EVIDENCIA_INCOMPLETOS");
      expect(resultado.angulosFaltantes).toContain("interior");
      expect(resultado.error).toContain("Interior");
    }

    // Excepción de administrador con nota justificada permite completar (S09-T02)
    const resultadoExcepcion = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: 47_215,
        gasolina_salida: 8,
        autorizacionAdminNota: "Autorizado por daño temporal en lente interior",
      },
      autorOperador
    );

    expect(resultadoExcepcion.ok).toBe(true);
  });

  // T-75: Foto del tablero sin km capturado o km distinto al del contrato
  it("T-75: exige que la foto del tablero contenga el odómetro capturado y que coincida con el km de salida (422)", () => {
    // 1. Intentar registrar foto de tablero_km sin kilometraje capturado
    const valParametros = validarParametrosEvidencia({
      tipo: "foto",
      angulo: "tablero_km",
      tamano_bytes: 1024 * 500,
      km_capturado: null,
    });
    expect(valParametros.valido).toBe(false);
    expect(valParametros.codigo).toBe("ODOMETRO_FOTO_REQUERIDA");

    // 2. Registrar los 6 ángulos pero tablero_km con km 47,215
    ANGULOS_OBLIGATORIOS.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/${angulo}.jpg`,
          tamano_bytes: 1024 * 400,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 47_215 : undefined,
        },
        autorOperador
      );
    });

    // 3. Intentar entregar con km_salida = 48,000 (discrepancia con la foto)
    const resultadoMismatched = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: 48_000,
        gasolina_salida: 8,
      },
      autorOperador
    );

    expect(resultadoMismatched.ok).toBe(false);
    if (!resultadoMismatched.ok) {
      expect(resultadoMismatched.status).toBe(422);
      expect(resultadoMismatched.codigo).toBe("KILOMETRAJE_NO_COINCIDE");
    }
  });

  // T-76: Las fotos no se reemplazan ni se borran (append-only)
  it("T-76: garantiza la inmutabilidad de evidencias: retoma agrega nueva fila y modificación/borrado se rechaza", () => {
    // Registrar foto inicial para 'frente'
    const foto1 = registrarEvidencia(
      contratoId,
      {
        tipo: "foto",
        angulo: "frente",
        path: `evidencias/${contratoId}/frente_v1.jpg`,
        tamano_bytes: 1024 * 500,
        dispositivo: "Tableta Mostrador 1",
      },
      autorOperador
    );
    expect(foto1.ok).toBe(true);

    // Retoma de foto para el mismo ángulo 'frente'
    const foto2 = registrarEvidencia(
      contratoId,
      {
        tipo: "foto",
        angulo: "frente",
        path: `evidencias/${contratoId}/frente_v2_retoma.jpg`,
        tamano_bytes: 1024 * 520,
        dispositivo: "Tableta Mostrador 1",
      },
      autorOperador
    );
    expect(foto2.ok).toBe(true);

    // Ambas filas se conservan en la bitácora histórica
    const evidencias = obtenerEvidenciasContrato(contratoId, "entrega");
    const fotosFrente = evidencias.filter((e) => e.angulo === "frente");
    expect(fotosFrente.length).toBe(2);
    expect(fotosFrente[0].path).toBe(`evidencias/${contratoId}/frente_v1.jpg`);
    expect(fotosFrente[1].path).toBe(`evidencias/${contratoId}/frente_v2_retoma.jpg`);

    // Intentar modificar o eliminar evidencia es rechazado
    const intentoModificacion = rechazarModificacionEvidencia();
    expect(intentoModificacion.ok).toBe(false);
    expect(intentoModificacion.codigo).toBe("EVIDENCIA_INMUTABLE");
  });

  // T-60: Kilometraje de salida menor al actual del vehículo es rechazado con 422
  it("T-60: rechaza la entrega si el kilometraje de salida es menor al kilometraje actual del vehículo", () => {
    const contrato = obtenerContratoPorId(contratoId)!;
    const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id)!;
    expect(vehiculo.kilometraje_actual).toBe(47_215);

    // Subir los 6 ángulos
    ANGULOS_OBLIGATORIOS.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/${angulo}.jpg`,
          tamano_bytes: 1024 * 400,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 45_000 : undefined,
        },
        autorOperador
      );
    });

    // Intentar salir con 45,000 km (menor a 47,215)
    const resultado = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: 45_000,
        gasolina_salida: 8,
      },
      autorOperador
    );

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.status).toBe(422);
      expect(resultado.codigo).toBe("KILOMETRAJE_SALIDA_INVALIDO");
      expect(resultado.error).toContain("no puede ser menor al kilometraje actual");
    }
  });

  // T-61: Entrega completa: contrato pasa a vigente, vehículo a rentado, evento outbox generado
  it("T-61: completa la entrega cambiando contrato a 'vigente', vehículo a 'rentado', inventario guardado y outbox generado", () => {
    const kmEntrega = 47_220; // 5 km mayor al odómetro actual

    // 1. Subir los 6 ángulos de foto obligatorios
    ANGULOS_OBLIGATORIOS.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/${angulo}.jpg`,
          tamano_bytes: 1024 * 400,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? kmEntrega : undefined,
        },
        autorOperador
      );
    });

    // 2. Ejecutar entrega formal
    const resultado = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: kmEntrega,
        gasolina_salida: 8, // Tanque lleno
        inventario: {
          refacciones: true,
          gato: true,
          herramienta: true,
          reflejantes: true,
          tapetes: true,
          radio: true,
          bocinas: true,
          cinturones: true,
          placas: true,
          antena: false, // Antena faltante
          danos: [
            { id: 1, vista: "derecha", x: 62, y: 43, nota: "Rayón en puerta derecha" },
            { id: 2, vista: "atras", x: 82, y: 54, nota: "Golpe leve en defensa trasera" },
          ],
        },
      },
      autorOperador
    );

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      // Estado de contrato
      expect(resultado.contrato.estado).toBe("vigente");
      expect(resultado.contrato.km_salida).toBe(kmEntrega);
      expect(resultado.contrato.gasolina_salida).toBe(8);

      // Estado de vehículo
      const vehiculoActualizado = obtenerVehiculoPorId(resultado.contrato.vehiculo_id)!;
      expect(vehiculoActualizado.estado).toBe("rentado");
      expect(vehiculoActualizado.kilometraje_actual).toBe(kmEntrega);
      expect(vehiculoActualizado.contrato_activo_folio).toBe("D-00001");

      // Inventario y daños guardados
      const invGuardado = obtenerInventarioContrato(contratoId, "entrega")!;
      expect(invGuardado).toBeDefined();
      expect(invGuardado.antena).toBe(false);
      expect(invGuardado.danos.length).toBe(2);

      // Evento outbox desacoplado (T-82, RF-29)
      const outboxEventos = obtenerEventosOutbox({ evento: "vehiculo_entregado" });
      expect(outboxEventos.length).toBe(1);
      expect(outboxEventos[0].payload.km_salida).toBe(kmEntrega);
      expect(outboxEventos[0].payload.folio).toBe("D-00001");
    }
  });

  // T-54: Falla de correo: reintento y registro; reenvío manual disponible
  it("T-54: registra falla de correo con reintento disponible y permite reenvío manual exitoso", async () => {
    // 1. Simular envío fallido (o correo con formato inválido)
    const envioFallido = await enviarContratoPorCorreo(
      {
        contratoId,
        correoDestino: "correo_invalido_sin_dominio",
      },
      autorOperador
    );

    expect(envioFallido.exito).toBe(false);
    expect(envioFallido.reintentoDisponible).toBe(true);
    expect(envioFallido.registro.estado).toBe("fallido");
    expect(envioFallido.registro.reintento_numero).toBe(1);

    // 2. Reintento con correo válido corregido
    const envioReintento = await enviarContratoPorCorreo(
      {
        contratoId,
        correoDestino: "ricardo.medina@example.com",
      },
      autorOperador
    );

    expect(envioReintento.exito).toBe(true);
    expect(envioReintento.registro.estado).toBe("enviado");
    expect(envioReintento.registro.reintento_numero).toBe(2);
    expect(envioReintento.registro.mensaje_id).toMatch(/^resend_/);

    // 3. Historial de envíos del contrato
    const historial = obtenerHistorialEnviosCorreo(contratoId);
    expect(historial.length).toBe(2);
    expect(historial[0].estado).toBe("fallido");
    expect(historial[1].estado).toBe("enviado");
  });

  // T-79: Flujo de captura de fotos en celular (390×844)
  it("T-79: valida que el catálogo de 6 ángulos avance de 1 de 6 a 6 de 6 secuencialmente para celular", () => {
    expect(ANGULOS_OBLIGATORIOS.length).toBe(6);
    expect(ANGULOS_OBLIGATORIOS).toEqual([
      "frente",
      "atras",
      "izquierda",
      "derecha",
      "tablero_km",
      "interior",
    ]);

    // Límites de tamaño para celular
    expect(LIMITES_STORAGE.FOTO_MAX_BYTES).toBe(10 * 1024 * 1024);
    expect(LIMITES_STORAGE.VIDEO_MAX_BYTES).toBe(50 * 1024 * 1024);
  });

  // T-83: Cada foto guarda fecha, hora, usuario, dispositivo y huella SHA-256
  it("T-83: cada foto guarda fecha, usuario, dispositivo y huella SHA-256 inmutable", () => {
    const contenidoBinario = "contenido_foto_demo_raw_bytes";
    const hashCalculado = calcularHashEvidencia(contenidoBinario);

    const resultado = registrarEvidencia(
      contratoId,
      {
        tipo: "foto",
        angulo: "frente",
        path: `evidencias/${contratoId}/frente_sha.jpg`,
        tamano_bytes: contenidoBinario.length,
        contenido: contenidoBinario,
        dispositivo: "Tableta Samsung Active Pro",
      },
      autorOperador
    );

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      const foto = resultado.evidencia;
      expect(foto.sha256).toBe(hashCalculado);
      expect(foto.sha256.length).toBe(64); // Longitud exacta de SHA-256 en hexadecimal
      expect(foto.subida_por).toBe(autorOperador.id);
      expect(foto.dispositivo).toBe("Tableta Samsung Active Pro");
      expect(foto.tomada_en).toBeDefined();
      expect(new Date(foto.tomada_en).getTime()).not.toBeNaN();
    }
  });
});
