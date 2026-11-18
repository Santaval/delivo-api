import { IEmailService } from "@/domain/core/services/IEmailService";

export default class MemberAddedEmailSender {
  constructor(private readonly emailService: IEmailService) {}

  async sendMemberAddedEmail(to: string, adderName: string, companyName: string): Promise<void> {
    const subject = `Te agregaron a ${companyName} en Delivo`;
    const notice = "Si no reconoces esto, puedes salir de la empresa desde la app.";
    const text = `${adderName} te agregó a ${companyName} en Delivo. ${notice}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
        <h2>Te agregaron a <strong>${this.escape(companyName)}</strong></h2>
        <p><strong>${this.escape(adderName)}</strong> te agregó a ${this.escape(companyName)} en Delivo.</p>
        <p style="font-size:12px;color:#6b7280;">${notice}</p>
      </div>
    `;

    await this.emailService.send({ to, subject, html, text });
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}
