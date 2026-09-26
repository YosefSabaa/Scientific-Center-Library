import { Skeleton } from '@/components/ui/skeleton';

export default function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  );
}