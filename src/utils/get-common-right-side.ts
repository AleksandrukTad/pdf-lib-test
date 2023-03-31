import { RotationTypes } from "pdf-lib/cjs/api";

export async function getCommonRightSideOfLabel({
  content: {
    displayCode,
    size,
    weight,
    barcodeImage,
    productId,
    material
  },
  left,
  top,
  letterHeight,
  fontSize,
  font,
  page
}: any) {
  const weightTextWidth = font.widthOfTextAtSize(weight, fontSize);
  const productIdTextWidth = font.widthOfTextAtSize(productId, fontSize)

  page.drawText(displayCode, {
    x: left,
    y: top,
    size: fontSize,
  })

  page.drawText(size, {
    x: left,
    y: top - letterHeight,
    size: fontSize,
  })

  page.drawText(weight, {
    x: 142 - weightTextWidth - 1,
    y: top - letterHeight,
    size: fontSize,
  })

  
  page.drawImage(barcodeImage, {
    x: left,
    y: top - letterHeight * 3,
    height: 10,
    width: 60
  })

  page.drawText(productId, {
    x: left + (60 / 2) - productIdTextWidth / 2,
    y: 2,
    size: fontSize,
  })

  page.drawText(material, {
    x: page.getWidth() - 2,
    y: 2,
    size: fontSize - 2,
    rotate: {
      type: RotationTypes.Degrees,
      angle: 90
    }
  })
}