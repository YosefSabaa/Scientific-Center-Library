'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { checkoutSchema, type CheckoutInput } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { generateOrderNumber } from '@/lib/utils';
import { SHIPPING_COST } from '@/lib/constants';
import PaymentMethod from './PaymentMethod';
import ReceiptUpload from './ReceiptUpload';

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, profile } = useUser();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet' | 'instapay'>('cod');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: profile?.full_name || '',
      customer_phone: profile?.phone || '',
      customer_email: user?.email || '',
      shipping_address: profile?.address || '',
      payment_method: 'cod',
    },
  });

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) {
      toast.error(locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty');
      return;
    }

    if ((paymentMethod === 'wallet' || paymentMethod === 'instapay') && !receiptFile) {
      toast.error(
        locale === 'ar'
          ? 'يجب رفع إيصال التحويل'
          : 'Please upload the payment receipt'
      );
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // 1. Upload receipt if exists
      let receiptUrl: string | null = null;
      if (receiptFile && user) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: upload, error: uploadErr } = await supabase.storage
          .from('payment-receipts')
          .upload(fileName, receiptFile);

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('payment-receipts')
          .getPublicUrl(upload.path);
        receiptUrl = urlData.publicUrl;
      }

      // 2. Create order
      const shipping = total > 500 ? 0 : SHIPPING_COST;
      const orderNumber = generateOrderNumber();

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status:
            paymentMethod === 'cod' ? 'unpaid' : 'pending_review',
          payment_receipt_url: receiptUrl,
          subtotal: total,
          shipping,
          total: total + shipping,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email || null,
          shipping_address: data.shipping_address,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name_ar: item.nameAr,
        product_name_en: item.nameEn,
        variant_info: item.variantInfo || null,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image || null,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsErr) throw itemsErr;

      clearCart();
      toast.success(t('orderSuccess'));
      router.push(`/${locale}/orders/${order.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (locale === 'ar' ? 'حدث خطأ' : 'Something went wrong'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Customer Info */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-white p-6"
      >
        <h2 className="mb-5 text-xl font-bold">{t('customerInfo')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="customer_name">{t('fullName')} *</Label>
            <div className="relative mt-2">
              <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="customer_name"
                {...register('customer_name')}
                placeholder={t('fullNamePlaceholder')}
                className="ps-10"
              />
            </div>
            {errors.customer_name && (
              <p className="mt-1 text-xs text-red-500">{errors.customer_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customer_phone">{t('phone')} *</Label>
            <div className="relative mt-2">
              <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="customer_phone"
                {...register('customer_phone')}
                placeholder={t('phonePlaceholder')}
                className="ps-10"
              />
            </div>
            {errors.customer_phone && (
              <p className="mt-1 text-xs text-red-500">{errors.customer_phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="customer_email">{t('email')}</Label>
            <div className="relative mt-2">
              <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="customer_email"
                type="email"
                {...register('customer_email')}
                placeholder={t('emailPlaceholder')}
                className="ps-10"
              />
            </div>
            {errors.customer_email && (
              <p className="mt-1 text-xs text-red-500">{errors.customer_email.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shipping_address">{t('address')} *</Label>
            <div className="relative mt-2">
              <MapPin className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="shipping_address"
                {...register('shipping_address')}
                placeholder={t('addressPlaceholder')}
                className="ps-10 min-h-[100px]"
              />
            </div>
            {errors.shipping_address && (
              <p className="mt-1 text-xs text-red-500">{errors.shipping_address.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <div className="relative mt-2">
              <FileText className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder={t('notesPlaceholder')}
                className="ps-10"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Payment Method */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-white p-6"
      >
        <h2 className="mb-5 text-xl font-bold">{t('paymentMethod')}</h2>

        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />

        {(paymentMethod === 'wallet' || paymentMethod === 'instapay') && (
          <div className="mt-6">
            <ReceiptUpload file={receiptFile} onChange={setReceiptFile} />
          </div>
        )}
      </motion.section>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full h-14 text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {locale === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
          </>
        ) : (
          t('placeOrder')
        )}
      </Button>
    </form>
  );
}