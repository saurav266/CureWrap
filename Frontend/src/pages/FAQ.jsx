// src/pages/FAQ.jsx
import React from "react";

export default function FAQ() {
  const faqs = [
    {
      q: "What is CureWrap?",
      a: "CureWrap is a premium orthotic brand offering scientifically designed knee braces, posture correctors, lumbar belts, and compression supports engineered for comfort, mobility, and pain relief."
    },
    {
      q: "How do I choose the perfect size?",
      a: "Each product page contains a detailed sizing chart. Please measure the recommended body part using a measuring tape and select the size closest to your measurement. If you are between two sizes, choosing the larger size is generally recommended."
    },
    {
      q: "Is CureWrap medically approved?",
      a: "CureWrap products are developed using orthotic and biomechanics principles. While our braces provide support and comfort, they do not replace professional medical treatment. We always recommend consulting a healthcare professional for chronic or post-surgery issues."
    },
    {
      q: "Can I wear my CureWrap brace all day?",
      a: "Yes. Our products are made using breathable and skin-friendly fabrics designed for long wear. However, if you feel discomfort or numbness, remove the product and consult a medical professional."
    },
    {
      q: "Can I return or exchange the product?",
      a: "Returns are accepted only if the product is damaged, defective, or incorrect. We also offer a one-time size exchange within 7 days of delivery. For hygiene reasons, used or worn supports are not returnable. Visit our Return & Refund Policy page for full details."
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes, COD is available for most locations across India. If a COD order is refused without a valid reason, we reserve the right to restrict COD for future orders."
    },
    {
      q: "How long will delivery take?",
      a: "Orders are usually delivered within 3–7 working days depending on your location. Tracking details are shared via SMS/email once dispatched."
    },
    {
      q: "Do you have offline stores or other sellers?",
      a: "No. CureWrap is exclusively available on our official website www.curewrapplus.com. We do not sell through any offline or third-party retailers."
    },
    {
      q: "Can I wash my brace or belt?",
      a: "Yes. Hand wash only with mild detergent and air dry. Do not machine wash, bleach, or iron as this may damage compression zones and support bands."
    },
    {
      q: "How do I contact customer support?",
      a: "You can email us at support@curewrapplus.com or call +91-81231 31143 for product, tracking or after-sales support."
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-teal-600 mb-2">
            CureWrap Support
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Find answers to the most commonly asked questions about CureWrap products, orders, sizing and usage.
          </p>
        </header>

        {/* FAQ Accordion */}
        <section className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white border border-gray-200 shadow-sm rounded-xl p-5 cursor-pointer"
            >
              <summary className="flex justify-between items-center font-semibold text-gray-900 text-base md:text-lg">
                {faq.q}
                <span className="transition-transform group-open:rotate-180 text-teal-600 text-xl font-bold">
                  +
                </span>
              </summary>
              <p className="text-gray-700 mt-3 leading-relaxed text-sm md:text-base">
                {faq.a}
              </p>
            </details>
          ))}
        </section>

        {/* Contact CTA */}
        <section className="mt-14 text-center">
          <p className="text-gray-700 text-sm md:text-base mb-3">
            Still have questions? We're happy to help!
          </p>
          <a
            href="mailto:support@curewrapplus.com"
            className="inline-block bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-8 py-3 rounded-full font-semibold shadow hover:scale-[1.03] transition-transform"
          >
            Contact Support
          </a>
          <p className="mt-4 text-gray-500 text-sm md:text-base">
            Customer Care: +91-84206 44354
          </p>
        </section>
      </main>
    </div>
  );
}