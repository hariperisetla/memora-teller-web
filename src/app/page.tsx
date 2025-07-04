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
import { motion } from "framer-motion";
import { ArrowRight, Camera, Heart, Share2 } from "lucide-react";

const exampleMemories = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Summer Beach Day",
    story:
      "The perfect summer day at the beach with friends. We spent hours playing volleyball, building sandcastles, and watching the sunset. The waves were perfect for swimming, and the salty breeze carried the sound of laughter and music. This day reminded me of how precious these moments are.",
    date: "July 15, 2023",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    title: "Mountain Adventure",
    story:
      "Our first major hiking trip together. The view from the summit was breathtaking - endless mountains stretching into the horizon, painted in the golden light of dawn. The challenging climb was worth every step, and the sense of accomplishment we felt at the top was indescribable.",
    date: "August 22, 2023",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    title: "City Lights",
    story:
      "The city never sleeps, and neither did we that night. Walking through the neon-lit streets, discovering hidden cafes, and watching the city come alive after dark. The energy was electric, and every corner held a new surprise. This photo captures the magic of urban exploration.",
    date: "September 5, 2023",
  },
];

async function fetchUserPhotos(userId: string) {
  const db = getFirestore(app);
  const q = query(
    collection(db, "memories"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export default function Home() {
  const { user, loading } = useAuth();
  const [photos, setPhotos] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPhotos(user.uid).then((data) => {
        setPhotos(data);
        setGalleryLoading(false);
      });
    } else {
      setGalleryLoading(false);
    }
  }, [user]);

  if (loading || galleryLoading)
    return <div className="text-center py-20">Loading...</div>;

  if (user) {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
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

  // Unauthenticated: show marketing home page
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-6 font-pacifico">
            Capture Your Story
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Look back at your photos to understand the stories better.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Creating <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              View Gallery
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Camera className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
            <p className="text-gray-600">
              Add your favorite photos and create beautiful polaroid-style
              memories.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Write Stories</h3>
            <p className="text-gray-600">
              Add your personal story, emotions, and memories to each photo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Share2 className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Memories</h3>
            <p className="text-gray-600">
              Share your memories with friends and family, or keep them private.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Example Polaroid Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Example Memories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleMemories.map((memory, index) => (
            <motion.div
              key={memory.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Polaroid {...memory} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Story?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users creating beautiful memories with
            MemoraTeller.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
