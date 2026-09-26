export const STORE_INFO = {
  nameAr: 'مكتبة المركز العلمي',
  nameEn: 'Scientific Center Bookstore',
  phone: '+20 100 000 0000',
  email: 'info@scientific-center.com',
  addressAr: 'القاهرة، مصر',
  addressEn: 'Cairo, Egypt',
  instapayNumber: '01000000000',
  walletNumber: '01000000000',
  walletName: 'مكتبة المركز العلمي',
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  whatsapp: 'https://wa.me/201000000000',
};

export const SHIPPING_COST = 30;

export const PAYMENT_METHODS = [
  { value: 'cod', labelAr: 'الدفع عند الاستلام', labelEn: 'Cash on Delivery', icon: 'Banknote' },
  { value: 'wallet', labelAr: 'محفظة إلكترونية', labelEn: 'E-Wallet', icon: 'Wallet' },
  { value: 'instapay', labelAr: 'إنستاباي', labelEn: 'InstaPay', icon: 'Smartphone' },
] as const;

export const ORDER_STATUSES = {
  pending: { labelAr: 'قيد المراجعة', labelEn: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { labelAr: 'تم التأكيد', labelEn: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { labelAr: 'قيد التجهيز', labelEn: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { labelAr: 'تم الشحن', labelEn: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { labelAr: 'تم التسليم', labelEn: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', color: 'bg-red-100 text-red-800' },
} as const;

export const PAYMENT_STATUSES = {
  unpaid: { labelAr: 'غير مدفوع', labelEn: 'Unpaid', color: 'bg-gray-100 text-gray-800' },
  pending_review: { labelAr: 'بانتظار المراجعة', labelEn: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  paid: { labelAr: 'مدفوع', labelEn: 'Paid', color: 'bg-green-100 text-green-800' },
  rejected: { labelAr: 'مرفوض', labelEn: 'Rejected', color: 'bg-red-100 text-red-800' },
} as const;