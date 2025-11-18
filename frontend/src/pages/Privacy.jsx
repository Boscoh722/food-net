import React from "react";
import { Shield, Mail, MapPin, User } from 'lucide-react';

// Define constants for easy updates
const APP_NAME = "Food-Net";
const COMPANY_NAME = "Food-Net";
const DPO_CONTACT = "Boscoh";
const EMAIL_ADDRESS = "boscobrilli8@gmail.com";
const PHYSICAL_ADDRESS = "Private Box, Nairobi-Kenya";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="section-container py-8">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Privacy Policy for {APP_NAME}
            </h1>
            <p className="text-gray-600">
              Protecting your data with transparency and care
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Last Updated: November 04, 2024 | Effective Date: January 1, 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-4">
              This Privacy Policy (the "Policy") outlines how{" "}
              <strong>{COMPANY_NAME}</strong> ("Company," "we," "us," or "our"),
              acting as a <strong>Data Controller</strong>, collects, uses,
              protects, and discloses your personal data when you use the{" "}
              <strong>{APP_NAME}</strong> mobile application (the "App").
            </p>

            <div className="alert alert-info mb-6">
              <p className="text-base leading-relaxed">
                This Policy complies with the <strong>Kenya Data Protection Act,
                2019</strong> ("DPA") and related regulations. By using the App, you
                consent to the practices described here.
              </p>
            </div>

            {/* --- 1. Definitions --- */}
            <section className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                1. Definitions (Under the Data Protection Act, 2019)
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Term
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
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
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                          {term}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-600">
                          {def}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* --- 2. Personal Data We Collect --- */}
            <section className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                2. Personal Data We Collect
              </h2>

              <p className="mb-4 text-gray-600">
                We collect only the data necessary for the App's functionality and
                service delivery, in line with the{" "}
                <strong>Data Minimisation Principle</strong>.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-gray-700 font-semibold">
                        Category
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-gray-700 font-semibold">
                        Data Collected
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-gray-700 font-semibold">
                        Purpose / Lawful Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-3 font-medium text-gray-700">
                        Identification Data
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        Full Name, ID/Passport, Date of Birth
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        KYC verification, fraud prevention — Legal Obligation;
                        Consent
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-3 font-medium text-gray-700">
                        Contact Data
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        Phone Number, Email, Postal Address
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        Account setup, communication — Contract; Consent
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-3 font-medium text-gray-700">
                        Location Data
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        GPS or network-based location
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        Service delivery and matching — Contract; Consent
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-3 font-medium text-gray-700">Usage Data</td>
                      <td className="border px-4 py-3 text-gray-600">
                        Device info, IP address, app activity
                      </td>
                      <td className="border px-4 py-3 text-gray-600">
                        Security, analytics, performance — Legitimate Interests
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-warning mt-4">
                <p className="text-gray-700">
                  <strong>Note:</strong> We will obtain{" "}
                  <strong>explicit consent</strong> before processing any Sensitive
                  Personal Data, such as ID or biometric details.
                </p>
              </div>
            </section>

            {/* --- 3. Lawful Basis for Processing --- */}
            <section className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                3. Lawful Basis for Processing
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Consent:</strong> Freely given and can be withdrawn at any
                  time.
                </li>
                <li>
                  <strong>Performance of a Contract:</strong> Required to deliver
                  the App's core services.
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
            </section>

            {/* --- 4. Disclosure and Sharing --- */}
            <section className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                4. Disclosure and Sharing of Data
              </h2>
              <p className="mb-4 text-gray-600">
                We do not sell or rent your personal data. Data may only be shared
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
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
            </section>

            {/* --- 5. Retention, Rights, Security, etc. --- */}
            <section className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                5–10. Retention, Rights, Security, Transfers & Updates
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You have full <strong>Data Subject Rights</strong> under the DPA,
                including access, rectification, erasure, objection, portability,
                and complaint. We maintain encryption, access control, and
                data-breach response procedures. Data may be transferred
                internationally only under safeguards approved by the{" "}
                <strong>ODPC</strong>. This policy will be updated periodically —
                please review it regularly.
              </p>
            </section>

            {/* --- Contact Info --- */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                Contact Information
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Data Controller</p>
                      <p>{COMPANY_NAME}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Data Protection Officer</p>
                      <p>{DPO_CONTACT}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {EMAIL_ADDRESS}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p>{PHYSICAL_ADDRESS}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved. |
              Committed to protecting your privacy and data rights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
