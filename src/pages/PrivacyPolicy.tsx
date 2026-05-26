import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation />
       <SEO
        title="Privacy Policy | OECL Singapore Logistics"
        description="OECL Singapore is committed to protecting your privacy. Our Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and use our services. We ensure compliance with applicable data protection laws to maintain the confidentiality and security of your personal data."
        keywords="OECL privacy policy, data protection Singapore, logistics company privacy, personal data security, OECL data collection, privacy compliance, business data protection, logistics service provider privacy policy"
        url="https://www.oecl.sg/privacy-policy"
      />
      
      <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
        <div className="prose prose-lg max-w-none text-black">
          <h1 className="text-4xl font-bold mb-8 text-black">Privacy Policy</h1>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Introduction</h2>
          <p className="mb-6 text-black">
            Welcome to OECL (Singapore) Pte Ltd ["OECL (Singapore)", "we", "our", "us"]. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          
          <p className="mb-6 text-black">
            We urge you to carefully read the following to comprehend how we collect, utilize, and safeguard your personal information. The policy also outlines your options concerning the use, accessibility, and correction of your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Our Commitment to Privacy:</h2>
          
          <p className="mb-4 text-black">
            <strong>Limited Data Collection:</strong> At OECL (Singapore), we adhere to strict privacy principles by collecting only the essential information necessary for efficient communication. This streamlined approach simplifies user interactions and minimizes the exposure of personal details. Our commitment to minimal data collection reflects our dedication to user privacy and ensures robust security measures.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Voluntary Disclosure:</strong> Users at OECL (Singapore) have full control over the information they choose to share. Our policy emphasizes voluntary data submission, empowering users to determine the extent of their engagement. We respect individual privacy preferences, acknowledging that each user may have distinct comfort levels regarding information disclosure.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Purposeful Communication:</strong> The information we collect serves a specific and essential purpose—facilitating effective communication. Whether responding to inquiries, providing relevant updates, or maintaining ongoing connections, user data is used exclusively for communication-related activities. This targeted approach ensures that personal information remains dedicated to its intended use, reinforcing our commitment to transparent and purpose-driven data management.
          </p>
          
          <p className="mb-6 text-black">
            <strong>User Empowerment:</strong> At OECL (Singapore), we prioritize user control over their personal information. Beyond allowing users to choose what information to share, we empower them to manage their privacy settings and preferences. This approach enables individuals to tailor their interactions with OECL (Singapore) according to their preferences, fostering trust and transparency in digital interactions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">What Constitutes Personal Information?</h2>
          
          <p className="mb-4 text-black">
            <strong>Personal Information:</strong> At OECL (Singapore), "Personal Information" refers to any data related to an identified or identifiable natural person. This includes details that can directly or indirectly identify an individual, such as their name, address, contact information (telephone number, mobile number, email address), identification numbers, location data, online identifiers, and specific characteristics related to their physical, physiological, genetic, mental, economic, cultural, or social identity. Additionally, this encompasses any information collected through our services, such as user preferences and behavioural data, that can be linked to an individual.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Other Information:</strong> In contrast, "Other Information" encompasses data that does not fall within the scope of Personal Information. This includes anonymized or aggregated data that cannot be used to identify an individual and publicly available information that has not been combined with Personal Information. Examples of Other Information include statistical data on website usage, product performance metrics, and general market trends, which are used to improve our services without compromising individual privacy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">What Data Do We Gather and When?</h2>
          
          <p className="mb-4 text-black">
            At OECL (Singapore), we prioritize minimal data collection to optimize user interactions and facilitate effective communication. The information we collect includes:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Name:</strong> Users can voluntarily provide their names when they contact us through our website's contact form or other communication channels. This helps us personalize interactions, address individuals by their preferred titles, and enhance the quality of communication for a more customized user experience.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Email Address:</strong> Users provide their email addresses when they contact us or subscribe to our services. We use email addresses to establish efficient communication, allowing us to respond to inquiries promptly, provide updates, and share relevant information about our services. This also facilitates the delivery of subscription-related details.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Phone Number:</strong> Users have the option to provide their phone numbers to enable direct communication or to receive service-related updates via SMS or voice calls. This allows us to enhance customer support and provide timely assistance. Phone numbers are kept confidential and are only used for communication purposes related to our services.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Location:</strong> Users may provide location information, such as their address or geographic location, when interacting with our services. This information helps us offer location-specific services, tailor our offerings, and improve the user experience by providing relevant updates and support based on the user's geographic location.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">User Choice and Control</h2>
          
          <p className="mb-4 text-black">
            <strong>Opt-In Engagement:</strong> At OECL (Singapore), we emphasize user consent through active opt-in processes, where users provide their names and email addresses. This ensures that all interactions with us are consensual and align with user preferences.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Communication Preferences:</strong> Users at OECL (Singapore) have complete control over their communication preferences. They can manage the frequency and type of messages they receive, allowing them to tailor their interactions according to their needs and preferences.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Data Collection Practices:</strong> OECL (Singapore) is committed to respecting user privacy while enabling effective communication. We implement strict security measures to protect the limited information we collect, ensuring a secure and positive user experience.
          </p>

          <p className="mb-4 text-black">
            <strong>Other Information Collection:</strong> When using our services, OECL (Singapore) collects various types of Other Information about user activities and usage patterns, including:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Logs:</strong> We track user interactions within our services, capturing details such as visited pages, features used, activity timestamps, URLs of previous and subsequent websites visited, device attributes, browser type and version, and approximate geographic location derived from IP addresses. This information, when combined with Personal Information, is treated confidentially and helps us enhance the user experience.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Cookies:</strong> OECL (Singapore) uses cookies to identify users' login status and recognize repeat visitors. These cookies are essential for improving service quality. We utilize session cookies (which expire when the browser is closed) and persistent cookies (which remain until deleted). Users can manage or disable cookies through their browser settings, although this may affect certain service functionalities.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Web Beacons:</strong> In our services and emails, we may employ web beacons (clear gifs or pixel tags) to track user engagement, such as email open rates, and to deliver personalized content. These electronic files help us understand user behavior and optimize service delivery.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Local Storage:</strong> OECL (Singapore) may store information locally on user devices, including Personal Information, using mechanisms like browser web storage and application data caches. This enhances the user experience by storing preferences and settings locally.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">How We Utilize the Collected Information:</h2>
          
          <p className="mb-4 text-black">
            At OECL (Singapore), we are committed to ensuring that the information we collect is used responsibly and transparently. The collected information is utilized in the following ways:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Personalizing User Experience:</strong> We use the information to personalize interactions and tailor our services to meet individual user preferences. This includes addressing users by their names and providing customized content and recommendations based on their interests and past interactions.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Enhancing Communication:</strong> User contact information, such as email addresses and phone numbers, is used to establish efficient communication channels. This allows us to respond promptly to inquiries, provide updates on our services, and deliver relevant information that users have opted to receive.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Improving Our Services:</strong> Data collected about user activities, preferences, and usage patterns helps us analyse and improve the functionality and performance of our services. This includes understanding which features are most popular, identifying areas for improvement, and developing new features that enhance the user experience.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Facilitating Transactions:</strong> Information related to user location, preferences, and contact details is used to process orders and transactions efficiently. This ensures that products and services are delivered accurately and in a timely manner.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Ensuring Security:</strong> We use collected data to monitor and enhance the security of our website and services. This includes detecting and preventing fraudulent activities, unauthorized access, and other security issues.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Marketing and Promotions:</strong> With user consent, we may use contact information to send promotional materials, newsletters, and marketing communications about our products and services. Users can manage their communication preferences and opt out of receiving such communications at any time.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Compliance with Legal Obligations:</strong> In certain circumstances, we may be required to use or disclose user information to comply with legal obligations, such as responding to lawful requests by public authorities or complying with applicable laws and regulations.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Aggregated Data Analysis:</strong> We may use anonymized and aggregated data for internal analysis, research, and reporting purposes. This helps us understand trends, measure the effectiveness of our services, and make informed business decisions without identifying individual users.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">How We Share Information with Third Parties:</h2>
          
          <p className="mb-4 text-black">
            At OECL (Singapore), we are committed to maintaining the privacy and security of our users' information. We only share information with third parties under specific circumstances and with strict guidelines to ensure user privacy is protected. Below are the ways in which we may share information with third parties:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Service Providers:</strong> We may share your information with trusted third-party service providers who perform functions on our behalf. These services include:
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li>Payment Processing: Managing transactions and payment-related activities.</li>
            <li>Shipping and Delivery: Facilitating the shipment and delivery of products.</li>
            <li>Marketing Services: Conducting marketing campaigns and communications.</li>
            <li>Customer Support: Providing customer service and support.</li>
            <li>IT and Security Services: Ensuring the security and maintenance of our systems.</li>
          </ul>
          
          <p className="mb-4 text-black">
            These providers are contractually obligated to use the information only for the purpose of providing services to OECL (Singapore) and are required to maintain the confidentiality and security of your information.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Business Partners:</strong> We may share information with our business partners to offer co-branded products, services, or promotions. These partners are required to adhere to privacy and data protection standards that are at least as stringent as our own.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Legal Compliance:</strong> We may disclose your information to third parties if we believe such action is necessary to:
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li>Comply with applicable laws, regulations, legal processes, or governmental requests.</li>
            <li>Enforce our Terms of Use or other agreements and policies.</li>
            <li>Protect the rights, property, or safety of OECL (Singapore), our users, or others. This includes exchanging information with other companies and organizations for fraud protection and credit risk reduction.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Corporate Transactions:</strong> In the event of a merger, acquisition, reorganization, sale of assets, or bankruptcy, your information may be transferred as part of the transaction. We will ensure the acquiring entity follows this Privacy Policy or provides notice of any material changes.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Consent:</strong> We may share your information with third parties when you provide your explicit consent. This includes situations where you agree to share your information with a third-party application or service.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Aggregated and Anonymized Data:</strong> We may share aggregated and anonymized data that cannot be used to identify you with third parties for research, analytics, and other purposes. This helps us understand usage patterns, improve our services, and contribute to industry knowledge without compromising your privacy.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Social media and Online Platforms:</strong> If you interact with us on social media or other online platforms, information you share may be viewable by other users of these platforms and may be shared according to their privacy policies.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Third-Party Advertising:</strong> We may share information with third-party advertising partners to deliver targeted advertisements. These partners may use cookies, web beacons, and similar technologies to collect information about your activities on our website and other websites to provide you with personalized advertising. You can manage your advertising preferences through your browser settings or other available tools.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Research and Development:</strong> We may share information with research institutions or other entities for the purpose of research and development, provided that such sharing is done in a manner that protects your privacy and data security.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">What Steps Do We Take to Protect Your Information?</h2>
          
          <p className="mb-4 text-black">
            At OECL (Singapore), the security and confidentiality of your information are our highest priorities. We implement comprehensive measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. Here are the steps we take to safeguard your information:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Data Encryption:</strong> We use advanced encryption technologies to protect your data during transmission and storage. This ensures that your information is secure and confidential both when it is being sent to our servers and when it is stored on our systems.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Secure Access Controls:</strong> We implement strict access controls to ensure that only authorized personnel have access to your personal information. This includes using multi-factor authentication, role-based access controls, and regular access reviews to prevent unauthorized access.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Regular Security Audits:</strong> We conduct regular security audits and assessments to identify and address potential vulnerabilities in our systems. These audits are performed by internal and external experts to ensure the highest level of security standards.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Firewall and Intrusion Detection Systems:</strong> Our systems are protected by robust firewall and intrusion detection systems that monitor and block unauthorized access attempts. These systems are continually updated to respond to new threats.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Data Anonymization and Minimization:</strong> Where possible, we anonymize or pseudonymize personal data to reduce the risk of exposure. We also follow the principle of data minimization, collecting only the information necessary for specific purposes.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Regular Software Updates:</strong> We ensure that all our software and systems are up-to-date with the latest security patches and updates. This helps protect against known vulnerabilities and emerging threats.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Employee Training and Awareness:</strong> Our employees receive regular training on data protection and privacy best practices. This includes training on recognizing phishing attempts, securing sensitive information, and responding to potential data breaches.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Physical Security Measures:</strong> We implement physical security measures to protect our data centers and offices, including access controls, surveillance, and secure storage for sensitive documents.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Incident Response Plan:</strong> We have a comprehensive incident response plan in place to quickly address and mitigate any data breaches or security incidents. This plan includes procedures for identifying, containing, and resolving incidents, as well as notifying affected users and relevant authorities as required by law.
          </p>
          
          <p className="mb-4 text-black">
            <strong>Vendor and Partner Security:</strong> We carefully vet and select third-party vendors and partners to ensure they meet our stringent security standards. We require them to implement appropriate security measures to protect any information we share with them.
          </p>
          
          <p className="mb-4 text-black">
            <strong>User Controls and Preferences:</strong> We provide users with tools to manage their privacy settings and control how their information is used and shared. This includes options to opt-out of certain data collection practices and communications.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Continuous Monitoring and Improvement:</strong> We continuously monitor our security practices and implement improvements as needed to adapt to evolving threats and best practices in data protection.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">What Choices Do You Have Regarding the Use of Your Information?</h2>
          
          <p className="mb-4 text-black">
            <strong>Managing Communication Preferences:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Opt-In/Opt-Out:</strong> You have the choice to opt-in or opt-out of receiving communications from us. You can manage your preferences through your account settings or by following the instructions provided in our communications.</li>
            <li><strong>Email Subscriptions:</strong> You can subscribe or unsubscribe from our marketing emails, newsletters, and other promotional communications at any time. Each email we send includes an unsubscribe link for your convenience.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Accessing and Updating Your Information:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Account Information:</strong> You can access, review, and update your account information, such as your name, email address, and contact details, by logging into your account on our website.</li>
            <li><strong>Correction Requests:</strong> If you believe any information we hold about you is inaccurate or incomplete, you have the right to request corrections. Please contact our support team to make such requests.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Data Portability:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Exporting Data:</strong> You have the right to request a copy of your personal data in a structured, commonly used, and machine-readable format. This allows you to transfer your data to another service provider if you choose.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Deleting Your Information:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Account Deletion:</strong> You can request the deletion of your account and associated personal information. Please note that certain information may be retained for legal or legitimate business purposes.</li>
            <li><strong>Service-Specific Deletions:</strong> For specific services or features, you may have the option to delete individual pieces of information without affecting your entire account.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Cookie Preferences:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Managing Cookies:</strong> You can manage your cookie preferences through your browser settings. This includes accepting, rejecting, or deleting cookies. Please note that disabling cookies may affect the functionality of our services.</li>
            <li><strong>Opting Out of Tracking:</strong> Some browsers and third-party services offer tools to disable tracking technologies. You can use these tools to control how your information is collected and used.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Interest-Based Advertising:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Ad Preferences:</strong> You can manage your preferences for interest-based advertising through your account settings or by using the opt-out mechanisms provided by advertising networks. This includes adjusting your preferences for targeted ads.</li>
            <li><strong>Do Not Track:</strong> Some browsers offer a "Do Not Track" feature that lets you signal to websites that you do not want your online activities tracked. While we honour such signals, not all tracking technologies may be fully controlled by this feature.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Third-Party Data Sharing:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Consent-Based Sharing:</strong> We will only share your information with third parties for purposes other than those outlined in our policy with your explicit consent. You have the right to withdraw this consent at any time.</li>
            <li><strong>Review and Consent:</strong> For any new or significant changes to our data sharing practices, we will provide you with notice and obtain your consent as required.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Restricting Processing:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Processing Requests:</strong> You have the right to request that we restrict the processing of your personal data under certain circumstances, such as when you contest the accuracy of the data or object to its processing.</li>
            <li><strong>Right to Object:</strong> You can object to the processing of your personal data for direct marketing purposes or other uses based on legitimate interests. We will comply with your request unless there are compelling legitimate grounds for the processing.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Withdrawal of Consent:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Changing Your Mind:</strong> If you have previously given consent for any specific use of your personal data, you can withdraw that consent at any time. This will not affect the lawfulness of processing based on consent before its withdrawal.</li>
          </ul>
          
          <p className="mb-4 text-black">
            <strong>Exercising Your Rights:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 text-black">
            <li><strong>Contacting Us:</strong> To exercise any of your rights, please contact our privacy team using the contact details provided in this policy. We will respond to your requests within the timeframes required by applicable law.</li>
            <li><strong>Verification:</strong> For security reasons, we may need to verify your identity before processing your requests. This helps us protect your information from unauthorized access.</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
