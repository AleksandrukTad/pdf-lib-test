export async function getSentiellLeftSide({
  content: {
    logoImage
  },
  page
}: any) {
  page.drawImage(logoImage, {
    x: 2,
    y: 2,
    height: page.getHeight() - 4,
    width: 71 - 2,
  })
}