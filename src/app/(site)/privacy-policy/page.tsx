export const metadata = { title: "Privacy Policy | AICT Global Bangladesh" };

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">Information Security Policy</h1>
        <p className="pt-section-subtitle">
          AICT Global&apos;s policy for information confidentiality, integrity, and availability.
        </p>

        <div className="pt-policy-content">
          <h2>Policy Statement</h2>
          <p>
            AICT Global is committed to protecting the confidentiality, integrity, and
            availability of its information assets. In doing so, we aim to ensure the trust of
            our donors, partners, staff, and beneficiaries, comply with legal and contractual
            obligations, and safeguard our operational continuity.
          </p>
          <p>Information security is the responsibility of every member of the organisation.</p>

          <h2>Purpose</h2>
          <ul>
            <li>Protecting sensitive data from unauthorized access, loss, theft, or misuse</li>
            <li>Managing information security risks across all systems and locations</li>
            <li>
              Ensuring compliance with applicable data protection laws (e.g., GDPR, UAE Data
              Protection Law, Indian IT Act)
            </li>
            <li>Promoting a culture of security awareness and responsible digital behaviour</li>
          </ul>

          <h2>Scope</h2>
          <p>
            This policy applies to all digital and physical information held, processed, or
            shared by AICT Global. This includes (but is not limited to):
          </p>
          <ul>
            <li>Emails, donor data, beneficiary records, financial documents, and project reports</li>
            <li>Laptops, mobile phones, servers, cloud accounts, hard drives, and paper files</li>
            <li>Systems hosted internally or by third-party vendors</li>
          </ul>

          <h2>Roles and Responsibilities</h2>
          <ul>
            <li><strong>Executive Director:</strong> Overall accountability for information security governance</li>
            <li><strong>IT &amp; Compliance Officer:</strong> Oversight of systems, risk assessments, and enforcement of security protocols</li>
            <li><strong>Line Managers:</strong> Ensure compliance within their teams and report incidents</li>
            <li><strong>All Staff and Partners:</strong> Follow best practices for password security, data handling, and reporting breaches</li>
            <li><strong>Third-Party Vendors:</strong> Required to sign data protection agreements and follow AICT Global security standards</li>
          </ul>

          <h2>Data Classification</h2>
          <p>AICT Global classifies data into three categories:</p>
          <ul>
            <li><strong>Confidential:</strong> Includes donor and beneficiary records, financial data, HR files, medical info</li>
            <li><strong>Internal Use Only:</strong> Includes internal memos, training materials, project planning docs</li>
            <li><strong>Public:</strong> Marketing content, brochures, approved public reports</li>
          </ul>
          <p>
            Access must be restricted based on role, and sharing of confidential data must be
            encrypted and documented.
          </p>

          <h2>Access Control</h2>
          <ul>
            <li>All systems and databases must be protected by passwords, two-factor authentication (2FA), and access logs</li>
            <li>Access is granted on a need-to-know basis and reviewed every 6 months</li>
            <li>Former employees and vendors will have accounts and access revoked immediately upon exit</li>
            <li>Use of shared passwords is strictly prohibited</li>
          </ul>

          <h2>Device and System Security</h2>
          <ul>
            <li>All work devices must have antivirus software, automatic updates, and lock screens enabled</li>
            <li>Staff must not install unauthorized apps or software</li>
            <li>USB drives and portable devices should be encrypted and approved before use</li>
            <li>Only authorised cloud storage platforms (e.g., OneDrive, Google Drive) may be used for work files</li>
          </ul>

          <h2>Email and Communication Security</h2>
          <ul>
            <li>Do not send confidential data via unsecured channels (e.g., personal email or WhatsApp)</li>
            <li>Phishing awareness training will be provided annually to all staff</li>
            <li>Verify unknown senders and never click suspicious links or attachments</li>
            <li>Use AICT Global email accounts for all official communication</li>
          </ul>

          <h2>Data Backup and Retention</h2>
          <ul>
            <li>All critical data must be backed up weekly to secure cloud or physical storage</li>
            <li>Backups should be encrypted and access-controlled</li>
            <li>
              AICT Global will retain records according to the Data Retention Policy and delete
              data when no longer needed or upon donor/beneficiary request
            </li>
          </ul>

          <h2>Breach Management and Incident Reporting</h2>
          <ul>
            <li>Any suspected or actual data breach must be reported immediately to the IT &amp; Compliance Officer</li>
            <li>A formal Incident Report Form (Annex A) must be submitted within 24 hours</li>
            <li>Breaches will be assessed, documented, and reported to affected parties or regulators as required</li>
            <li>AICT Global will take disciplinary action and remedial measures as appropriate</li>
          </ul>

          <h2>Training and Awareness</h2>
          <ul>
            <li>All new staff must undergo information security induction during onboarding</li>
            <li>Refresher sessions and awareness campaigns will be held annually</li>
            <li>Policy violations or negligent behavior will be treated as a disciplinary offense</li>
          </ul>

          <h2>Legal and Regulatory Compliance</h2>
          <p>
            AICT Global complies with relevant data protection and information security laws in
            all countries of operation, including:
          </p>
          <ul>
            <li>UAE Federal Law No. 45 of 2021 (Personal Data Protection Law)</li>
            <li>Indian Information Technology Act, 2000</li>
            <li>General Data Protection Regulation (GDPR) for EU-related data</li>
          </ul>

          <h2>Monitoring and Audit</h2>
          <ul>
            <li>Regular internal audits will be conducted to monitor compliance</li>
            <li>System access logs and data usage will be reviewed periodically</li>
            <li>Third-party service providers will be reviewed annually for security compliance</li>
          </ul>

          <h2>Policy Review</h2>
          <p>
            This policy will be reviewed annually by the IT and Compliance Team and updated based
            on technological advancements, legal changes, or incidents.
          </p>
        </div>
      </div>
    </section>
  );
}
