// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCommonRightSideOfLabel } from '@/utils/get-common-right-side'
import { getPhLeftSide } from '@/utils/get-ph-left-side';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';
import path from 'path';
import fs from "fs";
import { getWarehouseLabel } from '@/utils/get-warehouse-label';

async function createPdf() {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.addPage([142, 40])
  const fontBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/arial.ttf").then((res) => res.arrayBuffer())
  const font = await pdfDoc.embedFont(fontBytes);
  // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setFont(font);
  const barcodeBytes = await fetch("https://sentiell-bucket.s3.eu-central-1.amazonaws.com/14912-54.png").then((res) => res.arrayBuffer())

  const barcodeImage = await pdfDoc.embedPng(barcodeBytes);

  const standardFontSize = 16
  const letterHeight = 17;

  const topStart = 34.25 - 8;

  getWarehouseLabel({ content: { productId: "12345678", size: "19-22cm", barcodeImage }, page, letterHeight, fontSize: standardFontSize, top: topStart, font });

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
