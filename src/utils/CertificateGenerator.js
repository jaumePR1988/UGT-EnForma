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
    // Minimalist elegant border
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.rect(10, 10, width - 20, height - 20);

    // UGT Sidebar stripe (Red)
    doc.setFillColor(204, 0, 0); // UGT Red
    doc.rect(0, 0, 15, height, 'F');

    // --- Header ---
    // Load UGT Logo (Assuming it's available or use text for now)
    // doc.addImage("/logo-ugt.png", "PNG", 25, 20, 30, 30); // Need to handle async loading or base64 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(40, 40, 40);
    doc.text("CERTIFICAT D'APROFITAMENT", width / 2, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("La Unió General de Treballadores i Treballadors de Catalunya certifica que", width / 2, 55, { align: 'center' });

    // --- Student Name ---
    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.text(student.fullName || "NOM ALUMNE", width / 2, 75, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`amb DNI/NIE ${student.dni || "-----------"}`, width / 2, 85, { align: 'center' });

    doc.text("ha superat satisfactòriament l'acció formativa:", width / 2, 100, { align: 'center' });

    // --- Course Name ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(204, 0, 0); // UGT Red
    // Split long course names
    const splitTitle = doc.splitTextToSize(course.name || "NOM DEL CURS", 180);
    doc.text(splitTitle, width / 2, 115, { align: 'center' });

    // --- Course Details ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);

    let detailsText = "";
    if (course.startDate && course.endDate) {
        detailsText = `Realitzat del ${new Date(course.startDate).toLocaleDateString()} al ${new Date(course.endDate).toLocaleDateString()}`;
    }
    if (course.duration) {
        detailsText += ` amb una durada de ${course.duration} hores.`;
    }

    doc.text(detailsText, width / 2, 135, { align: 'center' });

    // --- Footer & Signature ---
    const date = new Date().toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(11);
    doc.text(`Barcelona, a ${date}`, 30, 160);

    // Signature Area
    // Signature Area
    if (signature && (signature.url || signature.dataUrl)) {
        // Add signature image
        // signature.url is the Firestore downloadURL (might need CORS config in Firebase Storage)
        // signature.dataUrl is local base64 (if we implement that optimization later)
        // For now, let's assume 'url' works or 'dataUrl' is passed back.
        // NOTE: jsPDF addImage with URL requires the image to be loaded or a proxy.
        // Ideally, we should fetch it as blob/base64 before calling generateCertificate.
        // However, if we assume the image is already cached or accessible:

        try {
            doc.addImage(signature.url || signature.dataUrl, 'PNG', width - 80, 150, 40, 20);
        } catch (e) {
            console.error("Error adding signature image to PDF", e);
            // Fallback text if image fails
            doc.setFontSize(8);
            doc.text("(Firma Digital)", width - 60, 160, { align: 'center' });
        }

        doc.setFontSize(10);
        doc.text("Signat:", width - 60, 175, { align: 'center' });

        doc.setFont("helvetica", "bold");
        // Use dynamic name or fallback
        doc.text(signature.signerName || signature.name || "Signatari", width - 60, 180, { align: 'center' });

        doc.setFont("helvetica", "normal");
        // Use dynamic role or fallback
        doc.text(signature.signerRole || "Secretaria General", width - 60, 185, { align: 'center' });
    } else {
        // Placeholder line
        doc.line(width - 80, 170, width - 40, 170);
        doc.text("Signatura Autoritzada", width - 60, 175, { align: 'center' });
    }

    // --- Save ---
    const fileName = `Certificat_${(student.fullName || 'alumne').replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
};
