// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument } from 'pdf-lib'

type Data = {
  name: string
}

async function createPdf() {
  const pdfDoc = await PDFDocument.create()

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 30
  page.drawText('Creating PDFs in JavaScript is awesome!', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
  })

  const pdfBytes = await pdfDoc.save()

  return Buffer.from(pdfBytes);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pdfBytes = await createPdf();

  res.setHeader("Content-type", "application/pdf")
  res.status(200).send(pdfBytes);
}
