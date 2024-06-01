"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerateImage = async () => {
    try {
      const response = await axios.post("/api/generate-image", { text });
      setImageUrl(response.data.url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border rounded"
        placeholder="Enter text"
      />
      <button
        onClick={handleGenerateImage}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Generate Image
      </button>
      {imageUrl && (
        <div className="mt-4 flex flex-col items-center">
          <img src={imageUrl} alt="Generated Image" />
          <a
            href={imageUrl}
            download={`${text}.webp`}
            className="mt-4 p-2 bg-green-500 text-white rounded"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}
