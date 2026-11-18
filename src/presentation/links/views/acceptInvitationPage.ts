export interface AcceptInvitationPageProps {
  /** Deep link into the installed app, or null when the token is missing/invalid. */
  appUrl: string | null;
  appStoreUrl: string;
  playStoreUrl: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Fallback page for https://<links host>/invitations/accept?token=…
 *
 * With universal/app links set up, the OS opens the mobile app directly and this page is never
 * shown. It is reached when the app isn't installed, or when the link is opened somewhere that
 * doesn't hand it to the OS (some in-app mail browsers, desktop). Self-contained on purpose: no
 * scripts and no external assets, so a strict CSP can be applied.
 */
export function renderAcceptInvitationPage({
  appUrl,
  appStoreUrl,
  playStoreUrl,
}: AcceptInvitationPageProps): string {
  const storeLinks = [
    appStoreUrl && `<a class="button secondary" href="${escapeHtml(appStoreUrl)}">Descargar en App Store</a>`,
    playStoreUrl && `<a class="button secondary" href="${escapeHtml(playStoreUrl)}">Descargar en Google Play</a>`,
  ]
    .filter(Boolean)
    .join("\n      ");

  const body = appUrl
    ? `<h1>Te invitaron a unirte a una empresa en Delivo</h1>
    <p>Abre la invitación en la app de Delivo e inicia sesión con el correo al que te llegó.</p>
    <div class="actions">
      <a class="button primary" href="${escapeHtml(appUrl)}">Abrir en la app</a>
    </div>
    ${storeLinks ? `<p class="hint">¿Aún no tienes la app? Descárgala y vuelve a abrir el enlace del correo.</p>
    <div class="actions">
      ${storeLinks}
    </div>` : ""}`
    : `<h1>Enlace de invitación no válido</h1>
    <p>Este enlace está incompleto. Vuelve a abrirlo desde el correo de invitación o pide que te envíen una nueva.</p>`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Invitación · Delivo</title>
  <style>
    :root { color-scheme: light dark; --bg: #f6f7f9; --card: #ffffff; --text: #111827; --muted: #4b5563; --primary: #2563eb; --border: #e5e7eb; }
    @media (prefers-color-scheme: dark) { :root { --bg: #0b0f17; --card: #151b26; --text: #f3f4f6; --muted: #9ca3af; --primary: #3b82f6; --border: #273042; } }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    main { width: 100%; max-width: 420px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: center; }
    .brand { font-weight: 700; font-size: 20px; color: var(--primary); margin-bottom: 16px; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    p { color: var(--muted); line-height: 1.5; margin: 0 0 20px; }
    .hint { font-size: 14px; margin: 24px 0 12px; }
    .actions { display: flex; flex-direction: column; gap: 10px; }
    .button { display: block; padding: 14px 16px; border-radius: 12px; text-decoration: none; font-weight: 600; }
    .primary { background: var(--primary); color: #fff; }
    .secondary { border: 1px solid var(--border); color: var(--text); }
  </style>
</head>
<body>
  <main>
    <div class="brand">Delivo</div>
    ${body}
  </main>
</body>
</html>`;
}
