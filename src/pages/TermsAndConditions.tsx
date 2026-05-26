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

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation />
      <SEO
        title="Terms and Conditions | OECL Singapore Logistics"
        description="Review OECL Singapore's Terms and Conditions to understand the legal framework governing the use of our logistics services, including warehousing, freight forwarding, customs clearance, and more. Ensure compliance and clarity in our business engagements."
        keywords="OECL terms and conditions, logistics service agreement, Singapore logistics terms, freight forwarding terms, warehousing service terms, customs clearance agreement, B2B logistics contract"
        url="https://www.oecl.sg/terms-and-conditions"
      />
      
      <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
        <div className="prose prose-lg max-w-none text-black">
          <h1 className="text-4xl font-bold mb-8 text-black">Terms and Conditions</h1>
          <p className="text-sm text-gray-600 mb-8">Home/Terms and Conditions</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">TERMS OF USE AGREEMENT FOR THE WEBSITE</h2>
          
          <p className="mb-6 text-black">
            <strong>Last updated:</strong> ____________
          </p>
          
          <p className="mb-6 text-black">
            Welcome to the OECL (Singapore) Pte Ltd. website (hereinafter referred to as the 'Website'). Please review these terms of use carefully before engaging with the Website. Your access and utilization of the Website are governed by these terms of use (hereinafter referred to as the 'Terms of Use'). By accessing or using the Website, you agree to be legally bound by these Terms of Use, representing both yourself and the entity you are authorized to act on behalf of (hereinafter referred to as 'you' or 'your'). If you do not accept all the Terms of Use, refrain from accessing or utilizing the Website.
          </p>
          
          <p className="mb-6 text-black">
            <strong>User Eligibility:</strong> OECL (Singapore) provides the Website exclusively to entities and individuals who have reached the legal age of majority and have the legal capacity to enter into binding agreements under the applicable law in Singapore. If you do not meet these criteria, you are not authorized to use the Website.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Scope of Terms of Use:</strong> These Terms of Use govern your use of the Website and all related applications, software, and services, collectively referred to as "Services," except where a separate agreement applies. Specific terms or agreements, known as "Service Agreements," may apply to certain Services or items provided through the Website. These Service Agreements will either accompany the relevant Services or be accessible via an associated hyperlink.
          </p>
          
          <p className="mb-6 text-black">
            <strong>Modifications:</strong> OECL (Singapore) reserves the right to modify these Terms of Use at any time. Your continued use of the Website after any changes signifies your acceptance of such modifications. OECL (Singapore) may alter, supplement, delete, or update any aspect of the Website without notice and may adjust or introduce fees for products and services at its sole discretion. General practices and restrictions regarding other OECL (Singapore) products and services may also be established or modified at any time, based on OECL (Singapore)'s sole discretion.
          </p>
          
          <p className="mb-6 text-black">
            <strong>OECL (Singapore) Privacy Notice:</strong> By providing any individual's personal information to OECL (Singapore), you affirm that you have obtained all necessary consents for the processing of such personal information as required by the Services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">License and Ownership:</h2>
          
          <p className="mb-6 text-black">
            All intellectual property rights ("Intellectual Property") related to the Website and its contents (the "Content") are the exclusive property of OECL (Singapore), its affiliates, or third parties, and are protected by intellectual property laws in Singapore and globally. Various elements of the Website are also protected by trade name, trade secret, unfair competition, and other laws, prohibiting any copying or imitation. All custom graphics, icons, and other items on the Website, referred to as trademarks, service marks, or trade names ("Marks"), are the property of OECL (Singapore), its affiliates, or entities granting OECL (Singapore) the right to use these Marks. Unauthorized use or interference with these Marks is strictly prohibited without express written consent from OECL (Singapore). Unless expressly authorized by these Terms of Use, you may not copy, reproduce, modify, lease, loan, sell, create derivative works from, upload, transmit, or distribute OECL (Singapore)'s Intellectual Property without prior written permission from OECL (Singapore) or the appropriate third party.
          </p>
          
          <p className="mb-6 text-black">
            OECL (Singapore) grants you a limited, personal, non-transferable, non-sublicensable, and revocable license to access and use the Website, Content, and Services ("OECL (Singapore) Systems") as presented by OECL (Singapore) and only as expressly permitted. Apart from this limited license, OECL (Singapore) does not transfer any interest in the OECL (Singapore) Systems, information or data available via the OECL (Singapore) Systems (the "Information"), Content, Services, Website, or any other OECL (Singapore) property by allowing access to the Website. Except where required by law or as expressly provided herein, none of the Content or Information may be reverse-engineered, modified, reproduced, republished, translated, retransmitted, resold, or redistributed without prior written consent from OECL (Singapore). Unauthorized actions such as making, selling, offering for sale, modifying, reproducing, displaying, publicly performing, importing, distributing, retransmitting, or otherwise using the Content are strictly prohibited unless expressly permitted by OECL (Singapore).
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Restrictions on Website Use:</h2>
          
          <p className="mb-4 text-black">
            In addition to the limitations outlined in these Terms of Use, you agree to the following:
          </p>
          
          <ul className="list-disc ml-6 mb-6 text-black">
            <li>You must not conceal the origin of information transmitted through the Website.</li>
            <li>You shall refrain from placing false or misleading information on the Website.</li>
            <li>Usage or access of any service, information, application, or software available via the Website is restricted to methods expressly permitted by OECL (Singapore).</li>
            <li>Uploading information to the Website containing viruses, Trojan horses, worms, time bombs, or other computer programming routines intended to damage, interfere with, intercept, or expropriate any system, the Website, or Information, or that infringes on the Intellectual Property rights of others, is strictly prohibited.</li>
            <li>Specific sections of the Website are exclusive to OECL (Singapore) customers.</li>
            <li>Using or accessing the Website, OECL (Singapore) Systems, or Services in a manner that, in OECL (Singapore)'s judgment, adversely affects performance or function, or interferes with authorized parties' access to the OECL (Singapore) Systems, Services, or the Website, is not allowed.</li>
            <li>Framing or employing framing techniques to enclose any portion or aspect of the Content or Information without the express written consent of OECL (Singapore) is prohibited.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Outbound Links:</h2>
          
          <p className="mb-6 text-black">
            The Website may contain links to third-party websites and resources ("Linked Sites"). These links are provided for your convenience and do not signify OECL (Singapore)'s endorsement of their content. OECL (Singapore) does not guarantee the accuracy, reliability, performance, or quality of any content, software, service, or application found on Linked Sites. OECL (Singapore) is not responsible for the availability of Linked Sites or their content and activities. Access to Linked Sites is at your own risk and is governed by the terms, conditions, and privacy policies of those sites.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Inbound Links:</h2>
          
          <p className="mb-4 text-black">
            Linking to any page of the Website other than the homepage through a plain text link is strictly prohibited without a separate linkage agreement with OECL (Singapore). Websites or other entities linking to the homepage or any of its pages are prohibited from:
          </p>
          
          <ul className="list-disc ml-6 mb-6 text-black">
            <li>Duplicating Content.</li>
            <li>Using a frame or border around the Content.</li>
            <li>Implying endorsement by OECL (Singapore) or its affiliates.</li>
            <li>Misrepresenting any facts about the relationship with OECL (Singapore) or its affiliates.</li>
            <li>Providing false information about OECL (Singapore) products or services.</li>
            <li>Using any logo or mark of OECL (Singapore) or its affiliates without express written permission from OECL (Singapore).</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Termination:</h2>
          
          <p className="mb-4 text-black">
            OECL (Singapore) reserves the right to terminate or suspend your use of the Website, OECL (Singapore) Systems, Information, Services, and Content at its sole discretion, without prior notice or reason. Even if access remains available to others, OECL (Singapore) may suspend or terminate your access at any time. Upon termination or suspension, you must:
          </p>
          
          <ul className="list-disc ml-6 mb-4 text-black">
            <li>Immediately cease using the Website.</li>
            <li>Destroy any copies of the Content you have made.</li>
          </ul>
          
          <p className="mb-6 text-black">
            Continuing to access the Website, OECL (Singapore) Systems, Information, or Services after termination, suspension, or discontinuation will be considered trespassing. OECL (Singapore) is not liable to you or any third party for terminating or suspending your access to the Website, OECL (Singapore) Systems, Information, and/or Services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Disclaimer of Warranties:</h2>
          
          <p className="mb-6 text-black">
            OECL (Singapore) makes no guarantees regarding the results you may achieve by using the Website, OECL (Singapore) Systems, Services, Information, or Content. You use these elements at your own risk, and they are provided "as is." To the fullest extent permitted by law, OECL (Singapore), along with its licensors and suppliers, disclaims all warranties, whether express, implied, statutory, or otherwise. This includes, but is not limited to, warranties of merchantability, non-infringement, and fitness for a particular purpose. OECL (Singapore) and its affiliates, licensors, and suppliers do not guarantee the accuracy, completeness, security, or timeliness of the Content, Information, or Services provided on the Website or OECL (Singapore) Systems. No information obtained from the Website creates any warranty that is not expressly stated in these Terms of Use.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Limitation of Liability:</h2>
          
          <p className="mb-6 text-black">
            To the extent permitted by law, OECL (Singapore), its affiliates, licensors, suppliers, or any third parties mentioned on the Website are not liable for any incidental, direct, indirect, exemplary, punitive, and/or consequential damages, lost profits, or damages resulting from lost data or business interruption caused by the use or inability to use the Website, OECL (Singapore) Systems, Information, Services, or Content. This limitation applies regardless of the legal theory on which the claim is based, whether warranty, contract, tort, delict, or any other, and even if OECL (Singapore) has been advised of the possibility of such damages. To the extent allowed by law, the remedies provided to you in these Terms of Use are exclusive and limited to those expressly stated herein.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Compliance with Laws, Including Export Control:</h2>
          
          <p className="mb-6 text-black">
            You agree to use the OECL (Singapore) Website in full compliance with all applicable laws, regulations, and rules. Your actions should not, as determined solely by OECL (Singapore), harm OECL (Singapore)'s goodwill or reputation. Additionally, you must not engage in any activities that could cause OECL (Singapore) to violate any relevant laws, rules, or regulations applicable to OECL (Singapore).
          </p>
          
          <p className="mb-6 text-black">
            OECL (Singapore) operates from Singapore and manages the export of products and information. You agree to comply with all applicable restrictions and refrain from exporting or re-exporting any Content (including software or Services) to countries or individuals prohibited under Singapore or other relevant export control laws or regulations. By accessing and downloading any Content (including software or Services) or Information, you confirm that you are not located in a country where such export is prohibited and are not a person or entity to whom such export is restricted. You are solely responsible for complying with the laws of your local jurisdiction and any other applicable laws concerning the import, export, or re-export of the Content (including software or Services).
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Governing Law and Jurisdiction:</h2>
          
          <p className="mb-6 text-black">
            To the maximum extent permitted by law, these Terms of Use are governed by the internal laws of Singapore, and the courts in Singapore shall have sole and exclusive jurisdiction over any disputes arising from or related to these Terms of Use.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">General:</h2>
          
          <p className="mb-6 text-black">
            You may not transfer these Terms of Use or any of your rights, interests, or obligations under these Terms of Use. If any provision of these Terms of Use is found invalid by a court of competent jurisdiction, the invalidity of that provision shall not affect the validity of the remaining provisions, which shall remain in full force and effect. No waiver of any of these Terms of Use shall be considered a continuing waiver of that term or condition or any other term or condition. You may retain a written copy of these Terms of Use by printing them for your records, waiving any other requirement for these Terms of Use to be evidenced by a written document.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Contact Us</h2>
          
          <p className="mb-4 text-black">
            If you have any questions, concerns, or feedback regarding our services, you can reach out to us through the following contact options:
          </p>
          
          <p className="mb-4 text-black">
            <strong>Email:</strong>
          </p>
          
          <p className="mb-4 text-black">
            <strong>Mailing Address:</strong>
          </p>
          
          <p className="mb-6 text-black">
            <strong>Customer Support:</strong> For assistance, please visit our website: https://www.oecl.sg/home.php or contact our customer support team at ____________.
          </p>
          
          <p className="mb-6 text-black">
            We strive to respond to all inquiries promptly and provide you with the assistance you need. Thank you for choosing OECL (Singapore).
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
