import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { emailTemplates } from './emailTemplates';

/**
 * Servicio para gestionar notificaciones (Email, etc.)
 */
export const notificationService = {
    /**
     * Sends an email by adding it to the Firestore 'mail' collection
     */
    async _enqueueEmail(to, subject, html) {
        try {
            await addDoc(collection(db, 'mail'), {
                to: to,
                message: {
                    subject: subject,
                    html: html,
                },
                createdAt: serverTimestamp(),
                delivery: {
                    state: 'pending'
                }
            });
            return true;
        } catch (error) {
            console.error("Error enqueuing email:", error);
            return false;
        }
    },

    /**
     * Envía un email de bienvenida con el Ticket Digital (QR)
     */
    async sendWelcomeEmail(student, course) {
        // En una implementación real, el QR se genera en el backend o se pasa como base64
        const qrPlaceholder = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(student.id);
        const template = emailTemplates.welcomeRegistration(student, course, qrPlaceholder);
        return this._enqueueEmail(student.email, template.subject, template.body);
    },

    /**
     * Envía el certificado
     */
    async sendCertificateEmail(student, course, certificateUrl) {
        const template = emailTemplates.certificateDelivery(student, course, certificateUrl);
        return this._enqueueEmail(student.email, template.subject, template.body);
    },

    /**
     * Envía una invitación a un nuevo usuario (Admin/Docente)
     */
    async sendInvitationEmail(user, translations) {
        const subject = translations.subject;
        const html = translations.body
            .replace(/\n/g, '<br>')
            .replace('%NAME%', user.name)
            .replace('%ROLE%', user.role)
            .replace('%LINK%', window.location.origin);

        return this._enqueueEmail(user.email, subject, `
            <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #ef4444; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">UGT EnForma</h1>
                </div>
                <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                    ${html}
                </div>
            </div>
        `);
    }
};
