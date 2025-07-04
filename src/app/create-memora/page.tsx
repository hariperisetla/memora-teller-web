"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Polaroid } from "@/components/Polaroid";

export default function CreateMemoraPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "edit">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [uploading, setUploading] = useState(false);

  async function compressImage(
    file: File,
    maxSize = 1080,
    quality = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height, maxSize);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No canvas context");
        // Center crop to square
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Compression failed");
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    setImageFile(file);
    setUploading(true);
    try {
      // Compress image but do not upload yet
      const compressed = await compressImage(file);
      setCompressedImage(compressed);
      setUploading(false);
      setStep("edit");
    } catch (err) {
      setUploading(false);
      alert("Image processing failed. Please try again.");
    }
  }

  async function handleSave() {
    if (!user || !compressedImage || !title || !story) return;
    setUploading(true);
    try {
      const storage = getStorage(app);
      const fileRef = storageRef(
        storage,
        `users/${user.uid}/memories/${Date.now()}_${
          imageFile?.name || "memora"
        }.jpg`
      );
      await uploadBytes(fileRef, compressedImage);
      const url = await getDownloadURL(fileRef);
      const db = getFirestore(app);
      await addDoc(collection(db, "memories"), {
        userId: user.uid,
        imageUrl: url,
        title,
        story,
        createdAt: serverTimestamp(),
      });
      setUploading(false);
      router.push("/");
    } catch (err) {
      setUploading(false);
      alert("Failed to save memory. Please try again.");
    }
  }

  if (!user)
    return (
      <div className="text-center py-20">
        Please sign in to create a memora.
      </div>
    );

  if (step === "upload") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Create a New Memora
          </h1>
          <p className="mb-6 text-gray-600 text-center text-base">
            Upload a photo to start your memory. The image will be cropped to a
            square, just like Instagram.
          </p>
          <label className="w-full flex flex-col items-center px-4 py-6 bg-purple-50 text-purple-600 rounded-lg shadow border border-purple-200 cursor-pointer hover:bg-purple-100 transition mb-6">
            <span className="mt-2 text-base leading-normal font-medium">
              Select a photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {imageFile && (
            <div className="w-64 h-72 mb-6 flex flex-col items-center justify-center">
              <span className="mb-2 text-sm text-gray-500 font-medium">
                Preview
              </span>
              <div className="shadow-lg rounded-xl bg-gray-50 p-2">
                <Polaroid
                  imageUrl={URL.createObjectURL(imageFile)}
                  title={title || "Preview"}
                  story={story || ""}
                />
              </div>
            </div>
          )}
          {uploading && <p className="mt-2 text-purple-600">Processing...</p>}
        </div>
      </div>
    );
  }

  // Edit step: show simple editor
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full flex flex-col items-center relative">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Edit Your Memory
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-auto md:h-[28rem] overflow-y-auto pb-24 md:pb-0">
          {/* Polaroid Preview Column */}
          <div className="flex flex-col items-center justify-center w-full h-full">
            <span className="mb-2 text-sm text-gray-500 font-medium">
              Preview
            </span>
            <div className="shadow-lg rounded-xl bg-gray-50 p-2 w-full max-w-xs h-56 sm:h-64 flex items-center justify-center">
              <Polaroid
                imageUrl={imageFile ? URL.createObjectURL(imageFile) : ""}
                title={title || "Preview"}
                story={story || ""}
              />
            </div>
          </div>
          {/* Form Column */}
          <div className="flex flex-col items-center justify-center w-full h-full">
            <form
              className="w-full max-w-xs flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="title"
              >
                Title (front of photo)
              </label>
              <input
                id="title"
                type="text"
                placeholder="Title (front of photo)"
                className="px-4 py-2 border rounded w-full text-base focus:ring-2 focus:ring-purple-200 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="story"
              >
                Your Memora (back of photo)
              </label>
              <textarea
                id="story"
                placeholder="Your Memora (back of photo)"
                className="px-4 py-2 border rounded w-full text-base focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={4}
              />
              {/* Hide button on mobile, show on desktop */}
              <div className="hidden md:block mt-2">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 w-full text-lg font-semibold py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition"
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save Memory"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Fixed Save button on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white bg-opacity-90 px-4 py-3 shadow-t flex justify-center">
          <Button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-600 w-full max-w-xs text-lg font-semibold py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition"
            disabled={uploading}
            onClick={handleSave}
          >
            {uploading ? "Saving..." : "Save Memory"}
          </Button>
        </div>
      </div>
    </div>
  );
}
