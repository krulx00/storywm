import { error } from "@sveltejs/kit";
import sharp from "sharp";
import axios from "axios";
// import coverImage from '$lib/image/coverImage.png';
import fs from "fs";
const sampleInstagram =
  "https://i.ibb.co/JHS2y1B/44724523-4233-4538-83c0-a38e711d065a.jpg";
const templateUrl = "https://i.ibb.co/0DZf8MR/cover-Image.png";

export async function GET({}) {
  const getTemplate = (
    await axios({ url: templateUrl, responseType: "arraybuffer" })
  ).data as ArrayBuffer;
  const getSample = (
    await axios({ url: sampleInstagram, responseType: "arraybuffer" })
  ).data as ArrayBuffer;
  const image = await sharp(getSample).png().toBuffer();
  const template = await sharp(getTemplate).resize(1080, 1920).png().toBuffer();
  const imagepreprocessing = await sharp(await addCornerRadius(image))
    .png()
    .toBuffer();

  const output = await sharp(template)
    .composite([{ input: imagepreprocessing }])
    .png()
    .toBuffer();

  return new Response(output.toString('base64'),{
    headers:{
      'content-type':"image/jpeg",
      "cache-control": "public, max-age=31536000, immutable"
    }
  })
}

async function addCornerRadius(image: Buffer) {
  const { width, height } = {
    width: 720,
    height: 1024,
  };
  const mask = Buffer.from(
    `
    <svg><rect x="0" y="0" width="${width}" height="${height}" rx="15" ry="15"/></svg>
    `
  );

  const output = await sharp(image)
    .resize(width, height, { fit: "cover" })
    .composite([
      {
        input: mask,
        blend: "dest-in",
      },
    ])
    .toBuffer();

  return output;
}

export async function POST({}) {
  return new Response();
}
