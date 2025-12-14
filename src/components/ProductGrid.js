import React from 'react';
import './ProductGrid.css';
import ProductCard from './ProductCard';

function ProductGrid() {
  const products = [
    {
      id: 1,
      name: 'Matcha Mochi',
      price: '$3.50',
      image: '/images/MatchaMochi.jpg'
    },
    {
      id: 2,
      name: 'Sakura Dango',
      price: '$4.00',
      image: '/images/SakuraDango.jpg'
    },
    {
      id: 3,
      name: 'Yuzu Cheesecake',
      price: '$5.50',
      image: '/images/YUzuCheeseCake.jpg'
    },
    {
      id: 4,
      name: 'Anmitsu Bowl',
      price: '$6.00',
      image: '/images/AnmitsuBowl.jpg'
    },
    {
      id: 5,
      name: 'Red Bean Taiyaki',
      price: '$3.00',
      image: '/images/taiyakifish.jpg'
    },
    {
      id: 6,
      name: 'Hojicha Roll Cake',
      price: '$5.00',
      image: '/images/HojicaRollCake.jpg'
    }
  ];

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

