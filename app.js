function addItem() {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" class="desc"></td>
        <td><input type="number" class="amount"></td>
        <td><button onclick="removeRow(this)">X</button></td>
    `;

    document.getElementById("itemsBody").appendChild(row);
}

function removeRow(btn) {
    btn.parentNode.parentNode.remove();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const clientName = document.getElementById("clientName").value;
    const clientEmail = document.getElementById("clientEmail").value;
    const invoiceNumber = document.getElementById("invoiceNumber").value;
    const invoiceDate = document.getElementById("invoiceDate").value;
    const taxValue = parseFloat(document.getElementById("tax").value || 0);

    const rows = document.querySelectorAll("#itemsBody tr");

    let items = [];
    let subtotal = 0;

    rows.forEach(r => {
        const desc = r.querySelector(".desc").value;
        const amt = parseFloat(r.querySelector(".amount").value || 0);
        if (desc.trim() !== "") items.push({ desc, amt });
        subtotal += amt;
    });

    const tax = (subtotal * taxValue) / 100;
    const total = subtotal + tax;

    let y = 20;

    doc.setFontSize(18);
    doc.text("INVOICE", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Client: ${clientName}`, 20, y); y += 7;
    doc.text(`Email: ${clientEmail}`, 20, y); y += 7;
    doc.text(`Invoice No: ${invoiceNumber}`, 20, y); y += 7;
    doc.text(`Date: ${invoiceDate}`, 20, y); y += 15;

    doc.setFontSize(14);
    doc.text("Items", 20, y);
    y += 10;

    doc.setFontSize(12);
    items.forEach((i) => {
        doc.text(i.desc, 20, y);
        doc.text(i.amt.toString(), 160, y, { align: "right" });
        y += 7;
    });

    y += 10;
    doc.text(`Subtotal: ₹${subtotal}`, 20, y); y += 7;
    doc.text(`Tax: ₹${tax}`, 20, y); y += 7;
    doc.text(`Total: ₹${total}`, 20, y); y += 15;

    doc.save(`invoice_${invoiceNumber}.pdf`);
}
