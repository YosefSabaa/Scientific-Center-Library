'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { ORDER_STATUSES } from '@/lib/constants';

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: value })
      .eq('id', orderId);

    if (error) toast.error(error.message);
    else {
      toast.success(locale === 'ar' ? 'تم التحديث' : 'Updated');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ORDER_STATUSES).map(([key, val]) => (
          <SelectItem key={key} value={key}>
            {locale === 'ar' ? val.labelAr : val.labelEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}