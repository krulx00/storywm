import sharp from "sharp";
import axios from "axios";

const sampleInstagram =
  "https://i.ibb.co/JHS2y1B/44724523-4233-4538-83c0-a38e711d065a.jpg";
const templateUrl = "https://i.ibb.co/0DZf8MR/cover-Image.png";

async function addCornerRadius(image: Buffer) {
  const { width, height } = {
    width: 720,
    height: 1024,
  };
  const mask = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="15" ry="15"/></svg>`
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

async function compositeImage(imageInput: ArrayBuffer) {
  const getTemplate = (
    await axios({ url: templateUrl, responseType: "arraybuffer" })
  ).data as ArrayBuffer;
  let imageBuffer = Buffer.from(imageInput);
  const template = await sharp(getTemplate).resize(1080, 1920).png().toBuffer();
  let image = await sharp(
    await addCornerRadius(await sharp(imageBuffer).png().toBuffer())
  )
    .png()
    .toBuffer();
  const output = await sharp(template)
    .composite([{ input: image }])
    .png()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();
  return output.toString("base64");
}

export async function POST({ request }: any) {
  const data = await request.formData();
  const files = await data.getAll("files[]");
  let result = [];
  for (let f of files) {
    let postProcessImage = await compositeImage(await f.arrayBuffer());
    result.push(`data:image/jpeg;base64,${postProcessImage}`);
  }
  return new Response(JSON.stringify({ result }));

  // const file = await data.get("files[]");
  // let postProcessImage = await compositeImage(await file.arrayBuffer());
  // return new Response(`data:image/jpeg;base64,${postProcessImage}`, {
  //   headers: {
  //     "content-type": "image/jpeg",
  //     "cache-control": "public, max-age=31536000, immutable",
  //   },
  // });
}
