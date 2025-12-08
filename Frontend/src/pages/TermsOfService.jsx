// src/pages/TermsOfService.jsx
import React from "react";

export default function TermsOfService() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-teal-600 mb-2">
            CureWrap Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: <span className="font-medium">{new Date().getFullYear()}</span>
          </p>
        </header>

        {/* Intro */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Welcome to <span className="font-semibold">CureWrap</span>. These Terms of Service
            (&quot;Terms&quot;) govern your access to and use of our website{" "}
            <span className="font-medium">www.curewrapplus.com</span> and any services, features,
            or content offered through it (collectively, the &quot;Service&quot;). By accessing or
            using our website, you agree to be bound by these Terms.
          </p>
        </section>

        {/* 1. Eligibility & Use of Website */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            1. Eligibility &amp; Use of Website
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            By using this website, you confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base mb-3">
            <li>You are at least 18 years of age or using the website under the supervision of a parent or legal guardian.</li>
            <li>
              You will provide accurate, current, and complete information wherever requested (such as during
              checkout or account creation).
            </li>
            <li>You will not use the website for any unlawful or unauthorized purpose.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            You agree not to interfere with or disrupt the Service or servers or networks connected to the
            Service, including by transmitting any worms, viruses, or malicious code.
          </p>
        </section>

        {/* 2. Exclusive Sales Channel */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            2. Exclusive Sales Channel
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            CureWrap products are sold <span className="font-semibold">exclusively</span> through our official
            website <span className="font-medium">www.curewrapplus.com</span>. We do not authorize sales through
            third-party websites, marketplaces, or offline stores. Any product purchased from an unauthorized
            seller will not be covered under our warranties, return policy, or customer support guarantees.
          </p>
        </section>

        {/* 3. Medical Disclaimer */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            3. Medical Disclaimer
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            CureWrap designs orthotic support products intended to provide comfort and support. However, our
            products are <span className="font-semibold">not a substitute</span> for professional medical advice,
            diagnosis, or treatment.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              Always consult a qualified healthcare professional before using any orthotic or support device,
              especially if you have an existing medical condition, recent injury, or surgery.
            </li>
            <li>
              Discontinue use and seek medical advice if you experience increased pain, discomfort, or adverse
              reactions while using our products.
            </li>
            <li>
              CureWrap does not guarantee any specific medical outcome, improvement, or recovery results from
              using our products.
            </li>
          </ul>
        </section>

        {/* 4. Orders, Pricing & Payments */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            4. Orders, Pricing &amp; Payments
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            All prices displayed on our website are in Indian Rupees (INR) unless stated otherwise and are
            subject to change without prior notice. Placing a product in your cart does not reserve the price
            or stock.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              An order is considered confirmed only after successful payment authorization or explicit
              confirmation in case of Cash on Delivery (COD).
            </li>
            <li>
              We reserve the right to refuse or cancel any order due to incorrect pricing, stock issues, or
              suspected fraudulent activity.
            </li>
            <li>
              Payment processing is handled by secure third-party payment gateways. We do not store your full
              card details or banking credentials on our servers.
            </li>
          </ul>
        </section>

        {/* 5. Shipping & Delivery */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            5. Shipping &amp; Delivery
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Estimated delivery timelines will be displayed at checkout based on your location. These are
            approximations and may vary due to courier delays, public holidays, or unforeseen circumstances.
            CureWrap is not liable for delays caused by third-party logistics partners, but we will support
            you in tracking and resolving delivery issues wherever possible.
          </p>
        </section>

        {/* 6. Returns, Refunds & Exchanges */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            6. Returns, Refunds &amp; Exchanges
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            All returns, refunds, and exchanges are governed by our{" "}
            <span className="font-semibold">Return, Refund &amp; Exchange Policy</span>. By placing an order,
            you acknowledge that you have read and agree to the terms described in that Policy.
          </p>
        </section>

        {/* 7. Intellectual Property */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            All content on the website, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base mb-3">
            <li>Logos, brand names, and trademarks</li>
            <li>Product images, videos, and descriptions</li>
            <li>Text, graphics, icons, and website layout</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            is the intellectual property of CureWrap and is protected under applicable laws. You may not copy,
            reproduce, distribute, or use any content from the website for commercial purposes without prior
            written consent from CureWrap.
          </p>
        </section>

        {/* 8. Prohibited Activities */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            8. Prohibited Activities
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            You agree not to engage in any of the following activities:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>Placing false or fraudulent orders.</li>
            <li>Reselling CureWrap products without prior written authorization.</li>
            <li>Harassing or abusing our customer support staff.</li>
            <li>Attempting to reverse engineer, hack, or disrupt the website.</li>
          </ul>
        </section>

        {/* 9. Limitation of Liability */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            To the fullest extent permitted by law, CureWrap shall not be liable for any indirect, incidental,
            special, or consequential damages arising out of your use or inability to use the website, products,
            or services. CureWrap’s total aggregate liability for any claim shall not exceed the amount paid by
            you for the specific product giving rise to such claim.
          </p>
        </section>

        {/* 10. Indemnification */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            10. Indemnification
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            You agree to indemnify, defend, and hold harmless CureWrap, its directors, employees, and partners
            from and against any claims, liabilities, damages, losses, and expenses arising out of or related 
            to your misuse of the website, violation of these Terms, or infringement of any rights of a third party.
          </p>
        </section>

        {/* 11. Changes to Terms */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            11. Changes to These Terms
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            CureWrap reserves the right to modify or update these Terms at any time without prior notice. The
            latest version will always be available on{" "}
            <span className="font-medium">www.curewrapplus.com</span>. Your continued use of the website after 
            any such changes are implemented constitutes your acceptance of the revised Terms.
          </p>
        </section>

        {/* 12. Contact Information */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            12. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
            For any questions or concerns regarding these Terms of Service, please contact:
          </p>
          <div className="space-y-1 text-sm md:text-base">
            <p className="text-gray-800 font-semibold">CureWrap Support</p>
            <p className="text-gray-700">
              Email:{" "}
              <a href="mailto:support@curewrapplus.com" className="text-teal-600 underline">
                support@curewrapplus.com
              </a>
            </p>
            <p className="text-gray-700">
              Website:{" "}
              <a
                href="https://www.curewrapplus.com"
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 underline"
              >
                www.curewrapplus.com
              </a>
            </p>
            <p className="text-gray-700">Phone: +91-81213 31143</p>
          </div>
        </section>
      </main>
    </div>
  );
}
