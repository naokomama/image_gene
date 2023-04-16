const fs = require("fs-extra");
const sharp = require("sharp");

async function combineImages(jsonFolderPath) {
  const jsonFiles = await fs.readdir(jsonFolderPath);

  const outputFolderPath = "output";
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }

  for (const jsonFile of jsonFiles) {
    if (!jsonFile.endsWith(".json")) continue;

    const jsonContent = await fs.readJson(`${jsonFolderPath}/${jsonFile}`);
    const { attributes } = jsonContent;

    let baseImage = sharp({
      create: {
        width: 4000,
        height: 4000,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeImages = [];
    for (const attribute of attributes) {
      const imagePath = attribute.path.replace(/\\/g, "/");
      compositeImages.push({ input: imagePath });
    }

    baseImage = baseImage.composite(compositeImages);

    const outputFilename = jsonFile.replace(".json", ".png");
    await baseImage.toFile(`${outputFolderPath}/${outputFilename}`);
    console.log(`${outputFilename} が作成されました。`);
  }
}

const jsonFolderPath = "./json"; // JSONフォルダのパスを指定してください
combineImages(jsonFolderPath);
