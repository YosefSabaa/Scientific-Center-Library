'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const allImages = images.length > 0 ? images : ['/placeholder.png'];

  const next = () => setActive((a) => (a + 1) % allImages.length);
  const prev = () => setActive((a) => (a - 1 + allImages.length) % allImages.length);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-purple/5 to-brand-light/5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={allImages[active]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-lg shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ZoomIn className="h-5 w-5 text-brand-purple" />
          </button>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 start-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-lg shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
              >
                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 end-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-lg shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
              >
                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </>
          )}
        </motion.div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all',
                  active === idx
                    ? 'border-brand-purple shadow-lg shadow-brand-purple/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={img}
                  alt={`${name} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/95 p-4"
            onClick={() => setZoomed(false)}
          >
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-4 end-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-lg hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative h-[80vh] w-full max-w-4xl"
            >
              <Image
                src={allImages[active]}
                alt={name}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}