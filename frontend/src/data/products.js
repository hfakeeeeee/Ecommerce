export const products = [
  // Laptops (10 products)
  {
    id: 1,
    name: "MacBook Pro M2",
    price: 1299.99,
    description: "Latest Apple MacBook Pro with M2 chip, 13-inch Retina display, and up to 20 hours battery life.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    category: "Laptops",
    stock: 50
  },
  {
    id: 2,
    name: "Dell XPS 15",
    price: 1599.99,
    description: "Premium Windows laptop with 4K OLED display and Intel Core i9 processor.",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    category: "Laptops",
    stock: 30
  },
  {
    id: 3,
    name: "Lenovo ThinkPad X1 Carbon",
    price: 1399.99,
    description: "Business laptop with legendary durability and performance.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
    category: "Laptops",
    stock: 40
  },
  {
    id: 4,
    name: "ASUS ROG Zephyrus",
    price: 1899.99,
    description: "Gaming laptop with RTX 4080, perfect for high-end gaming.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    category: "Laptops",
    stock: 25
  },
  {
    id: 5,
    name: "HP Spectre x360",
    price: 1299.99,
    description: "Convertible laptop with stunning design and versatility.",
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500",
    category: "Laptops",
    stock: 35
  },
  {
    id: 6,
    name: "Razer Blade 15",
    price: 1999.99,
    description: "Premium gaming laptop with RTX 4070 and 240Hz display.",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
    category: "Laptops",
    stock: 20
  },
  {
    id: 7,
    name: "Microsoft Surface Laptop 5",
    price: 1199.99,
    description: "Elegant design with powerful performance and PixelSense display.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500",
    category: "Laptops",
    stock: 45
  },
  {
    id: 8,
    name: "Acer Swift 5",
    price: 999.99,
    description: "Ultra-lightweight laptop with powerful performance.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    category: "Laptops",
    stock: 30
  },
  {
    id: 9,
    name: "MSI Creator Z16",
    price: 2199.99,
    description: "Professional laptop for content creators with RTX graphics.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500",
    category: "Laptops",
    stock: 15
  },
  {
    id: 10,
    name: "LG Gram 17",
    price: 1499.99,
    description: "Ultra-lightweight 17-inch laptop with long battery life.",
    image: "https://images.unsplash.com/photo-1544099858-75feeb57f01b?w=500",
    category: "Laptops",
    stock: 25
  },

  // Smartphones (10 products)
  {
    id: 11,
    name: "iPhone 15 Pro",
    price: 999.99,
    description: "Latest iPhone with A17 Pro chip and advanced camera system.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    category: "Smartphones",
    stock: 100
  },
  {
    id: 12,
    name: "Samsung Galaxy S24 Ultra",
    price: 1199.99,
    description: "Premium Android phone with S Pen and AI features.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    category: "Smartphones",
    stock: 75
  },
  {
    id: 13,
    name: "Google Pixel 8 Pro",
    price: 899.99,
    description: "Pure Android experience with exceptional camera capabilities.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    category: "Smartphones",
    stock: 60
  },
  {
    id: 14,
    name: "OnePlus 12",
    price: 799.99,
    description: "Flagship killer with Snapdragon 8 Gen 3 and fast charging.",
    image: "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?w=500",
    category: "Smartphones",
    stock: 45
  },
  {
    id: 15,
    name: "Xiaomi 14 Pro",
    price: 899.99,
    description: "Premium smartphone with Leica optics and fast performance.",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500",
    category: "Smartphones",
    stock: 40
  },
  {
    id: 16,
    name: "Nothing Phone 2",
    price: 699.99,
    description: "Unique design with Glyph interface and clean software.",
    image: "https://www.mytrendyphone.fi/images/Nothing-Phone-1-256GB-Black-6974434220256-03032023-01-p.webp?w=500",
    category: "Smartphones",
    stock: 30
  },
  {
    id: 17,
    name: "ASUS ROG Phone 7",
    price: 999.99,
    description: "Ultimate gaming phone with advanced cooling system.",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500",
    category: "Smartphones",
    stock: 25
  },
  {
    id: 18,
    name: "Sony Xperia 1 V",
    price: 1099.99,
    description: "Professional camera features with 4K display.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    category: "Smartphones",
    stock: 20
  },
  {
    id: 19,
    name: "Motorola Edge 40 Pro",
    price: 699.99,
    description: "Premium features at a competitive price.",
    image: "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=500",
    category: "Smartphones",
    stock: 35
  },
  {
    id: 20,
    name: "Vivo X100 Pro",
    price: 899.99,
    description: "Professional photography capabilities with Zeiss optics.",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
    category: "Smartphones",
    stock: 30
  },

  // Audio (10 products)
  {
    id: 21,
    name: "Sony WH-1000XM5",
    price: 349.99,
    description: "Premium noise-cancelling headphones with exceptional sound.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Audio",
    stock: 40
  },
  {
    id: 22,
    name: "AirPods Pro 2",
    price: 249.99,
    description: "Advanced wireless earbuds with active noise cancellation.",
    image: "https://images.unsplash.com/photo-1593442607435-e4e34991b210?w=500",
    category: "Audio",
    stock: 80
  },
  {
    id: 23,
    name: "Bose QuietComfort 45",
    price: 329.99,
    description: "Comfortable headphones with world-class noise cancellation.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
    category: "Audio",
    stock: 45
  },
  {
    id: 24,
    name: "Samsung Galaxy Buds 3 Pro",
    price: 199.99,
    description: "Premium earbuds with advanced ANC and spatial audio.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    category: "Audio",
    stock: 60
  },
  {
    id: 25,
    name: "Sennheiser Momentum 4",
    price: 379.99,
    description: "Audiophile-grade wireless headphones with long battery life.",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500",
    category: "Audio",
    stock: 35
  },
  {
    id: 26,
    id: 12,
    name: "PlayStation 5",
    description: "Next-gen gaming console with revolutionary controller.",
    price: 499.99,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
    stock: 30
  },
  {
    id: 13,
    name: "Xbox Series X",
    description: "Microsoft's most powerful gaming console ever.",
    price: 499.99,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500",
    stock: 25
  },
  {
    id: 14,
    name: "Nintendo Switch OLED",
    description: "Hybrid gaming console with vibrant OLED display.",
    price: 349.99,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500",
    stock: 50
  },

  // Smart Home (10 products)
  {
    id: 15,
    name: "Amazon Echo Show 10",
    description: "Smart display with motion tracking and Alexa.",
    price: 249.99,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=500",
    stock: 40
  },
  {
    id: 16,
    name: "Google Nest Hub Max",
    description: "Smart home controller with built-in camera.",
    price: 229.99,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
    stock: 35
  },
  {
    id: 17,
    name: "Philips Hue Starter Kit",
    description: "Smart lighting system for your home.",
    price: 199.99,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1557318041-1ce374d55ebf?w=500",
    stock: 55
  },

  // Wearables (10 products)
  {
    id: 18,
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring.",
    price: 399.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    stock: 70
  },
  {
    id: 19,
    name: "Samsung Galaxy Watch 6",
    description: "Premium Android smartwatch with fitness tracking.",
    price: 349.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 45
  },
  {
    id: 20,
    name: "Fitbit Sense 2",
    description: "Advanced health and fitness smartwatch.",
    price: 299.99,
    category: "Wearables",
    image: "https://m.media-amazon.com/images/I/614dL-649bL.jpg?w=500",
    stock: 55
  }
]

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'audio', name: 'Audio' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'smart-home', name: 'Smart Home' },
  { id: 'wearables', name: 'Wearables' }
] 