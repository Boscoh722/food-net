import React from 'react';

// Define constants for easy updates
const APP_NAME = "Food-Net";
const COMPANY_NAME = "[Food-Net]"; // 

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-4">Terms and Conditions of Use for {APP_NAME}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last Updated: November 04, 2025</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed mb-4">These Terms and Conditions of Use ("Terms") constitute a legally binding agreement between <strong>{COMPANY_NAME}</strong> ("Company," "we," "us," or "our"), and you, concerning your access to and use of the mobile application {APP_NAME} (the "App").</p>

          <p className="text-base leading-relaxed mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 font-semibold">By accessing or using the App, you acknowledge that you have read, understood, and agree to be bound by all of these Terms, and our <strong>Privacy Policy</strong>. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, YOU ARE EXPRESSLY PROHIBITED FROM USING THE APP AND MUST DISCONTINUE USE IMMEDIATELY.</p>

        {/* --- 1. Acceptance and Agreement --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">1. Acceptance and Agreement</h2>
        <p className="mb-2">1.1. <strong>Contractual Relationship:</strong> These Terms govern the contractual relationship between the Company and the user (Data Subject) of the App.</p>
        <p className="mb-6">1.2. <strong>Privacy Policy:</strong> These Terms incorporate by reference our Privacy Policy, which sets out how we handle your personal data (including ID, contact, and location data) in compliance with the Kenya Data Protection Act, 2019 (DPA). Your agreement to these Terms constitutes your agreement to the Privacy Policy.</p>

        {/* --- 2. Eligibility and User Representation --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">2. Eligibility and User Representation</h2>
        <p className="mb-2">2.1. <strong>Minimum Age:</strong> You must be at least eighteen (18) years of age to use or register for the App. By using the App, you represent and warrant that you are at least 18 years old.</p>
        <p className="mb-2">2.2. <strong>Capacity:</strong> You confirm that you have the legal capacity and authority to enter into these Terms and to abide by them.</p>
        <p className="mb-6">2.3. <strong>Kenyan Jurisdiction:</strong> These Terms are specifically drafted for users subject to the laws of the Republic of Kenya.</p>

        {/* --- 3. App Services and User Accounts --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">3. App Services and User Accounts</h2>
        <p className="mb-2">3.1. <strong>Account Registration:</strong> You may be required to register an account with a username and password. You agree to keep your password confidential and will be responsible for all use of your account and password.</p>
        <p className="mb-2">3.2. <strong>Accuracy of Information:</strong> You agree to provide accurate, current, and complete information during registration, including your contact details and, where required, your Kenyan National ID or Passport details, for the purposes of identity verification (KYC).</p>
        <p className="mb-6">3.3. <strong>Service Description:</strong> The App provides a platform for connecting consumers with local producers of agricultural products and facilitates transportation through accredited transporters.</p>

        {/* --- 4. Prohibited Conduct --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">4. Prohibited Conduct</h2>
        <p className="mb-4">You agree not to use the App for any unlawful purpose or any purpose prohibited by these Terms. Specifically, you agree not to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Violate any applicable Kenyan laws or regulations.</li>
          <li>Engage in any criminal activity, including but not limited to fraud, money laundering, or cybercrime.</li>
          <li>Use the App to send unsolicited messages, spam, or abusive content to other users.</li>
          <li>Interfere with or disrupt the integrity or performance of the App or the data contained therein.</li>
          <li>Collect or harvest any personal data of other users without their express consent, except as permitted by the App's functionality.</li>
        </ul>

        {/* --- 5. Intellectual Property Rights --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">5. Intellectual Property Rights</h2>
        <p className="mb-2">5.1. <strong>Ownership:</strong> All intellectual property rights in the App (including all code, designs, and content) are owned by <strong>{COMPANY_NAME}</strong> or its licensors.</p>
        <p className="mb-2">5.2. <strong>License:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to use the App solely for your personal, non-commercial use, subject to these Terms.</p>
        <p className="mb-6">5.3. <strong>User Content:</strong> If you submit content to the App, you grant us a worldwide, royalty-free license to use that content to provide, improve, and promote the App's services. You warrant that you have the right to grant this license.</p>

        {/* --- 6. Data Protection and User Rights --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">6. Data Protection and User Rights</h2>
        <p className="mb-2">6.1. <strong>DPA Compliance:</strong> We adhere strictly to the principles of the Kenya Data Protection Act, 2019 (DPA).</p>
        <p className="mb-2">6.2. <strong>Consent:</strong> By using the App, you confirm that you have given explicit consent for the collection and processing of your Identification, Contact, and Location Data for the specified purposes outlined in the Privacy Policy.</p>
        <p className="mb-6">6.3. <strong>Exercising Rights:</strong> You acknowledge your rights as a Data Subject under the DPA, including the right to access, rectification, erasure, and to object to processing. Details on how to exercise these rights are provided in the Privacy Policy.</p>

        {/* --- 7. Disclaimers and Limitation of Liability --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">7. Disclaimers and Limitation of Liability</h2>
        <p className="mb-4">7.1. <strong>Disclaimer:</strong> The App is provided on an "as-is" and "as-available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the App or the information, content, or materials included therein.</p>
        <p className="mb-4">7.2. <strong>Limitation of Liability:</strong> To the fullest extent permitted by the Laws of Kenya (including the Constitution, Article 46 on Consumer Rights), the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>(a) your access to or use of or inability to access or use the App;</li>
          <li>(b) any conduct or content of any third party on the App; or</li>
          <li>(c) unauthorized access, use, or alteration of your transmissions or content.</li>
        </ul>
        <p className="mb-6">7.3. <strong>Maximum Liability:</strong> Our maximum cumulative liability to you for any losses or damages arising out of or in connection with these Terms or your use of the App will not exceed the greater of (i) KES 5,000 (Five Thousand Kenya Shillings) or (ii) the amount you paid us (if any) in the twelve (12) months preceding the date of the claim.</p>

        {/* --- 8. Indemnification --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">8. Indemnification</h2>
        <p className="mb-6">You agree to indemnify, defend, and hold harmless the Company, its directors, employees, and agents from any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the App; (b) your breach of these Terms; or (c) your violation of any law or the rights of a third party.</p>

        {/* --- 9. Governing Law and Dispute Resolution --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">9. Governing Law and Dispute Resolution</h2>
        <p className="mb-2">9.1. <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the Laws of the Republic of Kenya.</p>
        <p className="mb-2">9.2. <strong>Amicable Settlement:</strong> The parties agree to attempt to resolve any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof through good faith negotiation.</p>
        <p className="mb-2">9.3. <strong>Arbitration:</strong> If the dispute cannot be resolved through negotiation within thirty (30) days, the dispute shall be referred to arbitration in Nairobi, Kenya, in accordance with the Arbitration Act 1995 (Revised Edition 2022). The arbitration shall be conducted by a single arbitrator appointed by agreement between the parties, or failing agreement, by the Chairman for the time being of the Chartered Institute of Arbitrators (Kenya Branch). The language of the arbitration shall be English.</p>
        <p className="mb-6">9.4. <strong>Jurisdiction:</strong> For any claims not subject to arbitration, the parties hereby submit to the exclusive jurisdiction of the Courts of Kenya.</p>

        {/* --- 10. Contact Information --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">10. Contact Information</h2>
        <p className="mb-4">For any questions regarding these Terms, please contact us at:</p>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <p className="mb-2"><strong>Email Address:</strong> <a href="mailto:boscobrilli8@gmail.com" className="text-primary hover:underline">boscobrilli8@gmail.com</a></p>
          <p className="mb-2"><strong>Physical Address:</strong> Private Box, Nairobi-Kenya</p>
        </div>
        </div>
      </div>
    </div>
  );
}
