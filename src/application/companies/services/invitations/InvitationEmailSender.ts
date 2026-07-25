import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { IEmailService } from "@/domain/core/services/IEmailService";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export default class InvitationEmailSender {
  constructor(
    private readonly emailService: IEmailService,
    private readonly inviteBaseUrl: string,
  ) {}

  async sendInvitationEmail(
    invitation: CompanyInvitation,
    companyName: string,
    inviterName: string,
  ): Promise<void> {
    const acceptUrl = `${this.inviteBaseUrl}?token=${invitation.token}`;
    const expiryDate = invitation.expiresAt.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const roleLabel = this.roleLabel(invitation.role);

    const subject = `Has sido invitado a unirte a ${companyName} en TributoCR`;
    const text = [
      `${inviterName} te ha invitado a unirte a ${companyName} en TributoCR.`,
      `Rol asignado: ${roleLabel}.`,
      `Para aceptar la invitación, visita el siguiente enlace antes del ${expiryDate}:`,
      acceptUrl,
      "",
      "Si no esperabas esta invitación, puedes ignorar este correo.",
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
        <h2>Has sido invitado a unirte a <strong>${companyName}</strong></h2>
        <p><strong>${inviterName}</strong> te ha invitado a unirte a ${companyName} en TributoCR.</p>
        <p>Rol asignado: <strong>${roleLabel}</strong></p>
        <p>Para aceptar la invitación, haz clic en el botón antes del <strong>${expiryDate}</strong>:</p>
        <p>
          <a href="${acceptUrl}"
             style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">
            Aceptar invitación
          </a>
        </p>
        <p style="font-size:12px;color:#6b7280;">Si no esperabas esta invitación, puedes ignorar este correo.</p>
      </div>
    `;

    await this.emailService.send({
      to: invitation.email,
      subject,
      html,
      text,
    });
  }

  private roleLabel(role: CompanyRoleType): string {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "DEALER":
        return "Repartidor";
      case "OWNER":
        return "Propietario";
      default:
        return role;
    }
  }
}