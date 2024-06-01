import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import sharp from "sharp";

// Define a function to draw a rounded rectangle with a right-angled triangular top left corner extending outwards
const drawRoundedRectWithTriangle = function (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y); // Start at top left corner + radius
  ctx.lineTo(x + width - radius, y); // Top edge
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius); // Top right corner
  ctx.lineTo(x + width, y + height - radius); // Right edge
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // Bottom right corner
  ctx.lineTo(x + radius, y + height); // Bottom edge
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius); // Bottom left corner
  ctx.lineTo(x, y + radius); // Left edge
  ctx.lineTo(x - 20, y); // Left side of the triangle
  ctx.lineTo(x, y); // Top side of the triangle
  ctx.closePath();
};

// Function to wrap text
const wrapText = function (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { text } = req.body;

    // Create a temporary canvas to measure text width
    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;

    // Set text properties for measurement
    tempCtx.font = "24px sans-serif";
    const maxWidth = 500;
    const lines = wrapText(tempCtx, text, maxWidth);

    // Calculate the height based on the number of lines
    const lineHeight = 30; // Adjust as needed
    const textHeight = lines.length * lineHeight;
    const padding = 20;
    const canvasHeight = textHeight + padding * 2;

    // Calculate the width based on the longest line
    const textWidth = Math.min(
      maxWidth,
      Math.max(...lines.map((line) => tempCtx.measureText(line).width))
    );
    const canvasWidth = textWidth + padding * 2;

    // Create the final canvas with adjusted width and height
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Draw the background with a rounded rectangle and right-angled triangular top left corner
    ctx.fillStyle = "#202C33"; // Blue color
    drawRoundedRectWithTriangle(
      ctx,
      10,
      10,
      canvas.width - 20,
      canvas.height - 20,
      20
    );
    ctx.fill();

    // Set text properties
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Draw the text on the canvas
    const textX = padding;
    let textY = padding;
    lines.forEach((line) => {
      ctx.fillText(line, textX, textY);
      textY += lineHeight;
    });

    // Convert the canvas to a PNG buffer
    const buffer = canvas.toBuffer("image/png");

    // Use sharp to convert PNG buffer to WebP buffer
    const webpBuffer = await sharp(buffer).webp().toBuffer();

    // Convert WebP buffer to a base64 data URL
    const base64Image = webpBuffer.toString("base64");

    // Respond with the generated WebP image data URL
    res.status(200).json({ url: `data:image/webp;base64,${base64Image}` });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
