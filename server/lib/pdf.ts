import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export async function makeInvoicePdf(data: { fakturNo: string; orderId: string; customer: { name: string; address: string }; items: Array<{ title: string; qty: number; price: number }>; total: number }): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const draw = (t: string, x: number, y: number, s = 10, f = font, c = rgb(0, 0, 0)) => page.drawText(t, { x, y, size: s, font: f, color: c });
  draw("VEMS GARAGE • SMG-01 PENGAPON", 40, 800, 12, bold);
  draw(`e-Faktur DJP Mock — ${data.fakturNo}`, 40, 780, 10, bold, rgb(0.8, 0.2, 0));
  draw(`Order: ${data.orderId}`, 40, 760, 9);
  draw(`Customer: ${data.customer.name}`, 40, 740, 9);
  draw(`Alamat: ${data.customer.address}`, 40, 725, 8);
  let y = 690;
  draw("SKU / Item", 40, y, 9, bold); draw("Qty", 380, y, 9, bold); draw("Price", 450, y, 9, bold);
  y -= 16;
  for (const it of data.items) { draw(it.title.slice(0, 50), 40, y, 8); draw(String(it.qty), 380, y, 8); draw(new Intl.NumberFormat("id-ID").format(it.price), 450, y, 8); y -= 14; }
  y -= 10;
  draw(`TOTAL: Rp ${new Intl.NumberFormat("id-ID").format(data.total)}`, 40, y, 12, bold);
  draw("Dokumen sah — mock DJP (integrasi nyata menyusul).", 40, 40, 7, font, rgb(0.4, 0.4, 0.4));
  return doc.save();
}
export async function makeSuratJalanPdf(data: { sjNo: string; orderId: string; customer: { name: string; address: string; phone: string }; courier: string; rak?: string }): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const draw = (t: string, x: number, y: number, s = 10, f = font) => page.drawText(t, { x, y, size: s, font: f });
  draw("SURAT JALAN GUDANG — DOCK-01 PENGAPON", 40, 800, 12, bold);
  draw(`No: ${data.sjNo}`, 40, 780, 10, bold);
  draw(`Order: ${data.orderId} • Kurir: ${data.courier}`, 40, 760, 9);
  draw(`Penerima: ${data.customer.name} — ${data.customer.phone}`, 40, 740, 9);
  draw(`Alamat: ${data.customer.address}`, 40, 720, 8);
  draw("Barang diserahkan kurir SMG — tanda terima diperlukan.", 40, 60, 8);
  return doc.save();
}
