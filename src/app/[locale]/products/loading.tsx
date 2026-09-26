import ProductSkeleton from '@/components/products/ProductSkeleton';

export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 h-12 w-64 animate-pulse rounded-xl bg-brand-purple/10" />
      <div className="mb-6 h-12 w-full animate-pulse rounded-xl bg-brand-purple/10" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block space-y-4">
          <div className="h-96 animate-pulse rounded-2xl bg-brand-purple/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}