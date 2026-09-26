 
'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { STORE_INFO } from '@/lib/constants';

interface ReceiptUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function ReceiptUpload({ file, onChange }: ReceiptUploadProps) {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [method, setMethod] = useState<'wallet' | 'instapay'>('wallet');

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error(locale === 'ar' ? 'يرجى رفع صورة' : 'Please upload an image');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error(locale === 'ar' ? 'الحجم أكبر من 5MB' : 'File size exceeds 5MB');
      return;
    }
    onChange(f);
    setPreview(URL.createObjectURL(f));
  };

  const remove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success(locale === 'ar' ? 'تم نسخ الرقم' : 'Number copied');
  };

  return (
    <div className="space-y-4">
      {/* Transfer Info */}
      <div className="rounded-xl border-2 border-dashed border-brand-purple/30 bg-brand-purple/5 p-4">
        <p className="mb-3 text-sm font-bold">{t('transferTo')}:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('walletNumber')}</p>
              <p className="font-mono font-bold" dir="ltr">
                {STORE_INFO.walletNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyNumber(STORE_INFO.walletNumber)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('instapayNumber')}</p>
              <p className="font-mono font-bold" dir="ltr">
                {STORE_INFO.instapayNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyNumber(STORE_INFO.instapayNumber)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div>
        <p className="mb-2 text-sm font-bold">{t('uploadReceipt')}</p>
        <p className="mb-3 text-xs text-muted-foreground">{t('uploadReceiptDesc')}</p>

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-2xl border-2 border-green-200 bg-green-50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={preview} alt="Receipt" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-bold">{t('receiptUploaded')}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {file?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={remove}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-500 transition-colors hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border p-8 transition-all hover:border-brand-purple hover:bg-brand-purple/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                  <Upload className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{t('chooseFile')}</p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'ar' ? 'PNG, JPG (حد أقصى 5MB)' : 'PNG, JPG (max 5MB)'}
                  </p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}