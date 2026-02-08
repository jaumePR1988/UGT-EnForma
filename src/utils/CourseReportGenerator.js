import jsPDF from 'jspdf';

export const generateCourseReport = async (course, students, feedbackStats) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- Helper for Colors ---
    const UGT_RED = [204, 0, 0];
    const TEXT_DARK = [40, 40, 40];
    const TEXT_LIGHT = [100, 100, 100];
    const LIGHT_BG = [245, 245, 245];

    // --- Header ---
    doc.setFillColor(...UGT_RED);
    doc.rect(0, 0, width, 40, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("INFORME DE CURS", margin, 20);
    doc.setFontSize(10);
    doc.text("UGT ENFORMA - SISTEMA DE GESTIÓ", margin, 28);

    doc.setFontSize(10);
    doc.text(`Generat el: ${new Date().toLocaleDateString('ca-ES')}`, width - margin, 20, { align: 'right' });

    // --- Course Info ---
    let y = 55;
    doc.setTextColor(...TEXT_DARK);
    doc.setFontSize(18);
    doc.text(course.name || "Sense Nom", margin, y);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_LIGHT);
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTOR:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(course.instructor || "Pendent d'assignar", margin + 30, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("CODI:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(course.code || "---", margin + 30, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("DATES:", margin, y);
    doc.setFont("helvetica", "normal");
    const dateRange = course.startDate ? `${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}` : "Sense dates";
    doc.text(dateRange, margin + 30, y);

    // --- KPIS Box ---
    y += 15;
    const boxHeight = 30;
    const boxWidth = (width - (margin * 2) - 10) / 3;

    // KPI 1: ALUMNES
    drawKPI(doc, margin, y, boxWidth, boxHeight, "ALUMNES INSCRITS", students.length.toString(), [230, 240, 255], [0, 100, 255]);
    // KPI 2: VALORACIÓ
    drawKPI(doc, margin + boxWidth + 5, y, boxWidth, boxHeight, "VALORACIÓ MITJANA", feedbackStats?.average || "N/A", [255, 248, 225], [255, 170, 0]);
    // KPI 3: SESSIONS
    drawKPI(doc, margin + (boxWidth * 2) + 10, y, boxWidth, boxHeight, "SESSIONS TOTALS", (course.sessions?.length || 0).toString(), [225, 255, 235], [0, 180, 80]);

    y += boxHeight + 20;

    // --- Feedback Distribution Chart (Simulated) ---
    if (feedbackStats?.distribution) {
        doc.setFontSize(14);
        doc.setTextColor(...TEXT_DARK);
        doc.setFont("helvetica", "bold");
        doc.text("Distribució de Valoracions", margin, y);
        y += 10;

        const maxVal = Math.max(...Object.values(feedbackStats.distribution));
        const chartW = 100;
        const barH = 6;

        Object.keys(feedbackStats.distribution).forEach((rating, i) => {
            const count = feedbackStats.distribution[rating];
            const percent = maxVal > 0 ? count / maxVal : 0;
            const barW = percent * chartW;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`${rating} Estrelles`, margin, y + 4);

            // Background bar
            doc.setFillColor(240, 240, 240);
            doc.rect(margin + 25, y, chartW, barH, 'F');

            // Value bar
            doc.setFillColor(255, 170, 0); // Amber
            doc.rect(margin + 25, y, Math.max(barW, 1), barH, 'F'); // Min width 1 to show 0 if needed

            doc.text(`${count}`, margin + 25 + chartW + 5, y + 4);

            y += 10;
        });

        y += 10; // Extra spacing
    }

    // --- Student List Table ---
    doc.setFontSize(14);
    doc.setTextColor(...TEXT_DARK);
    doc.setFont("helvetica", "bold");
    doc.text("Llistat d'Assistència", margin, y);
    y += 8;

    // Table Header
    const colName = 80;
    const colDNI = 40;
    const colAtt = 30;

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, width - (margin * 2), 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_DARK);
    doc.text("NOM I COGNOMS", margin + 2, y + 7);
    doc.text("DNI/NIE", margin + colName, y + 7);
    doc.text("ASSISTÈNCIA", margin + colName + colDNI, y + 7);
    doc.text("ESTAT", margin + colName + colDNI + colAtt, y + 7);

    y += 10;

    // Table Rows
    doc.setFont("helvetica", "normal");

    students.forEach((student, index) => {
        // Simple pagination check
        if (y > height - 20) {
            doc.addPage();
            y = 20;
        }

        const isEven = index % 2 === 0;
        if (!isEven) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, y, width - (margin * 2), 8, 'F');
        }

        doc.text(student.fullName || "-", margin + 2, y + 6);
        doc.text(student.dni || "-", margin + colName, y + 6);

        // Calculate attendance logic (simplified replication)
        const totalSessions = course.sessions?.length || 1;
        const attended = student.attendanceSessions?.length || (student.attended ? 1 : 0);
        const percent = Math.round((attended / totalSessions) * 100);
        const minPass = course.minAttendancePercentage || 80;
        const passed = percent >= minPass;

        doc.text(`${percent}% (${attended}/${totalSessions})`, margin + colName + colDNI, y + 6);

        doc.setTextColor(passed ? 0 : 200, passed ? 150 : 0, 0);
        doc.text(passed ? "APTE" : "NO APTE", margin + colName + colDNI + colAtt, y + 6);
        doc.setTextColor(...TEXT_DARK); // Reset

        y += 8;
    });

    // --- Footer ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Pàgina ${i} de ${totalPages} - UGT EnForma`, width / 2, height - 10, { align: 'center' });
    }

    doc.save(`Informe_Curs_${course.code || 'sense_codi'}.pdf`);
};

function drawKPI(doc, x, y, w, h, title, value, bgColor, accentColor) {
    doc.setFillColor(...bgColor);
    doc.setDrawColor(...accentColor);
    doc.roundedRect(x, y, w, h, 3, 3, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(title, x + 5, y + 10);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(value, x + 5, y + 22);
}
