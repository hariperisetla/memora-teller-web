"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import "./Polaroid.css";

interface PolaroidProps {
  imageUrl: string;
  title: string;
  story: string;
  date?: string;
}

export function Polaroid({ imageUrl, title, story, date }: PolaroidProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <motion.div
        className="relative w-full aspect-[3/4] cursor-pointer preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Polaroid */}
        <div className="absolute w-full h-full backface-hidden bg-white p-4 rounded-lg shadow-lg">
          <div className="relative w-full aspect-square mb-4 overflow-hidden rounded">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {date && <p className="text-sm text-gray-500">{date}</p>}
            <p className="text-sm text-gray-600 mt-2">
              Click to explore your Memora
            </p>
          </div>
        </div>

        {/* Back of Polaroid */}
        <div
          className="absolute w-full h-full backface-hidden bg-white p-6 rounded-lg shadow-lg"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="flex-grow overflow-y-auto">
              <p className="text-gray-700 leading-relaxed">{story}</p>
            </div>
            {date && <p className="text-sm text-gray-500 mt-4">{date}</p>}
            <p className="text-sm text-gray-600 mt-4 text-center">
              Click to flip back
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
