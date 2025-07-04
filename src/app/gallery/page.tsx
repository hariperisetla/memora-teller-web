"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Polaroid } from "@/components/Polaroid";
import Link from "next/link";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

// Placeholder for fetching user photos from Firebase
async function fetchUserPhotos(userId: string) {
  console.log(userId);
  const db = getFirestore(app);
  const q = query(
    collection(db, "memories"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export default function GalleryPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPhotos(user.uid).then((data) => {
        setPhotos(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!user)
    return (
      <div className="text-center py-20">
        Please sign in to view your gallery.
      </div>
    );

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-28">
        <p className="mb-6 text-lg">You have no memories yet.</p>
        <Link href="/create-memora">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Create Memory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-4xl font-bold text-center mb-10">Your Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo, idx) => (
          <Polaroid
            key={idx}
            imageUrl={photo.imageUrl}
            title={photo.title}
            story={photo.story}
            date={
              photo.createdAt && photo.createdAt.toDate
                ? photo.createdAt.toDate().toLocaleDateString()
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
