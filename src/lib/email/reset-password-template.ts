export function getResetPasswordEmailHtml(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redefinir senha — SaaS CRM</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#000000;padding:32px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#ffffff;width:40px;height:40px;border-radius:12px;text-align:center;vertical-align:middle;font-size:20px;">
                    ✦
                  </td>
                  <td style="padding-left:12px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                    SaaS CRM
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#000000;letter-spacing:-0.5px;">
                Redefinir senha
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="background-color:#000000;border-radius:9999px;padding:14px 32px;">
                    <a href="${resetUrl}" target="_blank" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;display:inline-block;">
                      Redefinir minha senha
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:13px;color:#999999;line-height:1.6;">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
              </p>
              <p style="margin:0 0 24px;font-size:12px;color:#000000;word-break:break-all;background-color:#f5f5f5;padding:12px 16px;border-radius:8px;line-height:1.5;">
                ${resetUrl}
              </p>

              <div style="border-top:1px solid #eeeeee;padding-top:20px;margin-top:8px;">
                <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                  Este link expira em <strong style="color:#000000;">1 hora</strong>. Se você não solicitou essa alteração, ignore este e-mail — sua senha permanecerá a mesma.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:11px;color:#aaaaaa;">
                © ${new Date().getFullYear()} SaaS CRM — Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
