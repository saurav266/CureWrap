import React from 'react';
import { FaShoppingBag, FaHeadset, FaTruck, FaUndoAlt } from 'react-icons/fa';

const Features = () => {
  const items = [
    {
      icon: <FaShoppingBag className="text-2xl text-black transition-transform duration-300 group-hover:scale-125 group-hover:text-blue-600 w-25 h-10" />,
      title: 'FSA/HSA ELIGIBLE',
      description: 'Accepts HSA & FSA payments',
    },
    {
      icon: <FaHeadset className="text-2xl text-black transition-transform duration-300 group-hover:scale-125 group-hover:text-blue-600 w-25 h-10" />,
      title: 'SUPPORT 24/7',
      description: 'Chatdesk 24 hours a day, 7 days a week.',
    },
    {
      icon: <FaTruck className="text-2xl text-black transition-transform duration-300 group-hover:scale-125 group-hover:text-blue-600 w-25 h-10" />,
      title: 'FREE DELIVERY',
      description: 'on all orders from the US or Canada $99 or above.',
    },
    {
      icon: <FaUndoAlt className="text-2xl text-black transition-transform duration-300 group-hover:scale-125 group-hover:text-blue-600 w-25 h-10" />,
      title: '100-DAY RETURN',
      description: 'Simply return it within 100 days for an exchange.',
    },
  ];

  return (
    <section className="bg-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-3 group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="p-4">{item.icon}</div>
            <h4 className="font-semibold text-sm transition-all duration-300 group-hover:text-blue-600 group-hover:tracking-wide">
              {item.title}
            </h4>
            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;