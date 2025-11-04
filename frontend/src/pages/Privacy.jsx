import React from 'react';

// Define constants for easy updates
const APP_NAME = "Food-Net";
const COMPANY_NAME = "[Your Company Name Here]"; //
const DPO_CONTACT = "Boscoh";
const EMAIL_ADDRESS = "boscobrilli8@gmail.com";
const PHYSICAL_ADDRESS = "Private Box, Nairobi-Kenya";

export default function Privacy() {
  return (
    <div>
      <h1>Privacy Policy for {APP_NAME}</h1>
      <p>Last Updated: November 04, 2025 | Effective Date: 1st January 2026</p>

      <div>
        <p>This Privacy Policy (the "Policy") outlines how {APP_NAME} (the "Company," "we," "us," or "our"), acting as a **Data Controller**, collects, uses, protects, and discloses your personal data when you use the mobile application ({APP_NAME} App) (the "App").</p>

        <p>
          This Policy is governed by and complies with the Data Protection Act, 2019 of Kenya (the "DPA")** and its attendant Regulations. By using the App, you consent to the data practices described in this Policy.
        </p>

        {/* --- 1. Definitions --- */}
        <h2>1. Definitions (As per the Kenya Data Protection Act, 2019)</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Personal Data</td>
                <td>Any information relating to an identified or identifiable natural person (the Data Subject).</td>
              </tr>
              <tr>
                <td>Data Subject</td>
                <td>An individual who is the subject of personal data. (This is you, the user).</td>
              </tr>
              <tr>
                <td>Data Controller</td>
                <td>A person or entity who determines the purpose and means of processing personal data. (This is **{COMPANY_NAME}**).</td>
              </tr>
              <tr>
                <td>Processing</td>
                <td>Any operation performed on personal data, whether or not by automated means (e.g., collection, recording, use, storage, disclosure, erasure).</td>
              </tr>
              <tr>
                <td>Sensitive Personal Data</td>
                <td>Data revealing a person's race, health status, ethnic social origin, conscience, belief, genetic data, biometric data, property details, marital status, family details, sex, or sexual orientation.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- 2. Personal Data We Collect --- */}
        <h2>2. Personal Data We Collect</h2>
        <p>We only collect personal data that is adequate, relevant, and limited to what is necessary for the explicit, specified, and legitimate purposes outlined below (**Data Minimisation Principle**).</p>
        <p>We collect the following types of data directly from you:</p>

        <div>
          <table>
            <thead>
              <tr>
                <th>Category of Data</th>
                <th>Specific Data Collected</th>
                <th>Purpose of Collection (Lawful Basis)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identification Data</td>
                <td>Full Name, National ID/Passport Number (or other unique ID), Date of Birth.</td>
                <td>Verification and Compliance: To verify your identity, prevent fraud, and comply with Know Your Customer (KYC) legal obligations. (Lawful Basis: Legal Obligation; Explicit Consent)</td>
              </tr>
              <tr>
                <td>Contact Data</td>
                <td>Phone Number, Email Address, Postal Address.</td>
                <td>Communication and Service Delivery: To register your account, communicate service updates, and deliver services defined in our Terms of Service. (Lawful Basis: Performance of a Contract; Consent)</td>
              </tr>
              <tr>
                <td>Location Data</td>
                <td>Precise or approximate location derived from your device's GPS or network information.</td>
                <td>Core Service Functionality: To provide location-based services (e.g., matching you with nearby users/services, or improving local feature accuracy). (Lawful Basis: Explicit Consent; Performance of a Contract)</td>
              </tr>
              <tr>
                <td>Usage Data</td>
                <td>IP address, device type, operating system, and activity within the App (pages visited, features used).</td>
                <td>App Improvement and Security: To diagnose technical issues, monitor security, and improve App performance and user experience. (Lawful Basis: Legitimate Interests)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          **Note on Sensitive Personal Data:** By collecting National ID/Passport numbers, we may be processing Sensitive Personal Data. We will obtain your **explicit and informed consent** before collecting and processing this data, clearly explaining the necessity.
        </p>

        {/* --- 3. Lawful Basis for Processing --- */}
        <h2>3. Lawful Basis for Processing</h2>
        <p>We process your personal data only when we have a lawful basis to do so, as prescribed by the DPA. These bases include:</p>
        <ul>
            <li>**Consent:** You have given clear, free, specific, and informed consent for us to process your personal data for a specific purpose (e.g., using location data). You have the right to **withdraw this consent** at any time.</li>
            <li>**Performance of a Contract:** The processing is necessary for the performance of a contract to which you are a party (e.g., providing the core services of the App after registration).</li>
            <li>**Legal Obligation:** The processing is necessary for compliance with a mandatory legal obligation to which the Company is subject (e.g., KYC requirements, reporting to authorities).</li>
            <li>**Legitimate Interests:** The processing is necessary for the purposes of the legitimate interests pursued by the Company or a third party, except where such interests are overridden by your interests or fundamental rights (e.g., improving security, fraud prevention).</li>
        </ul>

        {/* --- 4. Disclosure and Sharing of Personal Data --- */}
        <h2>4. Disclosure and Sharing of Personal Data</h2>
        <p>We will not sell or rent your personal data to third parties. We will only share your data with the following recipients and for the following purposes:</p>
        <ul>
            <li>Service Providers: We engage third-party companies (e.g., cloud hosting providers, payment processors, analytics providers) to facilitate our services. These partners are Data Processors who are obligated to protect your data under the DPA and can only process data under our instructions.</li>
            <li>Legal Requirements: If required by law, court order, or government authority (e.g., Office of the Data Protection Commissioner - ODPC) to disclose your data.</li>
            <li>Business Transfers: In connection with a merger, acquisition, or sale of assets, your personal data may be transferred, subject to appropriate confidentiality agreements.</li>
            <li>Other Users: Only the necessary data required for the core function of the App will be visible to other users (e.g., your name and approximate location, if a public-facing service).</li>
        </ul>

        {/* --- 5. Data Retention --- */}
        <h2>5. Data Retention (Storage Limitation Principle)</h2>
        <p>We retain your personal data only for as long as is necessary to fulfill the purposes outlined in this Privacy Policy, including for the purposes of satisfying any legal, regulatory, or reporting requirements.</p>
        <ul>
            <li>General Data: Retained while your account is active and for a period of **[Specify period, e.g., 12 months]** thereafter to resolve disputes or comply with legal obligations, unless a longer retention period is required or permitted by law.</li>
            <li>Location Data: Typically retained for **[Specify short period, e.g., 90 days]** for service provision and then aggregated or pseudonymised.</li>
        </ul>
        <p>Upon expiry of the retention period, we will securely destroy or permanently anonymise your personal data in accordance with the DPA.</p>

        {/* --- 6. Your Data Subject Rights --- */}
        <h2>6. Your Data Subject Rights</h2>
        <p>Under the DPA, you have the following rights regarding your personal data. To exercise any of these rights, please contact us at **{EMAIL_ADDRESS}**.</p>
        <ul>
            <li>Right to be Informed (Access): The right to be informed of the use to which your personal data is put.</li>
            <li>Right of Access: The right to request and obtain confirmation as to whether your personal data is being processed, and access to that data.</li>
            <li>Right to Object: The right to object to the processing of all or part of your personal data.</li>
            <li>Right to Rectification (Correction): The right to request the correction of inaccurate or misleading personal data.</li>
            <li>Right to Erasure (Right to be Forgotten): The right to request the destruction or deletion of false or misleading personal data. Note: We may be legally obliged to keep certain records.</li>
            <li>Right to Data Portability: The right to receive your personal data in a structured, commonly used, and machine-readable format and transmit it to another Data Controller without hindrance.</li>
            <li>Right to Complain: The right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) if you believe your rights under the DPA have been violated.</li>
        </ul>

        {/* --- 7. Data Security and Confidentiality --- */}
        <h2>7. Data Security and Confidentiality</h2>
        <p>We are committed to protecting your personal data. We implement appropriate technical and organisational safeguards to prevent unauthorised access, loss, destruction, or alteration of your personal data (**Integrity and Confidentiality Principle**).</p>
        <p>Security measures include:</p>
        <ul>
            <li>Data encryption during transmission and at rest.</li>
            <li>Access control measures (e.g., multi-factor authentication) for systems holding personal data.</li>
            <li>Regular security audits and employee training on data protection best practices.</li>
        </ul>
        <p>In the event of a data breach, we will notify the ODPC and affected data subjects within 72 hours of becoming aware of the breach, as required by the DPA.</p>

        {/* --- 8. International Data Transfers --- */}
        <h2>8. International Data Transfers</h2>
        <p>If we transfer your personal data outside of Kenya, we will ensure that appropriate safeguards are in place, as required by Section 48 of the DPA. This may include:</p>
        <ul>
            <li>Obtaining your explicit consent for the transfer.</li>
            <li>Ensuring the recipient country has an adequate level of data protection as determined by the ODPC.</li>
            <li>Implementing binding corporate rules or standard contractual clauses.</li>
        </ul>

        {/* --- 9. Contact Information --- */}
        <h2>9. Contact Information</h2>
        <p>If you have questions about this Privacy Policy or our data processing practices, or wish to exercise your data subject rights, please contact us:</p>
        <div>
          <p><strong>Data Controller:</strong> {APP_NAME}</p>
          <p><strong>Data Protection Contact (or DPO):</strong> {DPO_CONTACT}</p>
          <p><strong>Email Address:</strong> {EMAIL_ADDRESS}</p>
          <p><strong>Physical Address:</strong> {PHYSICAL_ADDRESS}</p>
        </div>

        {/* --- 10. Updates to This Policy --- */}
        <h2>10. Updates to This Policy</h2>
        <p>We reserve the right to update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. We will notify you of any material changes by posting the new Policy on this page and updating the "Last Updated" date. We encourage you to review this Policy periodically.</p>
      </div>
    </div>
  );
}
