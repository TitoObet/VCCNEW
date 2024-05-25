import React from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>Terms and Conditions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <br></br>
      <div className="terms-background"> {/* Add this div */}
        <div className="terms-page-container">
          <h1>Terms and Conditions</h1>
          <p>
            These Terms and Conditions ("Terms") govern your use of the Valenzuela Commuting Companion (VCC) application ("the App") provided by the Valenzuela City Transportation Office ("VCTO"). By accessing or using the App, you agree to be bound by these Terms. If you do not agree with these Terms, please refrain from using the App.
          </p>
          <div className="terms-section">
            <h2>1. License and Use of the App:</h2>
            <p>
              <strong>1.1. License:</strong> Subject to these Terms, VCTO grants you a limited, non-exclusive, non-transferable, and revocable license to use the App for your personal and non-commercial purposes.
            </p>
            <p>
              <strong>1.2. Use Restrictions:</strong> You agree not to:
              <ul>
                <li>Modify, adapt, translate, reverse engineer, or decompile any part of the App.</li>
                <li>Use the App in any unlawful manner or for any illegal purpose.</li>
                <li>Attempt to gain unauthorized access to the App or its related systems or networks.</li>
              </ul>
            </p>
          </div>
          <div className="terms-section">
            <h2>2. Privacy Policy:</h2>
            <p>
              <strong>2.1. Data Collection:</strong> Your use of the App is subject to our Privacy Policy, which outlines how we collect, use, disclose, and protect your personal data. By using the App, you consent to the collection and use of your personal data in accordance with our Privacy Policy.
            </p>
          </div>
          <div className="terms-section">
            <h2>3. Intellectual Property Rights:</h2>
            <p>
              <strong>3.1. Ownership:</strong> The App, including all content, features, and functionality, is owned by VCTO and protected by copyright, trademark, and other intellectual property laws. You agree not to remove, alter, or obscure any copyright, trademark, or other proprietary notices contained in the App.
            </p>
          </div>
          <div className="terms-section">
            <h2>4. Disclaimer of Warranties:</h2>
            <p>
              <strong>4.1. As-Is Basis:</strong> The App is provided on an "as-is" and "as available" basis, without any warranties or representations of any kind, whether express or implied. VCTO makes no guarantees regarding the accuracy, completeness, reliability, or suitability of the App for any purpose.
            </p>
          </div>
          <div className="terms-section">
            <h2>5. Limitation of Liability:</h2>
            <p>
              <strong>5.1. Exclusion of Damages:</strong> In no event shall VCTO be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App, even if advised of the possibility of such damages.
            </p>
          </div>
          <div className="terms-section">
            <h2>6. Indemnification:</h2>
            <p>
              <strong>6.1. Defense and Settlement:</strong> You agree to defend, indemnify, and hold harmless VCTO and its officers, directors, employees, and agents from and against any and all claims, damages, liabilities, costs, and expenses arising out of or related to your use of the App or any violation of these Terms.
            </p>
          </div>
          <div className="terms-section">
            <h2>7. Governing Law and Dispute Resolution:</h2>
            <p>
              <strong>7.1. Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law principles.
            </p>
            <p>
              <strong>7.2. Dispute Resolution:</strong> Any dispute arising out of or in connection with these Terms shall be resolved through negotiation in good faith. If the dispute cannot be resolved through negotiation, it shall be submitted to the exclusive jurisdiction of the courts of Valenzuela City.
            </p>
          </div>
          <div className="terms-section">
            <h2>8. Changes to Terms:</h2>
            <p>
              <strong>8.1. Modification:</strong> VCTO reserves the right to modify or update these Terms at any time without prior notice. Any changes to these Terms will be effective immediately upon posting on the App. Your continued use of the App after the posting of any changes constitutes your acceptance of the modified Terms.
            </p>
          </div>
          <div className="terms-section">
            <h2>9. Contact Us:</h2>
            <p>If you have any questions, concerns, or feedback regarding these Terms or the App, please contact us at vctooffice_complaints@gmail.com or call the telephone hotline 83522-000 local 2002.</p>
          </div>
          <p>Last updated: April 10, 2024</p>
          <div className="signature-section">
            <p>[Signature/Name of Authorized Representative]</p>
            <p>[Signature/Name of VCTO Office Head]</p>
          </div>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TermsPage;
