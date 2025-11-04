import React from 'react';

// Define constants for easy updates
const APP_NAME = "Food-Net";
const COMPANY_NAME = "[Your Company Name Here]"; //
const DPO_CONTACT = "Boscoh";
const EMAIL_ADDRESS = "boscobrilli8@gmail.com";
const PHYSICAL_ADDRESS = "Private Box, Nairobi-Kenya";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-4">Privacy Policy for {APP_NAME}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last Updated: November 04, 2025 | Effective Date: 1st January 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed mb-4">This Privacy Policy (the "Policy") outlines how {APP_NAME} (the "Company," "we," "us," or "our"), acting as a <strong>Data Controller</strong>, collects, uses, protects, and discloses your personal data when you use the mobile application ({APP_NAME} App) (the "App").</p>

          <p className="text-base leading-relaxed mb-6">
            This Policy is governed by and complies with the Data Protection Act, 2019 of Kenya (the "DPA") and its attendant Regulations. By using the App, you consent to the data practices described in this Policy.
          </p>

        {/* --- 1. Definitions --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">1. Definitions (As per the Kenya Data Protection Act, 2019)</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Term</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Personal Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Any information relating to an identified or identifiable natural person (the Data Subject).</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Data Subject</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">An individual who is the subject of personal data. (This is you, the user).</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Data Controller</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">A person or entity who determines the purpose and means of processing personal data. (This is <strong>{COMPANY_NAME}</strong>).</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Processing</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Any operation performed on personal data, whether or not by automated means (e.g., collection, recording, use, storage, disclosure, erasure).</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Sensitive Personal Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Data revealing a person's race, health status, ethnic social origin, conscience, belief, genetic data, biometric data, property details, marital status, family details, sex, or sexual orientation.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- 2. Personal Data We Collect --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">2. Personal Data We Collect</h2>
        <p className="mb-4">We only collect personal data that is adequate, relevant, and limited to what is necessary for the explicit, specified, and legitimate purposes outlined below (<strong>Data Minimisation Principle</strong>).</p>
        <p className="mb-4">We collect the following types of data directly from you:</p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Category of Data</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Specific Data Collected</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Purpose of Collection (Lawful Basis)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Identification Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Full Name, National ID/Passport Number (or other unique ID), Date of Birth.</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Verification and Compliance: To verify your identity, prevent fraud, and comply with Know Your Customer (KYC) legal obligations. (Lawful Basis: Legal Obligation; Explicit Consent)</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Contact Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Phone Number, Email Address, Postal Address.</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Communication and Service Delivery: To register your account, communicate service updates, and deliver services defined in our Terms of Service. (Lawful Basis: Performance of a Contract; Consent)</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Location Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Precise or approximate location derived from your device's GPS or network information.</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Core Service Functionality: To provide location-based services (e.g., matching you with nearby users/services, or improving local feature accuracy). (Lawful Basis: Explicit Consent; Performance of a Contract)</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">Usage Data</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">IP address, device type, operating system, and activity within the App (pages visited, features used).</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">App Improvement and Security: To diagnose technical issues, monitor security, and improve App performance and user experience. (Lawful Basis: Legitimate Interests)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
          <strong>Note on Sensitive Personal Data:</strong> By collecting National ID/Passport numbers, we may be processing Sensitive Personal Data. We will obtain your <strong>explicit and informed consent</strong> before collecting and processing this data, clearly explaining the necessity.
        </p>

        {/* --- 3. Lawful Basis for Processing --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">3. Lawful Basis for Processing</h2>
        <p className="mb-4">We process your personal data only when we have a lawful basis to do so, as prescribed by the DPA. These bases include:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Consent:</strong> You have given clear, free, specific, and informed consent for us to process your personal data for a specific purpose (e.g., using location data). You have the right to <strong>withdraw this consent</strong> at any time.</li>
            <li><strong>Performance of a Contract:</strong> The processing is necessary for the performance of a contract to which you are a party (e.g., providing the core services of the App after registration).</li>
            <li><strong>Legal Obligation:</strong> The processing is necessary for compliance with a mandatory legal obligation to which the Company is subject (e.g., KYC requirements, reporting to authorities).</li>
            <li><strong>Legitimate Interests:</strong> The processing is necessary for the purposes of the legitimate interests pursued by the Company or a third party, except where such interests are overridden by your interests or fundamental rights (e.g., improving security, fraud prevention).</li>
        </ul>

        {/* --- 4. Disclosure and Sharing of Personal Data --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">4. Disclosure and Sharing of Personal Data</h2>
        <p className="mb-4">We will not sell or rent your personal data to third parties. We will only share your data with the following recipients and for the following purposes:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Service Providers:</strong> We engage third-party companies (e.g., cloud hosting providers, payment processors, analytics providers) to facilitate our services. These partners are Data Processors who are obligated to protect your data under the DPA and can only process data under our instructions.</li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority (e.g., Office of the Data Protection Commissioner - ODPC) to disclose your data.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your personal data may be transferred, subject to appropriate confidentiality agreements.</li>
            <li><strong>Other Users:</strong> Only the necessary data required for the core function of the App will be visible to other users (e.g., your name and approximate location, if a public-facing service).</li>
        </ul>

        {/* --- 5. Data Retention --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">5. Data Retention (Storage Limitation Principle)</h2>
        <p className="mb-4">We retain your personal data only for as long as is necessary to fulfill the purposes outlined in this Privacy Policy, including for the purposes of satisfying any legal, regulatory, or reporting requirements.</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>General Data:</strong> Retained while your account is active and for a period of <strong>[Specify period, e.g., 12 months]</strong> thereafter to resolve disputes or comply with legal obligations, unless a longer retention period is required or permitted by law.</li>
            <li><strong>Location Data:</strong> Typically retained for <strong>[Specify short period, e.g., 90 days]</strong> for service provision and then aggregated or pseudonymised.</li>
        </ul>
        <p className="mb-6">Upon expiry of the retention period, we will securely destroy or permanently anonymise your personal data in accordance with the DPA.</p>

        {/* --- 6. Your Data Subject Rights --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">6. Your Data Subject Rights</h2>
        <p className="mb-4">Under the DPA, you have the following rights regarding your personal data. To exercise any of these rights, please contact us at <strong>{EMAIL_ADDRESS}</strong>.</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Right to be Informed (Access):</strong> The right to be informed of the use to which your personal data is put.</li>
            <li><strong>Right of Access:</strong> The right to request and obtain confirmation as to whether your personal data is being processed, and access to that data.</li>
            <li><strong>Right to Object:</strong> The right to object to the processing of all or part of your personal data.</li>
            <li><strong>Right to Rectification (Correction):</strong> The right to request the correction of inaccurate or misleading personal data.</li>
            <li><strong>Right to Erasure (Right to be Forgotten):</strong> The right to request the destruction or deletion of false or misleading personal data. Note: We may be legally obliged to keep certain records.</li>
            <li><strong>Right to Data Portability:</strong> The right to receive your personal data in a structured, commonly used, and machine-readable format and transmit it to another Data Controller without hindrance.</li>
            <li><strong>Right to Complain:</strong> The right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) if you believe your rights under the DPA have been violated.</li>
        </ul>

        {/* --- 7. Data Security and Confidentiality --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">7. Data Security and Confidentiality</h2>
        <p className="mb-4">We are committed to protecting your personal data. We implement appropriate technical and organisational safeguards to prevent unauthorised access, loss, destruction, or alteration of your personal data (<strong>Integrity and Confidentiality Principle</strong>).</p>
        <p className="mb-2">Security measures include:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Data encryption during transmission and at rest.</li>
            <li>Access control measures (e.g., multi-factor authentication) for systems holding personal data.</li>
            <li>Regular security audits and employee training on data protection best practices.</li>
        </ul>
        <p className="mb-6">In the event of a data breach, we will notify the ODPC and affected data subjects within 72 hours of becoming aware of the breach, as required by the DPA.</p>

        {/* --- 8. International Data Transfers --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">8. International Data Transfers</h2>
        <p className="mb-4">If we transfer your personal data outside of Kenya, we will ensure that appropriate safeguards are in place, as required by Section 48 of the DPA. This may include:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Obtaining your explicit consent for the transfer.</li>
            <li>Ensuring the recipient country has an adequate level of data protection as determined by the ODPC.</li>
            <li>Implementing binding corporate rules or standard contractual clauses.</li>
        </ul>

        {/* --- 9. Contact Information --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">9. Contact Information</h2>
        <p className="mb-4">If you have questions about this Privacy Policy or our data processing practices, or wish to exercise your data subject rights, please contact us:</p>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <p className="mb-2"><strong>Data Controller:</strong> {APP_NAME}</p>
          <p className="mb-2"><strong>Data Protection Contact (or DPO):</strong> {DPO_CONTACT}</p>
          <p className="mb-2"><strong>Email Address:</strong> <a href={`mailto:${EMAIL_ADDRESS}`} className="text-primary hover:underline">{EMAIL_ADDRESS}</a></p>
          <p className="mb-2"><strong>Physical Address:</strong> {PHYSICAL_ADDRESS}</p>
        </div>

        {/* --- 10. Updates to This Policy --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">10. Updates to This Policy</h2>
        <p className="mb-6">We reserve the right to update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. We will notify you of any material changes by posting the new Policy on this page and updating the "Last Updated" date. We encourage you to review this Policy periodically.</p>
        </div>
      </div>
    </div>
  );
}
