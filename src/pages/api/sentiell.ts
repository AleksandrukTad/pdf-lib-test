// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCommonRightSideOfLabel } from '@/utils/get-common-right-side'
import { getSentiellLeftSide } from '@/utils/get-sentiell-left-side';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, StandardFonts } from 'pdf-lib'

async function createPdf() {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([142, 40])

  const logoBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/sentiell-logo.png").then((res) => res.arrayBuffer())
  const barcodeBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/14912-54.png").then((res) => res.arrayBuffer())

  const logoImage = await pdfDoc.embedPng(logoBytes);
  const barcodeImage = await pdfDoc.embedPng(barcodeBytes);

  const standardFontSize = 7
  const displayCode = "Z1957AR_B-041";
  const size = "12-14cm";
  const weight = "~100,05g";
  const productId = "9700";
  const material = "AG 925";
  const letterHeight = 8;

  const rightSideStart = page.getWidth() / 2 + 3; 
  const topStart = 34.25 - 2;
  
  getSentiellLeftSide({ content: { logoImage }, page, letterHeight  })
  await getCommonRightSideOfLabel({ content: { displayCode, weight, size, productId, material, letterHeight, barcodeImage }, left: rightSideStart, top: topStart, fontSize: standardFontSize, letterHeight, page, font })

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
