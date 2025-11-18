import React from "react";
import { Shield, Scale, FileText, Mail, MapPin } from "lucide-react";

const APP_NAME = "Food-Net";
const COMPANY_NAME = "Food-Net";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="section-container py-8">
        <div className="card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 text-lg">
              <strong>{APP_NAME}</strong> — Empowering Local Food Networks
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Last Updated: <span className="font-semibold">November 04, 2024</span>
            </p>
          </div>

          {/* Introduction */}
          <div className="alert alert-info mb-8">
            <p className="text-gray-700 leading-relaxed">
              These Terms of Use ("Terms") form a legally binding agreement between{" "}
              <strong>{COMPANY_NAME}</strong> ("we," "our," or "us") and you. By
              accessing or using <strong>{APP_NAME}</strong>, you acknowledge that you
              have read, understood, and agree to be bound by these Terms and our{" "}
              <strong>Privacy Policy</strong>. If you do not agree, discontinue use
              immediately.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* 1 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6" />
                1. Acceptance and Agreement
              </h2>
              <div className="space-y-2">
                <p>1.1. These Terms govern the relationship between you and the Company.</p>
                <p>
                  1.2. They incorporate our Privacy Policy in compliance with the{" "}
                  <strong>Kenya Data Protection Act, 2019 (DPA)</strong>.
                </p>
              </div>
            </section>

            {/* 2 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                2. Eligibility and User Representation
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use {APP_NAME}.</li>
                <li>You must have the legal capacity to enter into this agreement.</li>
                <li>Use of this App is subject to Kenyan law.</li>
              </ul>
            </section>

            {/* 3 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                3. App Services & User Accounts
              </h2>
              <p>
                You agree to provide accurate information during registration and maintain
                confidentiality of your account credentials. {APP_NAME} connects
                consumers, farmers, and accredited transporters across Kenya.
              </p>
            </section>

            {/* 4 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                4. Prohibited Conduct
              </h2>
              <div className="alert alert-error">
                <p className="font-semibold mb-3">You must not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate any Kenyan law or regulation.</li>
                  <li>Engage in fraud, cybercrime, or spam.</li>
                  <li>Collect other users' data without consent.</li>
                  <li>Disrupt App performance or security.</li>
                </ul>
              </div>
            </section>

            {/* 5 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                5. Intellectual Property
              </h2>
              <p>
                All rights to code, design, and content belong to <strong>{COMPANY_NAME}</strong>.
                You are granted a limited, non-transferable license for personal use only.
              </p>
            </section>

            {/* 6 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                6. Data Protection & User Rights
              </h2>
              <p>
                We comply with the <strong>Kenya Data Protection Act (2019)</strong>.
                You have rights of access, rectification, and deletion as explained in our
                Privacy Policy.
              </p>
            </section>

            {/* 7 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                7. Disclaimers & Limitation of Liability
              </h2>
              <p>
                {APP_NAME} is provided "as is." We do not guarantee uninterrupted
                availability. Our liability shall not exceed{" "}
                <strong>KES 5,000</strong> or the amount you paid us in the last 12 months.
              </p>
            </section>

            {/* 8 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                8. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless the Company, its employees, and
                affiliates from any claims arising from your use of the App or violation of
                these Terms.
              </p>
            </section>

            {/* 9 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                9. Governing Law & Dispute Resolution
              </h2>
              <p>
                Governed by the laws of Kenya. Disputes shall be resolved amicably, and if
                not, through arbitration in Nairobi per the <strong>Arbitration Act (1995)</strong>.
              </p>
            </section>

            {/* 10 */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                10. Contact Information
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <a
                        href="mailto:boscobrilli8@gmail.com"
                        className="hover:text-primary-600 font-medium transition-colors"
                      >
                        boscobrilli8@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <span className="font-medium">Private Box, Nairobi — Kenya</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-500">
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