export async function getWarehouseLabel({
  content: {
    barcodeImage,
    productId,
    size,
  },
  page,
  left,
  letterHeight,
  top,
  fontSize,
}: any) {
  const halfPageSize = page.getWidth() / 2;
  const quarterPageSize = halfPageSize / 2;
  const barcodeWidth = quarterPageSize * 1.75;

  page.drawText(productId, {
    x: left,
    y: top - 4,
    size: fontSize,
  })

  page.drawText(size, {
    x: left,
    y: top - letterHeight,
    size: fontSize,
  })

  page.drawImage(barcodeImage, {
    x: halfPageSize + quarterPageSize - (barcodeWidth / 2),
    y: page.getHeight() / 2 - 10,
    height: 20,
    width: quarterPageSize * 1.75,
  })

}