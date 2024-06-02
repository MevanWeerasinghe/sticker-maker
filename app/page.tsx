"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState("#202C33");
  const [textColor, setTextColor] = useState("#ffffff");
  const [font, setFont] = useState("sans-serif");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerateImage = async () => {
    try {
      const response = await axios.post("/api/generate-image", {
        text,
        bgColor,
        textColor,
        font,
      });
      setImageUrl(response.data.url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div className="flex flex-col p-12 bg-gray-100 rounded items-center gap-3">
        <h1 className="text-2xl font-bold mb-6">Text Sticker Maker</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-2 border rounded resize-none"
          placeholder="Enter text"
          rows={5}
          cols={60}
        />
        <div className="flex gap-6 items-center mb-4">
          <label className="flex items-center gap-3">
            <span className="text-gray-700">Background Color:</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="mt-1 p-1 w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-3">
            <span className="text-gray-700">Text Color:</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="mt-1 p-1 w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-3">
            <span className="text-gray-700">Font:</span>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleGenerateImage}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Make Sticker
        </button>
        {imageUrl && (
          <div className="mt-4 flex flex-col items-center">
            <img src={imageUrl} alt="Generated Image" />
            <a
              href={imageUrl}
              download={`${text}.webp`}
              className="mt-4 p-2 bg-green-500 text-white rounded"
            >
              Download Sticker
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
