export type Category =
  | 'all'
  | 'burgers'
  | 'pizza'
  | 'salads'
  | 'sushi'
  | 'beverages'
  | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'all'>;
  image: string;
  prepTime: number;
  rating: number;
  tags: string[];
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderConfirmation {
  orderId: string;
  studentId: string;
  studentName: string;
  pickupTime: string;
  total: number;
  items: CartItem[];
}
