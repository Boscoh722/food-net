import React from "react";
import { Shield, Scale, FileText, Mail, MapPin } from "lucide-react";

const APP_NAME = "Food-Net";
const COMPANY_NAME = "[Food-Net]";

export default function Terms() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-emerald-100 dark:border-gray-700 p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Terms & Conditions
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
            <strong>{APP_NAME}</strong> — Empowering Local Food Networks
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-8">
            Last Updated: <span className="font-semibold">November 04, 2025</span>
          </p>

          {/* Introduction */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 dark:border-emerald-400 p-5 rounded-lg mb-8">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              These Terms of Use (“Terms”) form a legally binding agreement between{" "}
              <strong>{COMPANY_NAME}</strong> (“we,” “our,” or “us”) and you. By
              accessing or using <strong>{APP_NAME}</strong>, you acknowledge that you
              have read, understood, and agree to be bound by these Terms and our{" "}
              <strong>Privacy Policy</strong>. If you do not agree, discontinue use
              immediately.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
            {/* 1 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                1. Acceptance and Agreement
              </h2>
              <p>1.1. These Terms govern the relationship between you and the Company.</p>
              <p>
                1.2. They incorporate our Privacy Policy in compliance with the{" "}
                <strong>Kenya Data Protection Act, 2019 (DPA)</strong>.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                2. Eligibility and User Representation
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use {APP_NAME}.</li>
                <li>You must have the legal capacity to enter into this agreement.</li>
                <li>Use of this App is subject to Kenyan law.</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                3. App Services & User Accounts
              </h2>
              <p>
                You agree to provide accurate information during registration and maintain
                confidentiality of your account credentials. {APP_NAME} connects
                consumers, farmers, and accredited transporters across Kenya.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                4. Prohibited Conduct
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-4 rounded-md">
                <p className="mb-2 font-semibold">You must not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate any Kenyan law or regulation.</li>
                  <li>Engage in fraud, cybercrime, or spam.</li>
                  <li>Collect other users’ data without consent.</li>
                  <li>Disrupt App performance or security.</li>
                </ul>
              </div>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                5. Intellectual Property
              </h2>
              <p>
                All rights to code, design, and content belong to <strong>{COMPANY_NAME}</strong>.
                You are granted a limited, non-transferable license for personal use only.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                6. Data Protection & User Rights
              </h2>
              <p>
                We comply with the <strong>Kenya Data Protection Act (2019)</strong>.
                You have rights of access, rectification, and deletion as explained in our
                Privacy Policy.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                7. Disclaimers & Limitation of Liability
              </h2>
              <p>
                {APP_NAME} is provided “as is.” We do not guarantee uninterrupted
                availability. Our liability shall not exceed{" "}
                <strong>KES 5,000</strong> or the amount you paid us in the last 12 months.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                8. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless the Company, its employees, and
                affiliates from any claims arising from your use of the App or violation of
                these Terms.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                9. Governing Law & Dispute Resolution
              </h2>
              <p>
                Governed by the laws of Kenya. Disputes shall be resolved amicably, and if
                not, through arbitration in Nairobi per the <strong>Arbitration Act (1995)</strong>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                10. Contact Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <a
                    href="mailto:boscobrilli8@gmail.com"
                    className="hover:text-emerald-600 font-medium"
                  >
                    boscobrilli8@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Private Box, Nairobi — Kenya</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-center text-gray-500 dark:text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved. |
              Designed for transparency and user trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
