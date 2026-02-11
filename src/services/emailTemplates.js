/**
 * Estructuras de correo para el CRM UGT EnForma
 * Diseñadas para ser renderizadas como HTML o Markdown.
 */

export const emailTemplates = {
    /**
     * Correo enviado tras la inscripción pública
     */
    welcomeRegistration: (student, course, qrCodeBase64) => ({
        subject: `Benvingut/da a ${course.name} - El teu Ticket Digital 🎫`,
        body: `
            <h1>Hola, ${student.firstName}!</h1>
            <p>T'has inscrit correctament al curs <strong>${course.name}</strong>.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h2 style="margin-top: 0;">Detalls del Curs</h2>
                <p><strong>Codi:</strong> ${course.code}</p>
                <p><strong>Lloc:</strong> ${course.location || 'Presencial'}</p>
                <p><strong>Professorat:</strong> ${course.instructor}</p>
            </div>

            <h2>El teu Ticket Digital</h2>
            <p>Si us plau, guarda aquest codi QR al teu mòbil. L'hauràs de mostrar a l'entrada de cada sessió per a la teva identificació ràpida.</p>
            <div style="text-align: center; margin: 30px 0;">
                <img src="${qrCodeBase64}" alt="Ticket Digital QR" style="width: 200px; height: 200px;" />
            </div>

            <p>Ens veiem aviat!</p>
            <hr />
            <p style="font-size: 12px; color: #64748b;">UGT Catalunya - Formació Sindical</p>
        `
    }),

    /**
     * Correo para el envío del certificado
     */
    certificateDelivery: (student, course, certificateUrl) => ({
        subject: `El teu certificat del curs ${course.name} ja està disponible! 🎓`,
        body: `
            <h1>Enhorabona, ${student.firstName}!</h1>
            <p>Has finalitzat amb èxit el curs <strong>${course.name}</strong>.</p>
            
            <p>Ja pots descarregar el teu certificat oficial d'assistència al següent enllaç:</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${certificateUrl}" style="background-color: #ef4444; color: white; padding: 15px 25px; border-radius: 8px; font-weight: bold; text-decoration: none;">DESCARREGAR CERTIFICAT (PDF)</a>
            </div>

            <p>La teva opinió és molt important per a nosaltres. Si encara no ho has fet, pots valorar el curs aquí:</p>
            <p><a href="https://ugt-enforma-crm-v1.firebaseapp.com/public/feedback/course/${course.id}">Donar el meu feedback</a></p>

            <p>Salutacions,</p>
            <p>L'equip d'UGT EnForma</p>
        `
    })
};
