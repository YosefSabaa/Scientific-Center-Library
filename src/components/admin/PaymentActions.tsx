'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Check, X, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface PaymentActionsProps {
  orderId: string;
  receiptUrl: string | null;
  currentStatus: string;
}

export default function PaymentActions({
  orderId,
  receiptUrl,
  currentStatus,
}: PaymentActionsProps) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const isAr = locale === 'ar';

  const updatePaymentStatus = async (status: 'paid' | 'rejected') => {
    setLoading(status === 'paid' ? 'approve' : 'reject');
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', orderId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        status === 'paid'
          ? isAr
            ? 'تم قبول الدفع'
            : 'Payment approved'
          : isAr
          ? 'تم رفض الدفع'
          : 'Payment rejected'
      );
      router.refresh();
    }
    setLoading(null);
  };

  if (!receiptUrl) {
    return (
      <span className="text-xs text-muted-foreground">
        {isAr ? 'لا يوجد إيصال' : 'No receipt'}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={receiptUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:border-brand-purple hover:text-brand-purple"
      >
        <Eye className="h-3.5 w-3.5" />
        {isAr ? 'عرض الإيصال' : 'View Receipt'}
      </a>

      {currentStatus !== 'paid' && (
        <Button
          size="sm"
          onClick={() => updatePaymentStatus('paid')}
          disabled={loading !== null}
          className="h-8 bg-green-600 px-3 text-xs hover:bg-green-700"
        >
          {loading === 'approve' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {isAr ? 'قبول' : 'Approve'}
        </Button>
      )}

      {currentStatus !== 'rejected' && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => updatePaymentStatus('rejected')}
          disabled={loading !== null}
          className="h-8 px-3 text-xs"
        >
          {loading === 'reject' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          {isAr ? 'رفض' : 'Reject'}
        </Button>
      )}
    </div>
  );
}