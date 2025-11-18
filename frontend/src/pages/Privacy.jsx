import React from "react";

// Define constants for easy updates
const APP_NAME = "Food-Net";
const COMPANY_NAME = "[Food-Net]";
const DPO_CONTACT = "Boscoh";
const EMAIL_ADDRESS = "boscobrilli8@gmail.com";
const PHYSICAL_ADDRESS = "Private Box, Nairobi-Kenya";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-4">
          Privacy Policy for {APP_NAME}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Last Updated: November 04, 2025 | Effective Date: January 1, 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed mb-4">
            This Privacy Policy (the “Policy”) outlines how{" "}
            <strong>{COMPANY_NAME}</strong> (“Company,” “we,” “us,” or “our”),
            acting as a <strong>Data Controller</strong>, collects, uses,
            protects, and discloses your personal data when you use the{" "}
            <strong>{APP_NAME}</strong> mobile application (the “App”).
          </p>

          <p className="text-base leading-relaxed mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600">
            This Policy complies with the <strong>Kenya Data Protection Act,
            2019</strong> (“DPA”) and related regulations. By using the App, you
            consent to the practices described here.
          </p>

          {/* --- 1. Definitions --- */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
            1. Definitions (Under the Data Protection Act, 2019)
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold">
                    Term
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold">
                    Definition
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Personal Data", "Any information relating to an identified or identifiable natural person (the Data Subject)."],
                  ["Data Subject", "An individual who is the subject of personal data — you, the user."],
                  ["Data Controller", <>A person or entity who determines the purpose and means of processing personal data (this is <strong>{COMPANY_NAME}</strong>).</>],
                  ["Processing", "Any operation performed on personal data, whether automated or manual (e.g., collection, storage, use, disclosure, or deletion)."],
                  ["Sensitive Personal Data", "Data revealing race, health, beliefs, biometric or genetic data, property, marital status, or sexual orientation."]
                ].map(([term, def], i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium">
                      {term}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                      {def}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- 2. Personal Data We Collect --- */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
            2. Personal Data We Collect
          </h2>

          <p className="mb-4">
            We collect only the data necessary for the App’s functionality and
            service delivery, in line with the{" "}
            <strong>Data Minimisation Principle</strong>.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                    Category
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                    Data Collected
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                    Purpose / Lawful Basis
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border px-4 py-3 font-medium">
                    Identification Data
                  </td>
                  <td className="border px-4 py-3">
                    Full Name, ID/Passport, Date of Birth
                  </td>
                  <td className="border px-4 py-3">
                    KYC verification, fraud prevention — Legal Obligation;
                    Consent
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border px-4 py-3 font-medium">
                    Contact Data
                  </td>
                  <td className="border px-4 py-3">
                    Phone Number, Email, Postal Address
                  </td>
                  <td className="border px-4 py-3">
                    Account setup, communication — Contract; Consent
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border px-4 py-3 font-medium">
                    Location Data
                  </td>
                  <td className="border px-4 py-3">
                    GPS or network-based location
                  </td>
                  <td className="border px-4 py-3">
                    Service delivery and matching — Contract; Consent
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border px-4 py-3 font-medium">Usage Data</td>
                  <td className="border px-4 py-3">
                    Device info, IP address, app activity
                  </td>
                  <td className="border px-4 py-3">
                    Security, analytics, performance — Legitimate Interests
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600">
            <strong>Note:</strong> We will obtain{" "}
            <strong>explicit consent</strong> before processing any Sensitive
            Personal Data, such as ID or biometric details.
          </p>

          {/* --- 3. Lawful Basis for Processing --- */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
            3. Lawful Basis for Processing
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              <strong>Consent:</strong> Freely given and can be withdrawn at any
              time.
            </li>
            <li>
              <strong>Performance of a Contract:</strong> Required to deliver
              the App’s core services.
            </li>
            <li>
              <strong>Legal Obligation:</strong> Compliance with mandatory
              requirements, e.g., KYC.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Enhancing security and
              preventing fraud.
            </li>
          </ul>

          {/* --- 4. Disclosure and Sharing --- */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
            4. Disclosure and Sharing of Data
          </h2>
          <p className="mb-4">
            We do not sell or rent your personal data. Data may only be shared
            with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              <strong>Service Providers:</strong> Cloud, payment, and analytics
              providers — bound by confidentiality.
            </li>
            <li>
              <strong>Legal Authorities:</strong> As required by law or court
              order.
            </li>
            <li>
              <strong>Business Transfers:</strong> During mergers or
              acquisitions under strict data protection terms.
            </li>
            <li>
              <strong>Other Users:</strong> Limited public-facing data only (e.g.,
              name, approximate location).
            </li>
          </ul>

          {/* --- 5. Retention, Rights, Security, etc. --- */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
            5–10. Retention, Rights, Security, Transfers & Updates
          </h2>
          <p className="mb-6 leading-relaxed">
            You have full <strong>Data Subject Rights</strong> under the DPA,
            including access, rectification, erasure, objection, portability,
            and complaint. We maintain encryption, access control, and
            data-breach response procedures. Data may be transferred
            internationally only under safeguards approved by the{" "}
            <strong>ODPC</strong>. This policy will be updated periodically —
            please review it regularly.
          </p>

          {/* --- Contact Info --- */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
            <p className="mb-2">
              <strong>Data Controller:</strong> {COMPANY_NAME}
            </p>
            <p className="mb-2">
              <strong>Data Protection Officer (DPO):</strong> {DPO_CONTACT}
            </p>
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="text-primary hover:underline"
              >
                {EMAIL_ADDRESS}
              </a>
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {PHYSICAL_ADDRESS}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
