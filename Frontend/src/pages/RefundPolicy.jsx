// src/pages/RefundPolicy.jsx
import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-teal-600 mb-2">
            CureWrap Policies
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Return, Refund &amp; Exchange Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: <span className="font-medium">{new Date().getFullYear()}</span>
          </p>
        </header>

        {/* Intro */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Thank you for shopping with <span className="font-semibold">CureWrap</span>. 
            We design and manufacture premium orthotic supports with comfort and safety at the core. 
            This Return, Refund &amp; Exchange Policy (&quot;Policy&quot;) applies to all purchases 
            made exclusively through our official website{" "}
            <span className="font-medium">www.curewrapplus.com</span>. By placing an order on our 
            website, you agree to the terms described below.
          </p>
        </section>

        {/* 1. Eligibility for Returns */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            1. Eligibility for Returns
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            A return request may be accepted only under the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>The product delivered is damaged, defective, or incorrect.</li>
            <li>The return request is raised within <span className="font-semibold">7 days</span> from the date of delivery.</li>
            <li>
              The product is unused, unwashed, unaltered, and returned in its original packaging
              along with all accessories, manuals, and labels.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mt-4">
            For health, safety, and hygiene reasons,{" "}
            <span className="font-semibold">
              used or worn orthotic supports are non-returnable
            </span>{" "}
            unless a verified manufacturing defect is confirmed by CureWrap after inspection.
          </p>
        </section>

        {/* 2. Non-Returnable Items */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            2. Non-Returnable Items
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            We do not accept returns for the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>Products showing signs of use, washing, sweat, or deodorant marks.</li>
            <li>Products physically damaged after delivery due to misuse or mishandling.</li>
            <li>
              Size issues where the customer has selected an incorrect size{" "}
              <span className="font-semibold">more than once</span> for the same product.
            </li>
            <li>Items returned without original packaging, missing labels, or missing components.</li>
            <li>Products clearly marked as &quot;Non-returnable&quot; on the product page.</li>
            <li>Return requests raised beyond <span className="font-semibold">7 days</span> from the delivery date.</li>
          </ul>
        </section>

        {/* 3. Size Exchange Policy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            3. Size Exchange Policy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            CureWrap allows a <span className="font-semibold">one-time size exchange</span> per order, 
            subject to the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>The exchange request must be raised within 7 days of delivery.</li>
            <li>
              The product must be unused, undamaged, and returned in its original condition and packaging.
            </li>
            <li>
              The customer is responsible for all shipping charges associated with size exchanges, unless
              expressly waived by CureWrap in writing.
            </li>
            <li>Exchanges are subject to stock availability for the requested size.</li>
            <li>
              Once a replacement for a size issue has been delivered,{" "}
              <span className="font-semibold">
                no further refunds or exchanges will be provided for the same order
              </span>.
            </li>
            <li>
              Any price difference (positive or negative) between sizes will typically{" "}
              <span className="font-semibold">not be adjusted</span> unless otherwise stated at the time of exchange.
            </li>
          </ul>
        </section>

        {/* 4. Replacement Policy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            4. Replacement Policy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            If an incorrect product is received, or the product is received in defective or damaged
            condition, CureWrap may, at its sole discretion:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>Provide a replacement of the same product at no additional cost, or</li>
            <li>Issue a refund after inspection and verification of the returned product.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mt-4">
            All defect-related claims must be supported by clear{" "}
            <span className="font-semibold">photo and/or video evidence</span> provided by the customer
            at the time of raising the request.
          </p>
        </section>

        {/* 5. Refund Policy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            5. Refund Policy
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              Approved refunds will be processed to the{" "}
              <span className="font-semibold">original payment method</span> used at checkout within
              approximately <span className="font-semibold">5–10 business days</span> after the returned
              product passes inspection.
            </li>
            <li>
              Shipping charges and Cash on Delivery (COD) fees are{" "}
              <span className="font-semibold">non-refundable</span> unless the return is due to an error
              on CureWrap’s part (damaged, defective, or incorrect product delivered).
            </li>
            <li>
              Refund timelines may vary based on the customer’s bank, card issuer, or payment gateway
              policies.
            </li>
          </ul>
        </section>

        {/* 6. Cancellation Policy */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            6. Cancellation Policy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Orders may be cancelled only{" "}
            <span className="font-semibold">before dispatch</span>. Once the order has been shipped,
            cancellation is no longer possible and the terms of this Policy will apply. In such cases,
            you may raise a return or exchange request as per the applicable sections above.
          </p>
        </section>

        {/* 7. COD Refusal & Delivery Failure */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            7. COD Refusal &amp; Delivery Failure
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            In case a Cash on Delivery (COD) order is refused at the time of delivery, or if delivery
            repeatedly fails due to reasons attributable to the customer:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              CureWrap reserves the right to restrict or disable COD payment options for future orders
              from that customer.
            </li>
            <li>
              Repeated refusals or non-acceptance may result in the customer’s account being{" "}
              <span className="font-semibold">blocked or blacklisted</span> from using COD services.
            </li>
          </ul>
        </section>

        {/* 8. Quality Check & Acceptance */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            8. Quality Check &amp; Acceptance
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
            All returned products are subjected to a thorough quality check upon receipt. CureWrap
            reserves the right to reject any return or exchange if:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
            <li>The product does not meet the return conditions mentioned in this Policy.</li>
            <li>The product is found to be used, washed, damaged, or incomplete.</li>
            <li>Serial numbers, hygiene seals, or security tags are removed, altered, or tampered with.</li>
          </ul>
        </section>

        {/* 9. Limitation of Liability */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            CureWrap’s maximum liability for any claim arising out of any purchase shall not exceed the{" "}
            <span className="font-semibold">actual amount paid</span> for the product in question. CureWrap
            shall not be liable for any indirect, incidental, special, or consequential damages arising
            from the use or inability to use our products.
          </p>
        </section>

        {/* 10. Policy Modification Rights */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            10. Policy Modification Rights
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            CureWrap reserves the right to amend, update, or modify this Policy at any time without prior
            notice. The latest version will always be available on{" "}
            <span className="font-medium">www.curewrapplus.com</span>. Continued use of the website and
            placement of orders after such changes constitutes acceptance of the updated Policy.
          </p>
        </section>

        {/* 11. Contact Information */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            11. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
            Any return, refund, or exchange request can be placed directly from your order page on our
            website. For assistance or support related to returns and exchanges, please contact:
          </p>
          <div className="space-y-1 text-sm md:text-base">
            <p className="text-gray-800 font-semibold">CureWrap Support</p>
            <p className="text-gray-700">
              Email: <a href="mailto:support@curewrapplus.com" className="text-teal-600 underline">support@curewrapplus.com</a>
            </p>
            <p className="text-gray-700">
              Website:{" "}
              <a href="https://www.curewrapplus.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">
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