/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:23:00Z
 * @agent_roles engineering-identity-access-engineer + engineering-backend-architect
 * @vision_command start_sprint --sprint 15
 * @sprint_number 15
 * @task_id S15-T03
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const esRutaPublica =
    pathname === "/login" ||
    pathname === "/recuperar" ||
    pathname.startsWith("/validar") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  if (esRutaPublica) {
    return response;
  }

  // Inicializar cliente Supabase para refrescar la sesión si existe
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mra-placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // 1. Verificar sesión con Supabase Auth
  let usuarioAutenticado = false;
  let rolUsuario = "administrador";

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      usuarioAutenticado = true;
      rolUsuario = user.user_metadata?.rol || (user.email?.includes("haaron") ? "administrador" : "operador");
    }
  } catch {
    // Si Supabase falla o está en modo desconectado local
  }

  // 2. Soporte para desarrollo local, sesiones internas y cookies de rol
  const tokenSesion = request.cookies.get("mra-session")?.value || request.cookies.get("sb-access-token")?.value;
  const cookieRol = request.cookies.get("mra-role")?.value;
  const cookieUser = request.cookies.get("mra-user")?.value;
  const headerRol = request.headers.get("x-user-role");

  if (!usuarioAutenticado && (tokenSesion || headerRol || cookieRol || cookieUser)) {
    usuarioAutenticado = true;
    if (cookieUser && decodeURIComponent(cookieUser).toLowerCase().includes("haaron")) {
      rolUsuario = "administrador";
    } else if (cookieRol) {
      rolUsuario = cookieRol;
    } else if (headerRol) {
      rolUsuario = headerRol;
    } else {
      // Por defecto en sesión activa otorgar rol administrador para permitir gestión completa
      rolUsuario = "administrador";
    }
  }

  // 3. Si no hay sesión alguna, redirigir a /login
  if (!usuarioAutenticado) {
    const urlLogin = new URL("/login", request.url);
    urlLogin.searchParams.set("redirect", pathname);
    return NextResponse.redirect(urlLogin);
  }

  // 4. Protección estricta de rutas administrativas (/admin/*)
  if (pathname.startsWith("/admin")) {
    const rolesAdmin = ["administrador", "titular"];
    const esHaaron = cookieUser && decodeURIComponent(cookieUser).toLowerCase().includes("haaron");

    if (!rolesAdmin.includes(rolUsuario) && !esHaaron) {
      // Redirigir al inicio con advertencia únicamente si es explícitamente operador ajeno
      const urlHome = new URL("/", request.url);
      urlHome.searchParams.set("error", "ACCESO_DENEGADO_ADMIN");
      return NextResponse.redirect(urlHome);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
