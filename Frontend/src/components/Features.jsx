import React from 'react';
import { FaShoppingBag, FaHeadset, FaTruck, FaUndoAlt } from 'react-icons/fa';

const Features = () => {
  const items = [
    {
      icon: <FaShoppingBag className="text-2xl text-blue-600" />,
      title: 'FSA/HSA ELIGIBLE',
      description: 'Accepts HSA & FSA payments',
    },
    {
      icon: <FaHeadset className="text-2xl text-green-600" />,
      title: 'SUPPORT 24/7',
      description: 'Chatdesk 24 hours a day, 7 days a week.',
    },
    {
      icon: <FaTruck className="text-2xl text-purple-600" />,
      title: 'FREE DELIVERY',
      description: 'on all orders from the US or Canada $99 or above.',
    },
    {
      icon: <FaUndoAlt className="text-2xl text-red-600" />,
      title: '100-DAY RETURN',
      description: 'Simply return it within 100 days for an exchange.',
    },
  ];

  return (
    <section className="bg-[#21aa9a] py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-3">
            <div className="bg-gray-100 p-4 rounded-full">{item.icon}</div>
            <h4 className="font-semibold text-sm">{item.title}</h4>
            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;