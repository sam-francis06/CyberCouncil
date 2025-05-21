// Initialize Lucide icons
lucide.createIcons();

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');
const homeIcon = document.querySelector('.home-icon');
const mobileDropdown = document.querySelector('.mobile-dropdown');

mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    // Close dropdown if open when sidebar is toggled
    mobileDropdown.classList.remove('active');
});

// Home icon dropdown functionality
homeIcon.addEventListener('click', () => {
    mobileDropdown.classList.toggle('active');
    // Close sidebar if open when dropdown is toggled
    sidebar.classList.remove('active');
    
    // Add a subtle bounce animation to the home icon
    homeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        homeIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            homeIcon.style.transform = '';
        }, 150);
    }, 150);
});






// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-right') && !event.target.closest('.mobile-menu-button')) {
        navRight.classList.remove('active');
    }
});

// Navigation active state
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Expanded Indian cyber law data
const lawData = {
    sections: [
    {
        id: "3",
        title: "Section 3 - Authentication of Electronic Records",
        type: "regulatory",
        description: "Provides for authentication of electronic records using digital signatures.",
        penalty: "Not specified",
        keyElements: [
            "Digital signature",
            "Electronic records",
            "Authentication"
        ],
        fullText: "Any subscriber may authenticate an electronic record by affixing his digital signature. The authentication of the electronic record shall be effected by the use of asymmetric crypto system and hash function which envelop and transform the initial electronic record into another electronic record.",
        indianContext: "Forms the basis for secure e-governance and e-commerce transactions in India."
    },
    {
        id: "3A",
        title: "Section 3A - Electronic Signature",
        type: "regulatory",
        description: "Recognizes electronic signatures as a secure authentication method.",
        penalty: "Not specified",
        keyElements: [
            "Electronic signature",
            "Security",
            "Authentication"
        ],
        fullText: "A subscriber may authenticate any electronic record by such electronic signature or electronic authentication technique which is considered reliable and may be specified in the Second Schedule.",
        indianContext: "Supports digital transactions and secure communications in India."
    },
    {
        id: "43",
        title: "Section 43 - Penalty and Compensation for Damage to Computer",
        type: "civil",
        description: "Compensation for unauthorized access, data damage, or system disruption.",
        penalty: "Compensation for damages to the affected person.",
        keyElements: [
            "Unauthorized access",
            "Data damage",
            "System disruption",
            "Compensation"
        ],
        fullText: "If any person without permission of the owner or any other person who is incharge of a computer, computer system or computer network, (a) accesses or secures access to such computer, computer system or computer network; (b) downloads, copies or extracts any data, computer data base or information from such computer, computer system or computer network including information or data held or stored in any removable storage medium; (c) introduces or causes to be introduced any computer contaminant or computer virus into any computer, computer system or computer network; (d) damages or causes to be damaged any computer, computer system or computer network, data, computer data base or any other programmes residing in such computer, computer system or computer network; (e) disrupts or causes disruption of any computer, computer system or computer network; (f) denies or causes the denial of access to any person authorised to access any computer, computer system or computer network by any means; (g) provides any assistance to any person to facilitate access to a computer, computer system or computer network in contravention of the provisions of this Act, rules or regulations made thereunder, he shall be liable to pay damages by way of compensation to the person so affected.",
        indianContext: "Used in civil cases for data breaches and corporate hacking incidents."
    },
    {
        id: "43A",
        title: "Section 43A - Compensation for Failure to Protect Data",
        type: "civil",
        description: "Negligence in implementing security practices for sensitive personal data.",
        penalty: "Compensation to the affected person.",
        keyElements: [
            "Data protection",
            "Negligence",
            "Compensation"
        ],
        fullText: "Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.",
        indianContext: "Relevant for IT firms and BPOs, as seen in Poona Auto Ancillaries v. PNB (2018)."
    },
    {
        id: "65",
        title: "Section 65 - Tampering with Computer Source Documents",
        type: "criminal",
        description: "Concealing, destroying, or altering source code required by law.",
        penalty: "Up to 3 years imprisonment or fine up to \u20b92 lakh, or both.",
        keyElements: [
            "Source code protection",
            "Concealment",
            "Alteration"
        ],
        fullText: "Whoever knowingly or intentionally conceals, destroys or alters or intentionally or knowingly causes another to conceal, destroy, or alter any computer source code used for a computer, computer programme, computer system or computer network, when the computer source code is required to be kept or maintained by law for the time being in force, shall be punishable with imprisonment up to three years, or with fine which may extend to two lakh rupees, or with both.",
        indianContext: "Applied in software piracy and IP theft cases."
    },
    {
        id: "66",
        title: "Section 66 - Computer-Related Offences",
        type: "criminal",
        description: "Dishonest or fraudulent acts under Section 43, including hacking.",
        penalty: "Up to 3 years imprisonment or fine up to \u20b95 lakh, or both.",
        keyElements: [
            "Unauthorized access",
            "Data manipulation",
            "Fraudulent intent"
        ],
        fullText: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
        indianContext: "Used for hacking government and banking systems."
    },
    {
        id: "66A",
        title: "Section 66A - Offensive Messages",
        type: "criminal",
        description: "Struck down in 2015 for violating freedom of speech.\n- **Status**: Unconstitutional",
        penalty: "Not specified",
        keyElements: [
            "Offensive content",
            "Freedom of speech"
        ],
        fullText: "(Historical) Any person who sends, by means of a computer resource or a communication device, any information that is grossly offensive or has menacing character; or any information which he knows to be false, but for the purpose of causing annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred or ill will, persistently by making use of such computer resource or a communication device; or any electronic mail or electronic mail message for the purpose of causing annoyance or inconvenience or to deceive or to mislead the addressee or recipient about the origin of such messages, shall be punishable with imprisonment for a term which may extend to three years and with fine.",
        indianContext: "Struck down in Shreya Singhal v. Union of India (2015)."
    },
    {
        id: "66B",
        title: "Section 66B - Dishonestly Receiving Stolen Computer Resource",
        type: "criminal",
        description: "Receiving or retaining stolen computer resources.",
        penalty: "Up to 3 years imprisonment or fine up to \u20b91 lakh, or both.",
        keyElements: [
            "Stolen resource",
            "Dishonest receipt",
            "Retention"
        ],
        fullText: "Whoever dishonestly receives or retains any stolen computer resource or communication device knowing or having reason to believe the same to be stolen computer resource or communication device, shall be punished with imprisonment of either description for a term which may extend to three years or with fine which may extend to rupees one lakh or with both.",
        indianContext: "Used in cases involving stolen data or devices."
    },
    {
        id: "66C",
        title: "Section 66C - Identity Theft",
        type: "criminal",
        description: "Fraudulent use of electronic signatures or passwords.",
        penalty: "Up to 3 years imprisonment and fine up to \u20b91 lakh.",
        keyElements: [
            "Identity theft",
            "Electronic signature",
            "Password misuse"
        ],
        fullText: "Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh.",
        indianContext: "Relevant for Aadhaar and banking frauds."
    },
    {
        id: "66D",
        title: "Section 66D - Cheating by Personation",
        type: "criminal",
        description: "Cheating by personation using computer resources.",
        penalty: "Up to 3 years imprisonment and fine up to \u20b91 lakh.",
        keyElements: [
            "Personation",
            "Cheating",
            "Digital fraud"
        ],
        fullText: "Whoever, by means of any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
        indianContext: "Common in phishing and fake social media profiles."
    },
    {
        id: "66E",
        title: "Section 66E - Violation of Privacy",
        type: "criminal",
        description: "Unauthorized capture or sharing of private images.",
        penalty: "Up to 3 years imprisonment or fine up to \u20b92 lakh, or both.",
        keyElements: [
            "Privacy violation",
            "Image capture",
            "Unauthorized transmission"
        ],
        fullText: "Whoever, intentionally or knowingly captures, publishes or transmits the image of a private area of any person without his or her consent, under circumstances violating the privacy of that person, shall be punished with imprisonment which may extend to three years or with fine not exceeding two lakh rupees, or with both.",
        indianContext: "Used in revenge porn and privacy breach cases."
    },
    {
        id: "66F",
        title: "Section 66F - Cyber Terrorism",
        type: "criminal",
        description: "Cyber acts threatening India\u2019s unity or security.",
        penalty: "Imprisonment up to life.",
        keyElements: [
            "National security",
            "Critical infrastructure",
            "Terrorism"
        ],
        fullText: "Whoever, with intent to threaten the unity, integrity, security or sovereignty of India or to strike terror in the people or any section of the people by denying or cause the denial of access to any person authorized to access computer resource; or attempting to penetrate or access a computer resource without authorisation or exceeding authorized access; or introducing or causing to introduce any computer contaminant, and by means of such conduct causes or is likely to cause death or injuries to persons or damage to or destruction of property or disrupts or knowing that it is likely to cause damage or disruption of supplies or services essential to the life of the community or adversely affect the critical information infrastructure, shall be punishable with imprisonment which may extend to imprisonment for life.",
        indianContext: "Addresses threats to critical infrastructure like defense systems."
    },
    {
        id: "67",
        title: "Section 67 - Publishing Obscene Material",
        type: "criminal",
        description: "Publishing or transmitting obscene material electronically.",
        penalty: "First conviction: Up to 3 years and fine up to \u20b95 lakh; Subsequent: Up to 5 years and \u20b910 lakh.",
        keyElements: [
            "Obscene content",
            "Electronic publication",
            "Transmission"
        ],
        fullText: "Whoever publishes or transmits or causes to be published or transmitted in the electronic form, any material which is lascivious or appeals to the prurient interest or if its effect is such as to tend to deprave and corrupt persons who are likely, having regard to all relevant circumstances, to read, see or hear the matter contained or embodied in it, shall be punished on first conviction with imprisonment of either description for a term which may extend to three years and with fine which may extend to five lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to five years and also with fine which may extend to ten lakh rupees.",
        indianContext: "Applied to obscene content on social media."
    },
    {
        id: "67A",
        title: "Section 67A - Publishing Sexually Explicit Material",
        type: "criminal",
        description: "Publishing or transmitting sexually explicit material.",
        penalty: "First conviction: Up to 5 years and fine up to \u20b910 lakh; Subsequent: Up to 7 years and \u20b910 lakh.",
        keyElements: [
            "Sexually explicit content",
            "Electronic transmission",
            "Publication"
        ],
        fullText: "Whoever publishes or transmits or causes to be published or transmitted in the electronic form any material which contains sexually explicit act or conduct shall be punished on first conviction with imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to seven years and also with fine which may extend to ten lakh rupees.",
        indianContext: "Used for explicit content distribution online."
    },
    {
        id: "67B",
        title: "Section 67B - Publishing Child Sexual Abuse Material",
        type: "criminal",
        description: "Publishing or transmitting material depicting children in sexually explicit acts.",
        penalty: "First conviction: Up to 5 years and fine up to \u20b910 lakh; Subsequent: Up to 7 years and \u20b910 lakh.",
        keyElements: [
            "Child sexual abuse material",
            "Electronic transmission",
            "Publication"
        ],
        fullText: "Whoever, (a) publishes or transmits or causes to be published or transmitted material in any electronic form which depicts children engaged in sexually explicit act or conduct; or (b) creates text or digital images, collects, seeks, browses, downloads, advertises, promotes, exchanges or distributes material in any electronic form depicting children in obscene or indecent or sexually explicit manner; or (c) cultivates, entices or induces children to online relationship with one or more children for and on sexually explicit act or in a manner that may offend a reasonable adult on the computer resource; or (d) facilitates abusing children online; or (e) records in any electronic form own abuse or that of others pertaining to sexually explicit act with children, shall be punished on first conviction with imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to seven years and also with fine which may extend to ten lakh rupees.",
        indianContext: "Critical for combating child sexual abuse material."
    },
    {
        id: "69",
        title: "Section 69 - Interception, Monitoring, or Decryption",
        type: "criminal",
        description: "Government powers to intercept or monitor information.",
        penalty: "Not specified",
        keyElements: [
            "National security",
            "Public order",
            "Investigation"
        ],
        fullText: "Where the Central Government or a State Government or any of its officers specially authorised by the Central Government or the State Government, as the case may be, in this behalf may, if satisfied that it is necessary or expedient so to do, in the interest of the sovereignty or integrity of India, defence of India, security of the State, friendly relations with foreign States or public order or for preventing incitement to the commission of any cognizable offence relating to above or for investigation of any offence, it may subject to the provisions of sub-section (2), for reasons to be recorded in writing, by order, direct any agency of the appropriate Government to intercept, monitor or decrypt or cause to be intercepted or monitored or decrypted any information generated, transmitted, received or stored in any computer resource.",
        indianContext: "Basis for lawful interception and surveillance."
    },
    {
        id: "69A",
        title: "Section 69A - Blocking of Information",
        type: "criminal",
        description: "Government power to block public access to information.",
        penalty: "Not specified",
        keyElements: [
            "Content blocking",
            "National security",
            "Public order"
        ],
        fullText: "Where the Central Government or any of its officer specially authorised by it in this behalf is satisfied that it is necessary or expedient so to do, in the interest of sovereignty and integrity of India, defence of India, security of the State, friendly relations with foreign States or public order or for preventing incitement to the commission of any cognizable offence relating to above, it may subject to the provisions of sub-section (2) for reasons to be recorded in writing, by order, direct any agency of the Government or intermediary to block for access by the public or cause to be blocked for access by the public any information generated, transmitted, received, stored or hosted in any computer resource.",
        indianContext: "Used to block harmful websites or content."
    },
    {
        id: "69B",
        title: "Section 69B - Monitoring and Collecting Traffic Data",
        type: "criminal",
        description: "Government power to monitor and collect traffic data.",
        penalty: "Not specified",
        keyElements: [
            "Traffic data",
            "Cybersecurity",
            "National security"
        ],
        fullText: "The Central Government may, to enhance cyber security and for identification, analysis and prevention of intrusion or spread of computer contaminant in the country, by notification in the Official Gazette, authorise any agency of the Government to monitor and collect traffic data or information generated, transmitted, received or stored in any computer resource.",
        indianContext: "Supports cybersecurity by analyzing network traffic."
    },
    {
        id: "70",
        title: "Section 70 - Protected Systems",
        type: "criminal",
        description: "Protection of critical information infrastructure.",
        penalty: "Up to 10 years imprisonment and fine.",
        keyElements: [
            "Critical infrastructure",
            "Unauthorized access",
            "National security"
        ],
        fullText: "The appropriate Government may, by notification in the Official Gazette, declare any computer resource which directly or indirectly affects the facility of Critical Information Infrastructure, to be a protected system. The appropriate Government may, by order in writing, authorise the persons who are authorised to access protected systems notified under sub-section (1). Any person who secures access or attempts to secure access to a protected system in contravention of the provisions of this section shall be punished with imprisonment of either description for a term which may extend to ten years and shall also be liable to fine.",
        indianContext: "Protects power grids and banking systems."
    },
    {
        id: "70A",
        title: "Section 70A - National Nodal Agency",
        type: "regulatory",
        description: "Designation of a national nodal agency for critical infrastructure.",
        penalty: "Not specified",
        keyElements: [
            "Critical infrastructure",
            "Cybersecurity",
            "Coordination"
        ],
        fullText: "The Central Government may, by notification published in the Official Gazette, designate any organisation of the Government as the national nodal agency in respect of Critical Information Infrastructure Protection. The national nodal agency shall be responsible for all measures including Research and Development relating to protection of Critical Information Infrastructure.",
        indianContext: "Establishes NCIIPC for critical infrastructure protection."
    },
    {
        id: "70B",
        title: "Section 70B - Indian Computer Emergency Response Team",
        type: "regulatory",
        description: "Establishes CERT-In as the national cybersecurity agency.",
        penalty: "Not specified",
        keyElements: [
            "Cybersecurity",
            "Incident response",
            "Coordination"
        ],
        fullText: "The Central Government shall, by notification in the Official Gazette, appoint an agency of the Government to be called the Indian Computer Emergency Response Team. The Central Government may, by the said notification, specify the functions, duties and powers of the said agency including the manner of performing such functions and duties.",
        indianContext: "CERT-In coordinates cybersecurity incident response."
    },
    {
        id: "71",
        title: "Section 71 - Misrepresentation for Electronic Signature Certificate",
        type: "criminal",
        description: "Misrepresentation to obtain electronic signature certificates.",
        penalty: "Up to 2 years imprisonment or fine up to \u20b91 lakh, or both.",
        keyElements: [
            "Misrepresentation",
            "Electronic signature",
            "Fraud"
        ],
        fullText: "Whoever makes any misrepresentation to, or suppresses any material fact from, the Controller or the Certifying Authority for the purpose of obtaining any licence or Electronic Signature Certificate, as the case may be, shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.",
        indianContext: "Ensures integrity of digital signatures in e-governance."
    },
    {
        id: "72",
        title: "Section 72 - Breach of Confidentiality and Privacy",
        type: "criminal",
        description: "Unauthorized disclosure of electronic records.",
        penalty: "Up to 2 years imprisonment or fine up to \u20b91 lakh, or both.",
        keyElements: [
            "Confidentiality breach",
            "Unauthorized disclosure",
            "Privacy"
        ],
        fullText: "Save as otherwise provided in this Act or any other law for the time being in force, any person who, in pursuance of any of the powers conferred under this Act, rules or regulations made thereunder, has secured access to any electronic record, book, register, correspondence, information, document or other material without the consent of the person concerned discloses such electronic record, book, register, correspondence, information, document or other material to any other person shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.",
        indianContext: "Applied in data leak cases."
    },
    {
        id: "72A",
        title: "Section 72A - Disclosure of Information in Breach of Contract",
        type: "criminal",
        description: "Disclosure of personal information in breach of contract.",
        penalty: "Up to 3 years imprisonment or fine up to \u20b95 lakh, or both.",
        keyElements: [
            "Personal information",
            "Contract breach",
            "Unauthorized disclosure"
        ],
        fullText: "Save as otherwise provided in this Act or any other law for the time being in force, any person including an intermediary who, while providing services under the terms of lawful contract, has secured access to any material containing personal information about another person, with the intent to cause or knowing that he is likely to cause wrongful loss or wrongful gain discloses, without the consent of the person concerned, or in breach of a lawful contract, such material to any other person, shall be punished with imprisonment for a term which may extend to three years, or with fine which may extend to five lakh rupees, or with both.",
        indianContext: "Relevant for ISPs and BPOs."
    },
    {
        id: "73",
        title: "Section 73 - Publishing False Electronic Signature Certificate",
        type: "criminal",
        description: "Publishing false electronic signature certificates.",
        penalty: "Up to 2 years imprisonment or fine up to \u20b91 lakh, or both.",
        keyElements: [
            "False certificate",
            "Electronic signature",
            "Fraud"
        ],
        fullText: "No person shall publish a Electronic Signature Certificate or otherwise make it available to any other person with the knowledge that (a) the Certifying Authority listed in the certificate has not issued it; or (b) the subscriber listed in the certificate has not accepted it; or (c) the certificate has been revoked or suspended, unless such publication is for the purpose of verifying a electronic signature created prior to such suspension or revocation. Any person who contravenes the provisions of sub-section (1) shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.",
        indianContext: "Protects digital signature integrity."
    },
    {
        id: "74",
        title: "Section 74 - Publication for Fraudulent Purpose",
        type: "criminal",
        description: "Publishing electronic signature certificates for fraudulent purposes.",
        penalty: "Up to 2 years imprisonment or fine up to \u20b91 lakh, or both.",
        keyElements: [
            "Fraudulent publication",
            "Electronic signature",
            "Deception"
        ],
        fullText: "Whoever knowingly creates, publishes or otherwise makes available a Electronic Signature Certificate for any fraudulent or unlawful purpose shall be punished with imprisonment for a term which may extend to two years, or with fine which may extend to one lakh rupees, or with both.",
        indianContext: "Addresses fraudulent digital certificate use."
    },
    {
        id: "75",
        title: "Section 75 - Act to Apply for Offences Outside India",
        type: "criminal",
        description: "Extraterritorial jurisdiction for cyber offences.",
        penalty: "Not specified",
        keyElements: [
            "Extraterritorial jurisdiction",
            "Cybercrime",
            "International"
        ],
        fullText: "Subject to the provisions of sub-section (2), the provisions of this Act shall apply also to any offence or contravention committed outside India by any person irrespective of his nationality. For the purposes of sub-section (1), this Act shall apply to an offence or contravention committed outside India by any person if the act or conduct constituting the offence or contravention involves a computer, computer system or computer network located in India.",
        indianContext: "Enables prosecution of foreign nationals for cybercrimes."
    },
    {
        id: "79",
        title: "Section 79 - Intermediary Liability",
        type: "civil",
        description: "Exemption from liability for intermediaries with due diligence.",
        penalty: "Not specified",
        keyElements: [
            "Safe harbor",
            "Due diligence",
            "Takedown notices"
        ],
        fullText: "Notwithstanding anything contained in any law for the time being in force but subject to the provisions of sub-sections (2) and (3), an intermediary shall not be liable for any third party information, data, or communication link made available or hosted by him. The provisions of sub-section (1) shall apply if the intermediary does not initiate the transmission, select the receiver of the transmission, and select or modify the information contained in the transmission; and the intermediary observes due diligence while discharging his duties under this Act and also observes such other guidelines as the Central Government may prescribe in this behalf.",
        indianContext: "Critical for platforms like X and YouTube."
    },
    {
        id: "4",
        title: "Section 4 - Application of Act",
        type: "civil",
        description: "Scope of data protection for digital personal data.",
        penalty: "Up to \u20b9250 crore per instance.",
        keyElements: [
            "Personal data",
            "Digital processing",
            "Jurisdiction"
        ],
        fullText: "This Act applies to the processing of digital personal data within the territory of India where the personal data is collected in digital form or non-digital form and digitized subsequently. It also applies to processing of digital personal data outside India if it is in connection with offering goods or services to data principals in India.",
        indianContext: "Establishes jurisdiction over global data processing."
    },
    {
        id: "5",
        title: "Section 5 - Obligations of Data Fiduciaries",
        type: "civil",
        description: "Duties of entities processing personal data.",
        penalty: "Up to \u20b9250 crore per instance.",
        keyElements: [
            "Consent",
            "Transparency",
            "Security"
        ],
        fullText: "A Data Fiduciary shall process personal data only for a lawful purpose after obtaining the consent of the Data Principal, ensure completeness and accuracy of data, implement reasonable security safeguards, and cease processing upon withdrawal of consent.",
        indianContext: "Critical for e-commerce and tech firms."
    },
    {
        id: "6",
        title: "Section 6 - Consent for Data Processing",
        type: "civil",
        description: "Requirement of informed consent for data processing.",
        penalty: "Up to \u20b9250 crore per instance.",
        keyElements: [
            "Informed consent",
            "Withdrawal",
            "Notice"
        ],
        fullText: "Every Data Fiduciary shall obtain consent from the Data Principal, which shall be free, specific, informed, unconditional, and unambiguous. The Data Fiduciary shall provide a notice specifying the purpose of processing, rights of the Data Principal, and grievance redressal mechanisms.",
        indianContext: "Ensures user control over personal data."
    },
    {
        id: "8",
        title: "Section 8 - Processing of Children\u2019s Data",
        type: "civil",
        description: "Special provisions for processing children\u2019s data.",
        penalty: "Up to \u20b9250 crore per instance.",
        keyElements: [
            "Parental consent",
            "Child protection",
            "Data minimization"
        ],
        fullText: "A Data Fiduciary shall, before processing any personal data of a child, obtain verifiable parental consent and shall not undertake processing that is likely to cause harm to a child, including tracking or behavioral monitoring.",
        indianContext: "Protects minors in the digital ecosystem."
    },
    {
        id: "10",
        title: "Section 10 - Data Breach Notification",
        type: "civil",
        description: "Mandatory reporting of data breaches.",
        penalty: "Up to \u20b9250 crore per instance.",
        keyElements: [
            "Breach notification",
            "Data Protection Board",
            "Timely reporting"
        ],
        fullText: "A Data Fiduciary shall, upon becoming aware of a personal data breach, notify the Data Protection Board and each affected Data Principal in the prescribed manner and take remedial measures to mitigate the impact of the breach.",
        indianContext: "Strengthens data breach response."
    },
    {
        id: "16",
        title: "Section 16 - Data Protection Board",
        type: "civil",
        description: "Establishment of the Data Protection Board.",
        penalty: "Up to \u20b9250 crore per instance for non-compliance.",
        keyElements: [
            "Enforcement",
            "Adjudication",
            "Compliance"
        ],
        fullText: "The Central Government shall establish a Data Protection Board of India to enforce compliance with this Act, inquire into personal data breaches, impose penalties, and issue directions to Data Fiduciaries.",
        indianContext: "Central to DPDPA enforcement, pending operationalization."
    },
    {
        id: "121",
        title: "Section 121 - Organized Cybercrimes",
        type: "criminal",
        description: "Organized cybercrimes like phishing and hacking.",
        penalty: "5 years to life imprisonment and fine starting at \u20b95 lakh.",
        keyElements: [
            "Organized crime",
            "Phishing",
            "Hacking"
        ],
        fullText: "Whoever commits or conspires to commit organized crime through digital means, including phishing, vishing, hacking, or other cybercrimes aimed at causing wrongful loss or gain, shall be punished with imprisonment for a term which may extend to life, and shall also be liable to fine which shall not be less than five lakh rupees.",
        indianContext: "Addresses sophisticated cybercrimes, replacing IPC provisions."
    },
    {
        id: "303",
        title: "Section 303 - Theft (Digital Context)",
        type: "criminal",
        description: "Theft of digital assets or data.",
        penalty: "Up to 7 years imprisonment or fine, or both.",
        keyElements: [
            "Theft",
            "Digital assets",
            "Data"
        ],
        fullText: "Whoever dishonestly takes any movable property, including digital assets or data, out of the possession of any person without that person\u2019s consent, with the intention of such taking, shall be punished with imprisonment of either description for a term which may extend to seven years, or with fine, or with both.",
        indianContext: "Relevant for data theft and cryptocurrency frauds."
    },
    {
        id: "318",
        title: "Section 318 - Cheating (Digital Context)",
        type: "criminal",
        description: "Cheating using digital means.",
        penalty: "Up to 7 years imprisonment and fine.",
        keyElements: [
            "Cheating",
            "Digital fraud",
            "Deception"
        ],
        fullText: "Whoever cheats by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        indianContext: "Applied to online frauds and banking scams."
    },
    {
        id: "336",
        title: "Section 336 - Forgery (Digital Context)",
        type: "criminal",
        description: "Forgery of electronic records.",
        penalty: "Up to 7 years imprisonment and fine.",
        keyElements: [
            "Forgery",
            "Electronic records",
            "Deception"
        ],
        fullText: "Whoever makes any false electronic record or part of an electronic record with intent to cause damage or injury to the public or any person, or to cause any person to part with property, or to enter into any express or implied contract, or with intent to commit fraud, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        indianContext: "Used in forged digital signatures and documents."
    },
    {
        id: "352",
        title: "Section 352 - Criminal Defamation (Digital Context)",
        type: "criminal",
        description: "Defamation through digital means.",
        penalty: "Up to 2 years imprisonment or fine, or both.",
        keyElements: [
            "Defamation",
            "Digital publication",
            "Reputation"
        ],
        fullText: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, including through electronic means, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.",
        indianContext: "Applied to online defamation cases."
    },
    {
        id: "65A",
        title: "Section 65A - Admissibility of Electronic Records",
        type: "regulatory",
        description: "Special provisions for admissibility of electronic records.",
        penalty: "Not specified",
        keyElements: [
            "Electronic evidence",
            "Admissibility",
            "Authentication"
        ],
        fullText: "Any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media produced by a computer shall be deemed to be also a document, if the conditions mentioned in this section are satisfied in relation to the information and computer in question and shall be admissible in any proceedings, without further proof or production of the original.",
        indianContext: "Critical for prosecuting cybercrimes with digital evidence."
    },
    {
        id: "65B",
        title: "Section 65B - Admissibility of Electronic Evidence",
        type: "regulatory",
        description: "Conditions for admitting electronic evidence.",
        penalty: "Not specified",
        keyElements: [
            "Electronic evidence",
            "Certification",
            "Admissibility"
        ],
        fullText: "Any information contained in an electronic record which is printed on paper, stored, recorded or copied in optical or magnetic media produced by a computer shall be deemed to be a document and admissible in any proceedings provided it is accompanied by a certificate signed by a person occupying a responsible official position in relation to the operation of the relevant device or the management of the relevant activities.",
        indianContext: "Ensures reliability of digital evidence in courts."
    },
    {
        id: "63",
        title: "Section 63 - Offence of Infringement of Copyright",
        type: "criminal",
        description: "Infringement of copyright, including digital content.",
        penalty: "Up to 3 years imprisonment and fine.",
        keyElements: [
            "Copyright infringement",
            "Digital content",
            "Piracy"
        ],
        fullText: "Any person who knowingly infringes or abets the infringement of the copyright in a work shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to three years and with fine which shall not be less than fifty thousand rupees but which may extend to two lakh rupees.",
        indianContext: "Applied to software piracy and online content theft."
    }
    ]
};

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Enhanced search with autocomplete and suggestions
function performSearch(query) {
    query = query.toLowerCase();
    
    // Search in title, description, key elements, full text, and Indian context
    const results = lawData.sections.filter(section => 
        section.title.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query) ||
        (section.keyElements && section.keyElements.some(element => 
            element.toLowerCase().includes(query)
        )) ||
        (section.fullText && section.fullText.toLowerCase().includes(query)) ||
        (section.indianContext && section.indianContext.toLowerCase().includes(query))
    );

    displaySearchResults(results);
    
    // If search is performed via button click or Enter key, also update the main content
    if (query.length > 0) {
        displayFilteredLawSections(results);
    } else {
        displayLawSections(); // Reset to show all
    }
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No results found in Indian cyber laws database</p>';
        return;
    }

    const resultsList = document.createElement('ul');
    results.forEach(result => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#${result.id}" class="search-result-item">
                <span class="result-title">${result.title}</span>
                <span class="result-type ${result.type}">${result.type}</span>
            </a>
        `;
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            searchResults.style.display = 'none';
            highlightLawSection(result.id);
        });
        resultsList.appendChild(li);
    });

    searchResults.appendChild(resultsList);
}

// Highlight the selected law section
function highlightLawSection(id) {
    // First display all sections to ensure the target is visible
    displayLawSections();
    
    // Find the target section
    const targetSection = document.querySelector(`.law-item[data-id="${id}"]`);
    if (targetSection) {
        // Remove any existing highlights
        document.querySelectorAll('.law-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Add highlight class
        targetSection.classList.add('highlighted');
        
        // Scroll to the section
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Display filtered law sections based on search results
function displayFilteredLawSections(filteredSections) {
    const lawResults = document.querySelector('.law-results');
    const existingHeader = lawResults.querySelector('.section-header');
    lawResults.innerHTML = ''; // Clear existing content
    lawResults.appendChild(existingHeader); // Restore header

    if (filteredSections.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No matching Indian cyber laws found. Try different search terms.';
        lawResults.appendChild(noResults);
        return;
    }

    filteredSections.forEach(section => {
        const lawItem = document.createElement('div');
        lawItem.className = 'law-item';
        lawItem.dataset.type = section.type;
        lawItem.dataset.id = section.id;

        let statusBadge = '';
        if (section.status) {
            statusBadge = `<span class="status-badge ${section.status.toLowerCase()}">${section.status}</span>`;
        }

        let keyElementsHtml = '';
        if (section.keyElements) {
            keyElementsHtml = `
                <div class="key-elements">
                    <h4>Key Elements:</h4>
                    <ul>
                        ${section.keyElements.map(element => `<li>${element}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        let indianContextHtml = '';
        if (section.indianContext) {
            indianContextHtml = `
                <div class="indian-context">
                    <h4>Indian Context:</h4>
                    <p>${section.indianContext}</p>
                </div>
            `;
        }

        let fullTextHtml = '';
        if (section.fullText) {
            fullTextHtml = `
                <div class="full-text">
                    <h4>Legal Text:</h4>
                    <p>${section.fullText}</p>
                </div>
            `;
        }

        lawItem.innerHTML = `
            <div class="law-header">
                <h3>${section.title}</h3>
                <span class="law-tag">${section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
                ${statusBadge}
            </div>
            <div class="law-content">
                <p><strong>Description:</strong> ${section.description}</p>
                ${section.penalty ? `<p><strong>Penalty:</strong> ${section.penalty}</p>` : ''}
                ${section.applicability ? `<p><strong>Applicability:</strong> ${section.applicability}</p>` : ''}
                ${keyElementsHtml}
                ${indianContextHtml}
                <div class="law-details-toggle">Show full legal text</div>
                <div class="law-full-text" style="display: none;">
                    ${fullTextHtml}
                </div>
                <div class="law-references">
                    <a href="#" class="reference-link" data-section="${section.id}">View Full Section</a>
                    <a href="#" class="reference-link" data-cases="${section.id}">Related Cases</a>
                    <button class="bookmark-btn" data-id="${section.id}">
                        <i class="ph ph-bookmark-simple"></i>
                        Bookmark
                    </button>
                </div>
            </div>
        `;

        lawResults.appendChild(lawItem);
        
        // Add toggle functionality for full text
        const toggleButton = lawItem.querySelector('.law-details-toggle');
        const fullTextSection = lawItem.querySelector('.law-full-text');
        
        toggleButton.addEventListener('click', () => {
            if (fullTextSection.style.display === 'none') {
                fullTextSection.style.display = 'block';
                toggleButton.textContent = 'Hide full legal text';
            } else {
                fullTextSection.style.display = 'none';
                toggleButton.textContent = 'Show full legal text';
            }
        });
    });

    // Reinitialize bookmark buttons
    initializeBookmarkButtons();
}

// Enhanced search event listeners
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length >= 2) {
        performSearch(query);
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
            searchResults.style.display = 'none'; // Hide dropdown after Enter
        }
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        performSearch(query);
        searchResults.style.display = 'none'; // Hide dropdown after click
    }
});

// Close search results when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-section')) {
        searchResults.style.display = 'none';
    }
});

// Display law sections
function displayLawSections() {
    const lawResults = document.querySelector('.law-results');
    const existingHeader = lawResults.querySelector('.section-header');
    lawResults.innerHTML = ''; // Clear existing content
    lawResults.appendChild(existingHeader); // Restore header

    lawData.sections.forEach(section => {
        const lawItem = document.createElement('div');
        lawItem.className = 'law-item';
        lawItem.dataset.type = section.type;
        lawItem.dataset.id = section.id;

        let statusBadge = '';
        if (section.status) {
            statusBadge = `<span class="status-badge ${section.status.toLowerCase()}">${section.status}</span>`;
        }

        let keyElementsHtml = '';
        if (section.keyElements) {
            keyElementsHtml = `
                <div class="key-elements">
                    <h4>Key Elements:</h4>
                    <ul>
                        ${section.keyElements.map(element => `<li>${element}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        let indianContextHtml = '';
        if (section.indianContext) {
            indianContextHtml = `
                <div class="indian-context">
                    <h4>Indian Context:</h4>
                    <p>${section.indianContext}</p>
                </div>
            `;
        }

        lawItem.innerHTML = `
            <div class="law-header">
                <h3>${section.title}</h3>
                <span class="law-tag">${section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
                ${statusBadge}
            </div>
            <div class="law-content">
                <p><strong>Description:</strong> ${section.description}</p>
                ${section.penalty ? `<p><strong>Penalty:</strong> ${section.penalty}</p>` : ''}
                ${section.applicability ? `<p><strong>Applicability:</strong> ${section.applicability}</p>` : ''}
                ${keyElementsHtml}
                ${indianContextHtml}
                <div class="law-details-toggle">Show full legal text</div>
                <div class="law-full-text" style="display: none;">
                    <div class="full-text">
                        <h4>Legal Text:</h4>
                        <p>${section.fullText}</p>
                    </div>
                </div>
                <div class="law-references">
                    <a href="#" class="reference-link" data-section="${section.id}">View Full Section</a>
                    <a href="#" class="reference-link" data-cases="${section.id}">Related Cases</a>
                    <button class="bookmark-btn" data-id="${section.id}">
                        <i class="ph ph-bookmark-simple"></i>
                        Bookmark
                    </button>
                </div>
            </div>
        `;

        lawResults.appendChild(lawItem);
        
        // Add toggle functionality for full text
        const toggleButton = lawItem.querySelector('.law-details-toggle');
        const fullTextSection = lawItem.querySelector('.law-full-text');
        
        toggleButton.addEventListener('click', () => {
            if (fullTextSection.style.display === 'none') {
                fullTextSection.style.display = 'block';
                toggleButton.textContent = 'Hide full legal text';
            } else {
                fullTextSection.style.display = 'none';
                toggleButton.textContent = 'Show full legal text';
            }
        });
    });

    // Reinitialize bookmark buttons
    initializeBookmarkButtons();
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.law-item').forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Bookmark functionality
function initializeBookmarkButtons() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    bookmarkButtons.forEach(button => {
        const lawId = button.dataset.id;
        if (bookmarks.includes(lawId)) {
            button.classList.add('active');
            const icon = button.querySelector('i');
            icon.classList.remove('ph-bookmark-simple');
            icon.classList.add('ph-bookmark-simple-fill');
        }

        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            if (button.classList.contains('active')) {
                icon.classList.remove('ph-bookmark-simple');
                icon.classList.add('ph-bookmark-simple-fill');
                saveBookmark(lawId);
            } else {
                icon.classList.add('ph-bookmark-simple');
                icon.classList.remove('ph-bookmark-simple-fill');
                removeBookmark(lawId);
            }
        });
    });
}

function saveBookmark(lawId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!bookmarks.includes(lawId)) {
        bookmarks.push(lawId);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

function removeBookmark(lawId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const index = bookmarks.indexOf(lawId);
    if (index > -1) {
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

// Recent updates with more content
const updates = [
    {
        title: 'New Guidelines for Data Protection',
        date: '2023-12-15',
        description: 'Updated guidelines for handling sensitive personal data under Section 43A of the IT Act in India.'
    },
    {
        title: 'Supreme Court Judgment on Cybercrime',
        date: '2023-12-10',
        description: 'Landmark judgment by the Indian Supreme Court regarding interpretation of Section 66 in cyber fraud cases.'
    },
    {
        title: 'IT Rules Amendment 2023',
        date: '2023-12-05',
        description: 'New amendments to IT Rules regarding social media intermediaries operating in India.'
    },
    {
        title: 'Digital Personal Data Protection Act',
        date: '2023-11-28',
        description: 'Implementation guidelines for the new Indian Data Protection framework.'
    }
];

function displayUpdates() {
    const updatesList = document.getElementById('updatesList');
    updatesList.innerHTML = updates.map(update => `
        <div class="update-item">
            <h3>${update.title}</h3>
            <p>${update.description}</p>
            <span class="update-date">${new Date(update.date).toLocaleDateString()}</span>
        </div>
    `).join('');
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    displayLawSections();
    displayUpdates();
    initializeFilters();
    initializeBookmarkButtons();
    
    // Add placeholder text with suggestions
    searchInput.placeholder = "Search Indian cyber laws (e.g., 'hacking', 'data protection', 'privacy')";
});