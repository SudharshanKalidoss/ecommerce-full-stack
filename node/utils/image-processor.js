const sharp = require('sharp');
const fs = require('fs/promises');




const resizeImage = async (inputPath, outputPath, width, height, fit = sharp.fit.inside, withoutEnlargement = true, background = 'white', format = 'jpeg', quality = 80) => {
  await sharp(inputPath)
    .resize({ width, height, fit, withoutEnlargement })
    .toFormat(format, { quality })
    .toFile(outputPath);
};



const ensureDirExists = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const generateProductImages = async (inputPath, outputDir, filename) => {
  await ensureDirExists(outputDir);
  await ensureDirExists(`${outputDir}/thumbnail`);

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),
    resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),
  ]);
};


const generateDiscountWebImages = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};

const generateDiscountMobileImages = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};



const generateSiteLogo = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};

const generateImageForPages = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    // resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};


const generateHomeSliders = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    // resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};

const generateUserProfilePicture = async (inputPath, outputDir, filename) => {

  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 700, 700),

    // resizeImage(inputPath, `${outputDir}/thumbnail/${filename}.webp`, 300, 300),

  ]);
};



module.exports = {
  generateUserProfilePicture,
  generateProductImages,
  generateDiscountWebImages,
  generateDiscountMobileImages,
  generateSiteLogo,
  generateImageForPages,
  generateHomeSliders
};
