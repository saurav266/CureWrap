// src/pages/PrivacyPolicy.jsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-teal-600 mb-2">
            CureWrap Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: <span className="font-medium">{new Date().getFullYear()}</span>
          </p>
        </header>

        {/* Intro */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            At <span className="font-semibold">CureWrap</span>, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains how we collect, use, share, and
            safeguard your data when you visit or make a purchase on{" "}
            <span className="font-medium">www.curewrapplus.com</span>.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            We may collect the following types of information when you interact with our website:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base mb-4">
            <li>
              <span className="font-semibold">Personal Information:</span> Name, email address, phone number,
              billing and shipping address provided during checkout or account creation.
            </li>
            <li>
              <span className="font-semibold">Order Information:</span> Products purchased, transaction amount,
              order history, and preferences.
            </li>
            <li>
              <span className="font-semibold">Technical Information:</span> IP address, browser type, device
              type, operating system, referring URLs, and pages visited.
            </li>
            <li>
              <span className="font-semibold">Communication Data:</span> Messages or emails sent to our support
              team, feedback, or survey responses.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            We do <span className="font-semibold">not</span> store your complete credit/debit card numbers or
            online banking passwords on our servers. Payment information is handled securely by third-party
            payment gateways.
          </p>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>To process and fulfill your orders, including shipping and delivery updates.</li>
            <li>To communicate with you regarding orders, returns, exchanges, or support queries.</li>
            <li>To improve our website, products, and customer experience.</li>
            <li>To detect and prevent fraud, unauthorized transactions, or abuse of our services.</li>
            <li>
              To send you important service-related notifications, such as policy updates or security alerts.
            </li>
          </ul>
        </section>

        {/* 3. Cookies & Tracking Technologies */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            3. Cookies &amp; Tracking Technologies
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            Our website uses cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base mb-3">
            <li>Remember your cart and preferences.</li>
            <li>Improve website performance and loading speed.</li>
            <li>Understand how users interact with our pages to enhance usability.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            You can disable cookies through your browser settings; however, some website features may not
            function properly if cookies are disabled.
          </p>
        </section>

        {/* 4. Sharing of Information */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            4. Sharing of Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            We respect your privacy and do not sell or rent your personal information to third parties. We
            may share your information only with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base mb-3">
            <li>
              <span className="font-semibold">Logistics &amp; Courier Partners:</span> To deliver your orders
              to your provided address.
            </li>
            <li>
              <span className="font-semibold">Payment Gateway Providers:</span> To securely process your online
              payments.
            </li>
            <li>
              <span className="font-semibold">Legal or Regulatory Authorities:</span> When required to comply
              with applicable laws, regulations, or legal processes.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            CureWrap operates only via its own official website and does not share customer data with resellers,
            marketplace sellers, or unauthorized third-party vendors.
          </p>
        </section>

        {/* 5. Data Security */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            5. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            We implement reasonable technical and organizational measures, such as SSL encryption and secure
            servers, to protect your personal data from unauthorized access, alteration, or disclosure.
            However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee
            absolute security. You share information with us at your own risk.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            6. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in
            this Privacy Policy, unless a longer retention period is required or permitted by law (for example,
            for tax, accounting, or legal reporting obligations).
          </p>
        </section>

        {/* 7. Children’s Privacy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            7. Children’s Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Our website and products are intended for individuals who are 18 years of age or older. We do not
            knowingly collect personal information from children under 18. If you believe that a child has
            provided us with personal data, please contact us so we can take appropriate action.
          </p>
        </section>

        {/* 8. Your Rights & Choices */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            8. Your Rights &amp; Choices
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            Subject to applicable law, you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete information.</li>
            <li>Request deletion of your personal data, subject to legal or contractual obligations.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mt-3">
            To exercise any of these rights, you can contact us using the details provided in the{" "}
            <span className="font-semibold">Contact Information</span> section below.
          </p>
        </section>

        {/* 9. Changes to This Privacy Policy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            We may update or modify this Privacy Policy from time to time to reflect changes in our practices,
            technologies, or legal requirements. Any such changes will be posted on{" "}
            <span className="font-medium">www.curewrapplus.com</span>, and the &quot;Last Updated&quot; date at
            the top of this page will be revised accordingly. Your continued use of the website after such
            changes indicates your acceptance of the updated policy.
          </p>
        </section>

        {/* 10. Contact Information */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            10. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
            practices, please contact:
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