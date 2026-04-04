import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { shop } from '@/utils/api';

const fetchShopProfile = async () => {
    try {
        const res = await shop.getProfile();
        return res.data || {
            shopName: "GEMTRACK JEWELRY",
            address: "123 Gold Market, Mumbai, MH",
            phone: "+91 98765 43210",
            gstin: "27ABCDE1234F1Z5"
        };
    } catch (error) {
        console.error("Failed to fetch shop profile for PDF", error);
        return {
            shopName: "GEMTRACK JEWELRY",
            address: "123 Gold Market, Mumbai, MH",
            phone: "+91 98765 43210",
            gstin: "27ABCDE1234F1Z5"
        };
    }
};

export const createInvoiceDoc = async (customer, saleId, items, paymentMethod, amountPaid, amountDue, discount = 0, billNumber) => {
    const profile = await fetchShopProfile();

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Helper to center text
    const centerText = (text, y) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    centerText(profile.shopName || "GEMTRACK JEWELRY", 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    centerText(`${profile.address || ''} | Phone: ${profile.phone || ''}`, 22);
    centerText(`GSTIN: ${profile.gstin || ''}`, 27);

    doc.setLineWidth(0.5);
    doc.line(10, 32, pageWidth - 10, 32);

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    centerText("TAX INVOICE", 40);

    // Customer & Bill Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Left side: Customer
    doc.text(`Customer: ${customer.name}`, 14, 50);
    doc.text(`Phone: ${customer.phone || 'N/A'}`, 14, 55);
    doc.text(`Address: ${customer.address || 'N/A'}`, 14, 60);

    // Right side: Bill Details
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');
    doc.text(`Bill No: ${billNumber || saleId}`, pageWidth - 60, 50);
    doc.text(`Date: ${date}`, pageWidth - 60, 55);
    doc.text(`Time: ${time}`, pageWidth - 60, 60);

    // Table
    const tableColumn = ["Particulars", "HSN", "Pcs", "Gross Wt", "Net Wt", "Rate", "Amount"];
    const tableRows = [];

    let subtotal = 0;

    items.forEach(item => {
        const itemData = [
            `${item.name}\nSKU: ${item.sku}`,
            "7113",
            "1",
            item.grossWeight || "-",
            item.netWeight || "-",
            `Rs.${item.soldPrice}`,
            `Rs.${item.soldPrice}`
        ];
        tableRows.push(itemData);
        subtotal += parseFloat(item.soldPrice || 0);
    });

    autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 60 }, // Particulars
            6: { halign: 'right' } // Amount
        }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    const discountVal = parseFloat(discount) || 0;
    const taxableAmount = Math.max(0, subtotal - discountVal);

    const cgst = (taxableAmount * 0.015).toFixed(2);
    const sgst = (taxableAmount * 0.015).toFixed(2);
    const total = (taxableAmount + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

    doc.setFontSize(10);
    doc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });

    if (discountVal > 0) {
        doc.text(`Discount: -Rs.${discountVal.toFixed(2)}`, pageWidth - 20, finalY + 5, { align: 'right' });
        doc.text(`Taxable Amount: Rs.${taxableAmount.toFixed(2)}`, pageWidth - 20, finalY + 10, { align: 'right' });
        doc.text(`CGST (1.5%): Rs.${cgst}`, pageWidth - 20, finalY + 15, { align: 'right' });
        doc.text(`SGST (1.5%): Rs.${sgst}`, pageWidth - 20, finalY + 20, { align: 'right' });
    } else {
        doc.text(`CGST (1.5%): Rs.${cgst}`, pageWidth - 20, finalY + 5, { align: 'right' });
        doc.text(`SGST (1.5%): Rs.${sgst}`, pageWidth - 20, finalY + 10, { align: 'right' });
    }

    const totalY = discountVal > 0 ? finalY + 30 : finalY + 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Payable: Rs.${total}`, pageWidth - 20, totalY, { align: 'right' });

    // Footer / Payment Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.rect(14, totalY + 10, pageWidth - 28, 20);

    doc.text(`Payment Method: ${paymentMethod}`, 18, totalY + 18);
    doc.text(`Amount Paid: Rs.${parseFloat(amountPaid).toFixed(2)}`, 18, totalY + 25);
    doc.text(`Balance Due: Rs.${parseFloat(amountDue).toFixed(2)}`, 100, totalY + 25);

    // Thank you
    centerText("Thank you for your business!", totalY + 40);
    centerText(`For queries: ${profile.phone || ''}`, totalY + 45);

    return doc;
};

export const generateInvoice = async (customer, saleId, items, paymentMethod, amountPaid, amountDue, discount = 0, billNumber) => {
    const doc = await createInvoiceDoc(customer, saleId, items, paymentMethod, amountPaid, amountDue, discount, billNumber);
    doc.save(`Invoice_${billNumber || saleId}.pdf`);
};

export const generateInvoiceBlobUrl = async (customer, saleId, items, paymentMethod, amountPaid, amountDue, discount = 0, billNumber) => {
    const doc = await createInvoiceDoc(customer, saleId, items, paymentMethod, amountPaid, amountDue, discount, billNumber);
    return doc.output('bloburl');
};
