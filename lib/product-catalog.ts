export interface CatalogProduct {
  id: string
  name: string
  category: string
  image: string
  commonPrices: number[]
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // Medicines
  { id: 'dolo-650', name: 'Dolo 650', category: 'Medicine', image: '/medicine-tablet.png', commonPrices: [28, 30, 32] },
  { id: 'paracetamol', name: 'Paracetamol', category: 'Medicine', image: '/paracetamol-tablets.png', commonPrices: [15, 18, 20] },
  { id: 'crocin', name: 'Crocin', category: 'Medicine', image: '/crocin-medicine.jpg', commonPrices: [25, 28, 30] },
  { id: 'vicks-vaporub', name: 'Vicks Vaporub', category: 'Medicine', image: '/vicks-vaporub-bottle.jpg', commonPrices: [120, 130, 140] },
  
  // Hygiene
  { id: 'hand-sanitizer', name: 'Hand Sanitizer', category: 'Hygiene', image: '/hand-sanitizer-bottle.jpg', commonPrices: [80, 100, 120] },
  { id: 'face-mask', name: 'Face Mask Pack', category: 'Hygiene', image: '/medical-face-masks.jpg', commonPrices: [200, 250, 300] },
  
  // Grocery
  { id: 'maggi', name: 'Maggi Noodles', category: 'Grocery', image: '/noodles-packet.jpg', commonPrices: [12, 14, 15] },
  { id: 'bread', name: 'Bread', category: 'Grocery', image: '/placeholder.jpg', commonPrices: [30, 35, 40] },
  { id: 'milk', name: 'Milk (1L)', category: 'Grocery', image: '/milk-packet.jpg', commonPrices: [50, 55, 60] },
  { id: 'atta', name: 'Atta (Flour)', category: 'Grocery', image: '/flour-bag.png', commonPrices: [300, 350, 400] },
]

export const CATEGORIES = ['All', 'Medicine', 'Hygiene', 'Grocery']
