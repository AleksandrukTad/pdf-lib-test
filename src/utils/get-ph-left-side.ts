import { RotationTypes } from "pdf-lib/cjs/api";

export async function getPhLeftSide({
  content: {
    companyName,
    owner,
    address,
    postCodeAndCity,
    vatId
  },
  page,
  fontSize,
  letterHeight,
  font,
  top
}: any) {
  const localLetterHeight = letterHeight - 1.5;
  const allButVatFontSize = fontSize - 2;
  const center = ((page.getWidth() / 2) / 2);
  const companyNameTextWidth = font.widthOfTextAtSize(companyName, allButVatFontSize);
  const ownerTextWidth = font.widthOfTextAtSize(owner, allButVatFontSize);
  const addressTextWidth = font.widthOfTextAtSize(address, allButVatFontSize);
  const postCodeAndCityTextWidth = font.widthOfTextAtSize(postCodeAndCity, allButVatFontSize);
  const vatIdTextWidth = font.widthOfTextAtSize(vatId, fontSize);

  page.drawText(companyName, {
    x: center - (companyNameTextWidth / 2),
    y: top,
    size: allButVatFontSize,
  })

  page.drawText(owner, {
    x: center - (ownerTextWidth / 2),
    y: top - localLetterHeight,
    size: allButVatFontSize,
  })

  page.drawText(address, {
    x: center - (addressTextWidth / 2),
    y: top - (localLetterHeight * 2),
    size: allButVatFontSize,
  })

  page.drawText(postCodeAndCity, {
    x: center - (postCodeAndCityTextWidth / 2),
    y: top - (localLetterHeight * 3),
    size: allButVatFontSize,
  })

  page.drawText(vatId, {
    x: center - (vatIdTextWidth / 2),
    y: top - (localLetterHeight * 4),
    size: fontSize,
  })
}