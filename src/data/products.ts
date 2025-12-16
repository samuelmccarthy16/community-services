export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Empowerment T-Shirt',
    description: 'Comfortable cotton t-shirt with inspirational message. 100% proceeds support our programs.',
    price: 25.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846937023_eeaa8a00.webp',
    category: 'Apparel',
    stock: 50
  },
  {
    id: '2',
    name: 'Hope Hoodie',
    description: 'Premium quality hoodie with embroidered logo. Stay warm while supporting our cause.',
    price: 45.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846937772_f8c7bd81.webp',
    category: 'Apparel',
    stock: 30
  },
  {
    id: '3',
    name: 'Inspiration Mug',
    description: 'Start your day with positivity. Ceramic mug with motivational quote.',
    price: 15.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846938511_fe9f00b8.webp',
    category: 'Accessories',
    stock: 100
  },
  {
    id: '4',
    name: 'Eco Tote Bag',
    description: 'Reusable canvas tote bag. Carry your essentials while making a difference.',
    price: 20.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846939337_c1c1d71d.webp',
    category: 'Accessories',
    stock: 75
  },
  {
    id: '5',
    name: 'Wellness Water Bottle',
    description: 'Stainless steel insulated bottle. Stay hydrated and support wellness programs.',
    price: 30.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846940042_4b1ec7c2.webp',
    category: 'Accessories',
    stock: 60
  },
  {
    id: '6',
    name: 'Unity Baseball Cap',
    description: 'Adjustable cap with embroidered logo. Perfect for any occasion.',
    price: 22.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846940806_fdb5dfaa.webp',
    category: 'Apparel',
    stock: 45
  },
  {
    id: '7',
    name: 'Gratitude Journal',
    description: 'Premium hardcover journal for daily reflections and gratitude practice.',
    price: 18.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846941543_e71005d0.webp',
    category: 'Stationery',
    stock: 40
  },
  {
    id: '8',
    name: 'Mindfulness Yoga Mat',
    description: 'High-quality yoga mat for your wellness journey. Non-slip and eco-friendly.',
    price: 35.00,
    image: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760846942228_474b7f7c.webp',
    category: 'Wellness',
    stock: 25
  }
];
