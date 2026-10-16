import type { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { getEnquiries } from "@/lib/admin-queries";

/* Auth is enforced by proxy.ts — everything under /admin requires a session.
   Excel export of the current inbox view (respects ?status= & ?q=). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const q = searchParams.get("q") ?? "";
  const rows = await getEnquiries({ status: status || undefined, q: q || undefined }, 5000);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Aceminds admin";
  wb.created = new Date();
  const ws = wb.addWorksheet("Enquiries");

  ws.columns = [
    { header: "Received", key: "received", width: 20 },
    { header: "Status", key: "status", width: 10 },
    { header: "Student name", key: "name", width: 22 },
    { header: "Class", key: "studentClass", width: 12 },
    { header: "Interested in", key: "course", width: 26 },
    { header: "Mobile", key: "phone", width: 14 },
    { header: "Email", key: "email", width: 26 },
    { header: "Message", key: "message", width: 46 },
    { header: "Source", key: "source", width: 12 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF6F3EC" } };

  for (const e of rows) {
    ws.addRow({
      received: e.createdAt,
      status: e.status,
      name: e.name,
      studentClass: e.studentClass ?? "",
      course: e.course ?? "",
      phone: e.phone,
      email: e.email ?? "",
      message: e.message ?? "",
      source: e.source,
    });
  }
  ws.getColumn("received").numFmt = "dd-mmm-yyyy hh:mm";
  ws.eachRow((r) => r.eachCell((c) => (c.alignment = { vertical: "top", wrapText: true })));

  const buf = await wb.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(buf as ArrayBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="aceminds-enquiries-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
