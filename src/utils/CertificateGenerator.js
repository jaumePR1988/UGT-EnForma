import jsPDF from 'jspdf';

export const generateCertificate = (student, course, signature) => {
    // Create landscape A4 PDF
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // --- Background/Decorations ---
    // Elegant border
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.setLineWidth(1);
    doc.rect(10, 10, width - 20, height - 20);

    doc.setDrawColor(180, 0, 0); // UGT Red Border
    doc.setLineWidth(0.5);
    doc.rect(12, 12, width - 24, height - 24);

    // Sidebar stripe (Red) - Left side
    doc.setFillColor(204, 0, 0); // UGT Red
    doc.rect(0, 0, 15, height, 'F');

    // --- Header ---
    // Load UGT Logo
    try {
        // Assuming logo is in public folder. jsPDF needs standard <img> element or base64.
        // In browser env, we can use an Image object.
        const logoImg = new Image();
        logoImg.src = "/logo-ugt.png";
        // We need to wait for load or assume it caches fast. 
        // Sync capability of addImage with path only works if safe to do so or previously loaded.
        // For reliability in this async context, we'll try adding it directly.
        doc.addImage(logoImg, "PNG", width / 2 - 25, 20, 50, 25);
    } catch (e) {
        console.error("Logo load error", e);
        // Fallback text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(204, 0, 0);
        doc.text("UGT Catalunya", width / 2, 35, { align: 'center' });
    }

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(36);
    doc.setTextColor(40, 40, 40);
    doc.text("CERTIFICAT D'APROFITAMENT", width / 2, 60, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("La Unió General de Treballadores i Treballadors de Catalunya certifica que", width / 2, 75, { align: 'center' });

    // --- Student Name ---
    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.text(student.fullName || "NOM ALUMNE", width / 2, 95, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`amb DNI/NIE ${student.dni || "-----------"}`, width / 2, 105, { align: 'center' });

    doc.text("ha superat satisfactòriament l'acció formativa:", width / 2, 120, { align: 'center' });

    // --- Course Name ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(204, 0, 0); // UGT Red
    // Split long course names
    const splitTitle = doc.splitTextToSize(course.name || "NOM DEL CURS", 180);
    doc.text(splitTitle, width / 2, 135, { align: 'center' });

    // --- Course Details (Dates & Hours) ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);

    let detailsText = "";
    if (course.startDate && course.endDate) {
        const start = new Date(course.startDate).toLocaleDateString();
        const end = new Date(course.endDate).toLocaleDateString();
        detailsText = `Realitzat del ${start} al ${end}`;
    }

    // Add Total Hours
    // Prioritize computedTotalHours passed from Certificates.jsx, then course.duration
    const hours = course.computedTotalHours || course.duration || course.totalHours || 0;

    if (hours > 0) {
        detailsText += ` amb una durada total de ${hours} hores.`;
    }
    // Removed fallback text as requested

    doc.text(detailsText, width / 2, 150, { align: 'center' });

    // --- Footer & Signature ---
    const date = new Date().toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Barcelona, a ${date}`, 40, 175);

    // Signature Area
    const signatureY = 160;
    const signatureX = width - 80;

    if (signature && (signature.url || signature.dataUrl)) {
        try {
            // Integrate transparent signature
            doc.addImage(signature.url || signature.dataUrl, 'PNG', signatureX, signatureY - 10, 50, 25);
        } catch (e) {
            console.error("Error adding signature image to PDF", e);
            doc.text("(Firma Digital)", signatureX + 25, signatureY + 10, { align: 'center' });
        }

        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text("Signat:", signatureX + 25, signatureY + 20, { align: 'center' });

        doc.setFont("helvetica", "bold");
        doc.text(signature.signerName || signature.name || "Signatari", signatureX + 25, signatureY + 25, { align: 'center' });

        doc.setFont("helvetica", "normal");
        doc.text(signature.signerRole || "Secretaria de Formació", signatureX + 25, signatureY + 30, { align: 'center' });
    } else {
        doc.line(signatureX, signatureY + 15, signatureX + 50, signatureY + 15);
        doc.text("Signatura Autoritzada", signatureX + 25, signatureY + 25, { align: 'center' });
    }

    // --- Save ---
    const fileName = `Certificat_${(student.fullName || 'alumne').replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
};
