// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, RotationTypes, StandardFonts } from 'pdf-lib'

type Data = {
  name: string
}

// 1 -> 1/72in

// x - 1.97in
// 0.55inch
async function createPdf() {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([142, 40])
  const { width, height } = page.getSize()

  const logoBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/sentiell-logo.png").then((res) => res.arrayBuffer())
  const barcodeBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/14912-54.png").then((res) => res.arrayBuffer())
  console.log({ width, height });

  const logoImage = await pdfDoc.embedPng(logoBytes);
  const barcodeImage = await pdfDoc.embedPng(barcodeBytes);

  const standardFontSize = 7
  const displayCode = "Z1957AR_B-041";
  const size = "12-14cm";
  const weight = "~100,05g";
  const productId = "9700";
  const letterHeight = 8;

  const rightSideStart = page.getWidth() / 2 + 3; 
  const topStart = 34.25 - 2;

  const weightTextWidth = font.widthOfTextAtSize(weight, standardFontSize);
  const productIdTextWidth = font.widthOfTextAtSize(productId, standardFontSize)
  page.drawText(displayCode, {
    x: rightSideStart,
    y: topStart,
    size: standardFontSize,
  })

  page.drawText(size, {
    x: rightSideStart,
    y: topStart - letterHeight,
    size: standardFontSize,
  })

  page.drawText('~100,05g', {
    x: 142 - weightTextWidth - 1,
    y: topStart - letterHeight,
    size: standardFontSize,
  })

  page.drawImage(logoImage, {
    x: 2,
    y: 2,
    height: page.getHeight() - 4,
    width: 71 - 2,
  })

  page.drawImage(barcodeImage, {
    x: rightSideStart,
    y: topStart - letterHeight * 3,
    height: 10,
    width: 60
  })

  page.drawText(productId, {
    x: rightSideStart + (60 / 2) - productIdTextWidth / 2,
    y: 2,
    size: standardFontSize,
  })

  page.drawText("AG 925", {
    x: page.getWidth() - 2,
    y: 2,
    size: standardFontSize - 2,
    rotate: {
      type: RotationTypes.Degrees,
      angle: 90
    }
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
