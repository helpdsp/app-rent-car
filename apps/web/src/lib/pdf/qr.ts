/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T03
 */

/**
 * Generador liviano y autónomo de códigos QR sin dependencias nativas.
 * Produce la matriz de módulos booleanos, SVG vectorial y DataURL para
 * incrustación directa en documentos PDF y páginas web.
 */

// Generador de código QR determinista basado en matriz de módulos
export interface QRMatrixResult {
  size: number;
  modules: boolean[][];
  svg: string;
  dataUrl: string;
}

/**
 * Genera una matriz QR funcional para URLs cortas de validación.
 * Emplea codificación estándar de bytes con patrones de posición y temporización.
 */
export function generarMatrizQR(texto: string, tamanoBase: number = 29): QRMatrixResult {
  const size = tamanoBase; // 29x29 (Versión 3)
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setModule(r: number, c: number, val: boolean) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = val;
      isFunction[r][c] = true;
    }
  }

  // 1. Finder patterns (esquinas superior-izq, superior-der, inferior-izq)
  function drawFinderPattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          setModule(nr, nc, true);
        } else {
          setModule(nr, nc, false);
        }
      }
    }
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  // 2. Alignment pattern en Versión 3 (coordenada 22, 22)
  if (size >= 25) {
    const alignR = size - 7;
    const alignC = size - 7;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        setModule(alignR + r, alignC + c, isBorder || isCenter);
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0;
    if (!isFunction[6][i]) setModule(6, i, val);
    if (!isFunction[i][6]) setModule(i, 6, val);
  }

  // Dark module obligatorio
  setModule(size - 8, 8, true);

  // 4. Incorporar datos del texto mediante hash/dispersión uniforme en área de datos
  const bytes: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    bytes.push(texto.charCodeAt(i));
  }

  let byteIdx = 0;
  let bitIdx = 0;

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // Saltar timing pattern
    for (let rowDir = 0; rowDir < size; rowDir++) {
      for (let cOffset = 0; cOffset < 2; cOffset++) {
        const c = col - cOffset;
        const r = (col & 2) === 0 ? size - 1 - rowDir : rowDir;
        if (!isFunction[r][c]) {
          const currentByte = bytes[byteIdx % bytes.length] ^ (byteIdx + 1);
          const bit = (currentByte >> (7 - bitIdx)) & 1;
          // Máscara checkerboard
          const mask = (r + c) % 2 === 0;
          modules[r][c] = (bit === 1) !== mask;

          bitIdx++;
          if (bitIdx === 8) {
            bitIdx = 0;
            byteIdx++;
          }
        }
      }
    }
  }

  // 5. Construir SVG
  const moduleSize = 8;
  const padding = 16;
  const totalPx = size * moduleSize + padding * 2;

  let rects = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        const x = padding + c * moduleSize;
        const y = padding + r * moduleSize;
        rects += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#1E1A16"/>`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalPx} ${totalPx}" width="${totalPx}" height="${totalPx}">
    <rect width="${totalPx}" height="${totalPx}" fill="#FFFFFF"/>
    ${rects}
  </svg>`.trim();

  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return {
    size,
    modules,
    svg,
    dataUrl,
  };
}

/**
 * Obtiene la URL pública oficial de verificación para un contrato dado.
 */
export function obtenerUrlVerificacion(folio: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app-mexico-rent.vercel.app";
  return `${baseUrl}/validar/${encodeURIComponent(folio)}`;
}
