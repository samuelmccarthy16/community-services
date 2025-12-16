import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
      </div>
      <CardContent className="p-4">
        <Badge className="mb-2">{product.category}</Badge>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">{product.stock} in stock</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full" disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
