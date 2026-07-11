/**
 * Ontology JSON generator - run: node scripts/generate-ontology.js
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '../data/ontology.json');

function vocab(word, pronunciation, definition, examples) {
  return { word, pronunciation, definition, examples };
}

function concept(id, name, difficulty, prerequisites, vocabulary) {
  return { id, name, difficulty, prerequisites, vocabulary };
}

const medical = {
  id: 'medical',
  name: 'Medical Devices',
  concepts: [
    concept('med_001', 'Equipment', 'beginner', [], [
      vocab('imaging', '/ˈɪmɪdʒɪŋ/', 'The process of creating visual representations of internal body structures', [
        'The imaging system provides high-resolution diagnostic images.',
        'Our portable imaging device is FDA-approved for clinical use.',
      ]),
      vocab('monitor', '/ˈmɒnɪtər/', 'A device that continuously observes and displays patient vital signs', [
        'The patient monitor alerts staff when heart rate exceeds threshold.',
        'We installed bedside monitors in every ICU room.',
      ]),
      vocab('sensor', '/ˈsensər/', 'A device that detects and responds to physical input from the environment', [
        'The pressure sensor must be calibrated before each procedure.',
        'Wireless sensors transmit data directly to the central system.',
      ]),
      vocab('calibration', '/ˌkælɪˈbreɪʃən/', 'The process of adjusting equipment to ensure accurate measurements', [
        'Annual calibration is required for all diagnostic equipment.',
        'The technician completed calibration of the ultrasound machine.',
      ]),
      vocab('sterile', '/ˈsterəl/', 'Free from all living microorganisms and contaminants', [
        'All surgical instruments must remain sterile until use.',
        'The sterile field was maintained throughout the procedure.',
      ]),
    ]),
    concept('med_002', 'Procedure', 'beginner', ['med_001'], [
      vocab('incision', '/ɪnˈsɪʒən/', 'A surgical cut made in skin or tissue', [
        'The surgeon made a precise incision along the marked line.',
        'Minimally invasive procedures require smaller incisions.',
      ]),
      vocab('anesthesia', '/ˌænəsˈθiːziə/', 'Medical treatment that prevents patients from feeling pain during surgery', [
        'Local anesthesia was administered before the minor procedure.',
        'The anesthesiologist monitored the patient throughout anesthesia.',
      ]),
      vocab('catheter', '/ˈkæθɪtər/', 'A thin tube inserted into the body to deliver fluids or drain substances', [
        'The nurse inserted the catheter using sterile technique.',
        'Urinary catheter placement requires careful infection control.',
      ]),
      vocab('suture', '/ˈsuːtʃər/', 'A stitch used to close a wound or surgical incision', [
        'Dissolvable sutures eliminate the need for removal.',
        'The wound was closed with six interrupted sutures.',
      ]),
      vocab('protocol', '/ˈprəʊtəkɒl/', 'An established procedure or set of rules for medical operations', [
        'All staff must follow the sterilization protocol.',
        'The emergency protocol was activated within two minutes.',
      ]),
    ]),
    concept('med_003', 'Diagnosis', 'intermediate', ['med_001', 'med_002'], [
      vocab('diagnostic', '/ˌdaɪəɡˈnɒstɪk/', 'Relating to the identification of disease or medical conditions', [
        'The diagnostic accuracy of this device exceeds industry standards.',
        'Early diagnostic testing improves patient outcomes significantly.',
      ]),
      vocab('biomarker', '/ˈbaɪəʊˌmɑːkər/', 'A measurable biological indicator of a disease or condition', [
        'Blood biomarkers help physicians detect cancer at early stages.',
        'The test panel analyzes twelve key biomarkers simultaneously.',
      ]),
      vocab('pathology', '/pəˈθɒlədʒi/', 'The study of disease causes, processes, and effects', [
        'Pathology reports confirmed the preliminary diagnosis.',
        'Digital pathology enables remote consultation between specialists.',
      ]),
      vocab('prognosis', '/prɒɡˈnəʊsɪs/', 'A forecast of the likely course and outcome of a disease', [
        'Early intervention improved the patient prognosis considerably.',
        'The physician discussed prognosis with the patient family.',
      ]),
      vocab('differential', '/ˌdɪfəˈrenʃəl/', 'The process of distinguishing between conditions with similar symptoms', [
        'Differential diagnosis ruled out several alternative conditions.',
        'The algorithm supports differential diagnosis in complex cases.',
      ]),
    ]),
    concept('med_004', 'Safety', 'intermediate', ['med_001', 'med_002'], [
      vocab('hazard', '/ˈhæzəd/', 'A potential source of danger or harm in a medical environment', [
        'The risk assessment identified three primary hazards.',
        'Electrical hazards must be eliminated in wet clinical areas.',
      ]),
      vocab('contamination', '/kənˌtæmɪˈneɪʃən/', 'The presence of harmful substances or microorganisms', [
        'Cross-contamination was prevented through strict isolation protocols.',
        'The recall was issued due to product contamination concerns.',
      ]),
      vocab('adverse', '/ˈædvɜːs/', 'Harmful or unfavorable, especially regarding medical events', [
        'All adverse events must be reported within twenty-four hours.',
        'The study monitored adverse reactions throughout the trial period.',
      ]),
      vocab('compliance', '/kəmˈplaɪəns/', 'Adherence to regulatory standards and safety requirements', [
        'Regulatory compliance is mandatory for all medical device manufacturers.',
        'The audit confirmed full compliance with ISO standards.',
      ]),
      vocab('mitigation', '/ˌmɪtɪˈɡeɪʃən/', 'Actions taken to reduce the severity or impact of risks', [
        'Risk mitigation strategies were implemented across all facilities.',
        'The safety team proposed additional mitigation measures.',
      ]),
    ]),
    concept('med_005', 'Integration', 'intermediate', ['med_001', 'med_002', 'med_003'], [
      vocab('interoperability', '/ˌɪntərˌɒpərəˈbɪləti/', 'The ability of different systems to exchange and use information', [
        'Interoperability standards enable seamless hospital system integration.',
        'Our platform supports HL7 interoperability with legacy systems.',
      ]),
      vocab('interface', '/ˈɪntəfeɪs/', 'A point of interaction between two systems or devices', [
        'The user interface was redesigned based on clinician feedback.',
        'API interfaces connect the device to electronic health records.',
      ]),
      vocab('workflow', '/ˈwɜːkfləʊ/', 'A sequence of tasks performed in clinical or operational settings', [
        'Digital workflow automation reduced documentation time by forty percent.',
        'The integration streamlined the entire patient admission workflow.',
      ]),
      vocab('synchronization', '/ˌsɪŋkrənaɪˈzeɪʃən/', 'Coordinating data or processes across multiple systems simultaneously', [
        'Real-time synchronization ensures all departments see current data.',
        'Data synchronization errors were resolved within the maintenance window.',
      ]),
      vocab('middleware', '/ˈmɪdlweər/', 'Software that connects different applications and enables communication', [
        'Middleware handles data translation between incompatible systems.',
        'The hospital deployed middleware to integrate three vendor platforms.',
      ]),
    ]),
    concept('med_006', 'Regulation', 'intermediate', ['med_004', 'med_003'], [
      vocab('FDA', '/ˌef diː ˈeɪ/', 'The U.S. Food and Drug Administration that regulates medical devices', [
        'FDA clearance is required before marketing Class II devices.',
        'The company submitted its FDA application in January.',
      ]),
      vocab('clearance', '/ˈklɪərəns/', 'Official authorization to market a medical device', [
        '510(k) clearance was obtained within the expected timeframe.',
        'Regulatory clearance expanded our market access to Europe.',
      ]),
      vocab('submission', '/səbˈmɪʃən/', 'Formal documentation sent to regulatory authorities for approval', [
        'The regulatory submission included comprehensive clinical data.',
        'Our team prepared the submission package over six months.',
      ]),
      vocab('classification', '/ˌklæsɪfɪˈkeɪʃən/', 'Categorization of devices by risk level for regulatory purposes', [
        'Device classification determines the regulatory pathway required.',
        'The product received Class II classification from authorities.',
      ]),
      vocab('audit', '/ˈɔːdɪt/', 'A systematic examination of compliance with regulatory requirements', [
        'The annual quality audit identified no major non-conformities.',
        'Regulatory auditors reviewed manufacturing processes for three days.',
      ]),
    ]),
    concept('med_007', 'Sterilization', 'intermediate', ['med_001', 'med_002', 'med_004'], [
      vocab('autoclave', '/ˈɔːtəkleɪv/', 'A pressurized chamber used to sterilize equipment with steam', [
        'Instruments were sterilized in the autoclave for thirty minutes.',
        'The autoclave cycle log is reviewed daily by quality staff.',
      ]),
      vocab('disinfection', '/ˌdɪsɪnˈfekʃən/', 'The process of eliminating most pathogenic microorganisms from surfaces', [
        'Surface disinfection protocols were updated for the new facility.',
        'High-level disinfection is required for semi-critical devices.',
      ]),
      vocab('ethylene', '/ˈeθɪliːn/', 'A gas commonly used for low-temperature sterilization of sensitive materials', [
        'Ethylene oxide sterilization preserves heat-sensitive components.',
        'Ethylene oxide residuals must be below regulatory limits.',
      ]),
      vocab('validation', '/ˌvælɪˈdeɪʃən/', 'Documented evidence that a sterilization process consistently achieves results', [
        'Sterilization validation was completed before production launch.',
        'Annual revalidation confirms continued process effectiveness.',
      ]),
      vocab('bioburden', '/ˈbaɪəʊˌbɜːdən/', 'The level of microbial contamination on a product before sterilization', [
        'Bioburden testing ensures sterilization parameters are adequate.',
        'Reduced bioburden levels improve sterilization efficiency.',
      ]),
    ]),
    concept('med_008', 'Clinical Trial', 'advanced', ['med_003', 'med_006', 'med_004'], [
      vocab('randomized', '/ˈrændəmaɪzd/', 'A trial design where participants are assigned to groups by chance', [
        'The randomized controlled trial enrolled five hundred participants.',
        'Randomized assignment minimizes selection bias in clinical studies.',
      ]),
      vocab('endpoint', '/ˈendpɔɪnt/', 'A predefined outcome measure used to assess trial success', [
        'The primary endpoint was reduction in mortality at twelve months.',
        'Secondary endpoints included quality of life improvements.',
      ]),
      vocab('placebo', '/pləˈsiːbəʊ/', 'An inactive treatment used as a control in clinical trials', [
        'The placebo group showed no significant improvement.',
        'Double-blind design ensured neither patients nor investigators knew placebo assignments.',
      ]),
      vocab('cohort', '/ˈkəʊhɔːt/', 'A group of participants sharing a common characteristic in a study', [
        'The patient cohort was followed for three years post-treatment.',
        'Longitudinal cohort studies provide valuable real-world evidence.',
      ]),
      vocab('efficacy', '/ˈefɪkəsi/', 'The ability of a treatment to produce the desired therapeutic effect', [
        'Clinical efficacy data supported the regulatory submission.',
        'The trial demonstrated significant efficacy compared to standard care.',
      ]),
    ]),
    concept('med_009', 'Patient Monitoring', 'intermediate', ['med_001', 'med_003'], [
      vocab('telemetry', '/təˈlemətri/', 'Remote transmission of patient data for continuous monitoring', [
        'Telemetry systems alert nurses to critical changes immediately.',
        'Wireless telemetry enables patient mobility during recovery.',
      ]),
      vocab('hemodynamic', '/ˌhiːməʊdaɪˈnæmɪk/', 'Relating to blood flow and pressure within the cardiovascular system', [
        'Hemodynamic monitoring guides fluid management in critical patients.',
        'The device provides real-time hemodynamic parameter displays.',
      ]),
      vocab('saturation', '/ˌsætʃəˈreɪʃən/', 'The percentage of hemoglobin binding sites occupied by oxygen', [
        'Oxygen saturation dropped below ninety percent during the procedure.',
        'Pulse oximetry continuously measures oxygen saturation levels.',
      ]),
      vocab('arrhythmia', '/əˈrɪðmiə/', 'An irregular heartbeat rhythm that may require medical intervention', [
        'The monitor detected arrhythmia and triggered an automatic alert.',
        'Cardiac arrhythmia management is a key feature of our device.',
      ]),
      vocab('triage', '/ˈtriːɑːʒ/', 'The process of prioritizing patients based on severity of condition', [
        'Automated triage algorithms help emergency departments manage patient flow.',
        'Remote triage capabilities expanded access to specialist consultation.',
      ]),
    ]),
    concept('med_010', 'Quality Assurance', 'advanced', ['med_006', 'med_004', 'med_005'], [
      vocab('CAPA', '/ˈkæpə/', 'Corrective and Preventive Action process for addressing quality issues', [
        'The CAPA system tracked resolution of all customer complaints.',
        'Root cause analysis is mandatory before closing any CAPA.',
      ]),
      vocab('traceability', '/ˌtreɪsəˈbɪləti/', 'The ability to track product history, location, and handling throughout supply chain', [
        'Full traceability from raw materials to finished product is maintained.',
        'Lot traceability enabled rapid identification of affected devices.',
      ]),
      vocab('nonconformity', '/ˌnɒnkənˈfɔːməti/', 'A deviation from specified requirements or standards', [
        'Minor nonconformities were addressed within the thirty-day deadline.',
        'The inspection revealed one major nonconformity in packaging.',
      ]),
      vocab('verification', '/ˌverɪfɪˈkeɪʃən/', 'Confirmation that specified requirements have been fulfilled', [
        'Design verification confirmed all performance specifications were met.',
        'Software verification included comprehensive unit and integration testing.',
      ]),
      vocab('documentation', '/ˌdɒkjumenˈteɪʃən/', 'Recorded information demonstrating compliance and traceability', [
        'Complete documentation supported the successful regulatory inspection.',
        'Quality documentation must be maintained for the product lifetime.',
      ]),
    ]),
  ],
};

const telecom = {
  id: 'telecom',
  name: 'Telecommunications',
  concepts: [
    concept('tel_001', 'Network', 'beginner', [], [
      vocab('bandwidth', '/ˈbændwɪdθ/', 'The maximum rate of data transfer across a network connection', [
        'Network bandwidth must support simultaneous video conferencing.',
        'We upgraded bandwidth to handle increased traffic during peak hours.',
      ]),
      vocab('router', '/ˈruːtər/', 'A device that forwards data packets between computer networks', [
        'The enterprise router manages traffic across twelve branch offices.',
        'Configure the router to prioritize voice traffic over data.',
      ]),
      vocab('subnet', '/ˈsʌbnet/', 'A logical subdivision of an IP network for organizational purposes', [
        'Each department operates on a separate subnet for security.',
        'Subnet configuration reduced broadcast traffic significantly.',
      ]),
      vocab('latency', '/ˈleɪtənsi/', 'The delay before data transfer begins following an instruction', [
        'Low latency is critical for real-time communication applications.',
        'Network latency increased after the fiber cut in the region.',
      ]),
      vocab('topology', '/təˈpɒlədʒi/', 'The arrangement of network elements and their interconnections', [
        'Star topology simplifies troubleshooting in enterprise networks.',
        'The network topology was redesigned for improved redundancy.',
      ]),
    ]),
    concept('tel_002', 'Protocol', 'beginner', ['tel_001'], [
      vocab('TCP', '/ˌtiː siː ˈpiː/', 'Transmission Control Protocol ensuring reliable data delivery', [
        'TCP guarantees packet delivery in the correct order.',
        'Video streaming applications often use TCP for reliability.',
      ]),
      vocab('UDP', '/ˌjuː diː ˈpiː/', 'User Datagram Protocol for fast but unreliable data transmission', [
        'UDP is preferred for live streaming where speed matters most.',
        'Voice over IP often uses UDP to minimize transmission delay.',
      ]),
      vocab('handshake', '/ˈhændʃeɪk/', 'The process of establishing a connection between network devices', [
        'The TCP handshake completes in three steps before data transfer.',
        'SSL handshake establishes encrypted communication channels.',
      ]),
      vocab('packet', '/ˈpækɪt/', 'A formatted unit of data transmitted over a network', [
        'Packet loss above one percent degrades call quality noticeably.',
        'The firewall inspects every incoming packet for threats.',
      ]),
      vocab('header', '/ˈhedər/', 'Metadata attached to data packets containing routing information', [
        'Packet headers contain source and destination IP addresses.',
        'Protocol headers enable routers to forward traffic correctly.',
      ]),
    ]),
    concept('tel_003', 'Infrastructure', 'intermediate', ['tel_001'], [
      vocab('fiber', '/ˈfaɪbər/', 'Optical cable using light pulses to transmit data at high speeds', [
        'Fiber infrastructure supports gigabit speeds to residential customers.',
        'The fiber backbone connects all regional data centers.',
      ]),
      vocab('backbone', '/ˈbækbəʊn/', 'The principal high-capacity network connecting major nodes', [
        'The national backbone carries intercity telecommunications traffic.',
        'Backbone redundancy ensures service continuity during outages.',
      ]),
      vocab('tower', '/ˈtaʊər/', 'A structure supporting antennas for wireless signal transmission', [
        'Cell tower deployment expanded coverage to rural areas.',
        'The tower lease agreement covers twenty years of operation.',
      ]),
      vocab('switching', '/ˈswɪtʃɪŋ/', 'The process of directing data to its intended destination in a network', [
        'Packet switching enables efficient use of network resources.',
        'Circuit switching guarantees dedicated bandwidth for voice calls.',
      ]),
      vocab('redundancy', '/rɪˈdʌndənsi/', 'Duplication of critical components to ensure system reliability', [
        'Network redundancy prevented service disruption during maintenance.',
        'Geographic redundancy protects against regional disasters.',
      ]),
    ]),
    concept('tel_004', 'Security', 'intermediate', ['tel_001', 'tel_002'], [
      vocab('encryption', '/ɪnˈkrɪpʃən/', 'Converting data into coded form to prevent unauthorized access', [
        'End-to-end encryption protects customer communications from interception.',
        'AES encryption is the industry standard for telecom security.',
      ]),
      vocab('firewall', '/ˈfaɪəwɔːl/', 'A security system monitoring and controlling network traffic', [
        'The firewall blocked unauthorized access attempts overnight.',
        'Next-generation firewalls inspect application-layer traffic.',
      ]),
      vocab('intrusion', '/ɪnˈtruːʒən/', 'Unauthorized access to a network or system', [
        'Intrusion detection systems alert security teams to threats.',
        'The intrusion attempt was traced to an external IP address.',
      ]),
      vocab('authentication', '/ɔːˌθentɪˈkeɪʃən/', 'Verifying the identity of users or devices accessing a network', [
        'Multi-factor authentication strengthens network access security.',
        'Certificate-based authentication secures device-to-device communication.',
      ]),
      vocab('vulnerability', '/ˌvʌlnərəˈbɪləti/', 'A weakness that could be exploited to compromise system security', [
        'Security patches addressed critical vulnerabilities within forty-eight hours.',
        'Regular vulnerability assessments identify risks before exploitation.',
      ]),
    ]),
    concept('tel_005', 'Bandwidth Management', 'beginner', ['tel_001'], [
      vocab('throttling', '/ˈθrɒtlɪŋ/', 'Intentionally limiting data transfer speed to manage network load', [
        'Bandwidth throttling prevents network congestion during peak usage.',
        'The ISP implemented throttling for heavy data consumers.',
      ]),
      vocab('allocation', '/ˌæləˈkeɪʃən/', 'Distribution of available bandwidth among users or applications', [
        'Dynamic bandwidth allocation prioritizes business-critical applications.',
        'Fair allocation policies ensure equitable service for all subscribers.',
      ]),
      vocab('throughput', '/ˈθruːpʊt/', 'The actual rate of successful data delivery over a network', [
        'Measured throughput fell below contracted service levels.',
        'Throughput optimization improved customer satisfaction scores.',
      ]),
      vocab('congestion', '/kənˈdʒestʃən/', 'Network overload when traffic exceeds available capacity', [
        'Traffic congestion during events requires proactive capacity planning.',
        'Congestion management algorithms reroute traffic automatically.',
      ]),
      vocab('QoS', '/ˌkjuː əʊ ˈes/', 'Quality of Service mechanisms prioritizing critical network traffic', [
        'QoS policies ensure voice calls maintain priority over downloads.',
        'Implementing QoS reduced call drop rates by thirty percent.',
      ]),
    ]),
    concept('tel_006', 'Latency Optimization', 'intermediate', ['tel_001', 'tel_005'], [
      vocab('jitter', '/ˈdʒɪtər/', 'Variation in packet arrival time affecting real-time communication quality', [
        'High jitter causes choppy audio during video conferences.',
        'Jitter buffers compensate for inconsistent packet delivery.',
      ]),
      vocab('ping', '/pɪŋ/', 'A network utility measuring round-trip time to a destination', [
        'Ping times below fifty milliseconds indicate excellent connectivity.',
        'The technician ran ping tests to diagnose connectivity issues.',
      ]),
      vocab('buffering', '/ˈbʌfərɪŋ/', 'Temporarily storing data to smooth playback or transmission', [
        'Excessive buffering indicates insufficient network bandwidth.',
        'Adaptive buffering adjusts to varying network conditions.',
      ]),
      vocab('edge', '/edʒ/', 'Computing or caching performed near end users to reduce latency', [
        'Edge computing brings content closer to subscribers.',
        'CDN edge servers reduced page load times dramatically.',
      ]),
      vocab('propagation', '/ˌprɒpəˈɡeɪʃən/', 'The time for a signal to travel through a transmission medium', [
        'Signal propagation delay limits maximum fiber cable distances.',
        'Understanding propagation characteristics guides network design.',
      ]),
    ]),
    concept('tel_007', '5G Technology', 'advanced', ['tel_001', 'tel_003'], [
      vocab('millimeter', '/ˈmɪlɪmiːtər/', 'High-frequency radio waves used in 5G for ultra-fast data transfer', [
        'Millimeter wave technology enables multi-gigabit 5G speeds.',
        'Millimeter signals require dense small cell deployment.',
      ]),
      vocab('beamforming', '/ˈbiːmfɔːmɪŋ/', 'Directing wireless signals toward specific devices for efficiency', [
        'Beamforming improves signal strength at cell edge locations.',
        'Massive MIMO with beamforming increases network capacity fivefold.',
      ]),
      vocab('slicing', '/ˈslaɪsɪŋ/', 'Creating virtual network segments with dedicated resources', [
        'Network slicing enables customized services for enterprise clients.',
        'A dedicated slice guarantees bandwidth for emergency services.',
      ]),
      vocab('MIMO', '/ˈmaɪməʊ/', 'Multiple Input Multiple Output using multiple antennas for better performance', [
        'MIMO technology doubles data throughput without additional bandwidth.',
        'Massive MIMO is a cornerstone of 5G network architecture.',
      ]),
      vocab('latency-critical', '/ˈleɪtənsi ˈkrɪtɪkəl/', 'Applications requiring extremely low network delay', [
        'Latency-critical applications include autonomous vehicle communication.',
        '5G supports latency-critical industrial automation use cases.',
      ]),
    ]),
    concept('tel_008', 'Cloud Services', 'intermediate', ['tel_003', 'tel_002'], [
      vocab('virtualization', '/ˌvɜːtʃuəlaɪˈzeɪʃən/', 'Creating virtual versions of hardware, storage, or network resources', [
        'Network virtualization reduces hardware costs significantly.',
        'Server virtualization enabled rapid disaster recovery capabilities.',
      ]),
      vocab('orchestration', '/ˌɔːkɪstreɪˈʃən/', 'Automated coordination and management of complex network services', [
        'Service orchestration deploys network functions in minutes.',
        'Cloud orchestration manages resources across multiple data centers.',
      ]),
      vocab('container', '/kənˈteɪnər/', 'A lightweight package containing application code and dependencies', [
        'Container deployment accelerated service rollout timelines.',
        'Network functions are increasingly deployed as containers.',
      ]),
      vocab('scalability', '/ˌskeɪləˈbɪləti/', 'The ability to handle growing workloads by adding resources', [
        'Cloud scalability supports seasonal traffic spikes effortlessly.',
        'Horizontal scalability adds servers to distribute increasing load.',
      ]),
      vocab('multitenancy', '/ˌmʌltiˈtenənsi/', 'A single infrastructure instance serving multiple customers securely', [
        'Multitenancy architecture reduces operational costs per subscriber.',
        'Secure multitenancy isolates customer data completely.',
      ]),
    ]),
    concept('tel_009', 'Network Troubleshooting', 'advanced', ['tel_001', 'tel_002', 'tel_004'], [
      vocab('diagnostic', '/ˌdaɪəɡˈnɒstɪk/', 'Tools and procedures for identifying network problems', [
        'Network diagnostic tools pinpointed the faulty switch port.',
        'Automated diagnostics reduced mean time to resolution by half.',
      ]),
      vocab('traceroute', '/ˈtreɪsruːt/', 'A utility showing the path packets take to reach a destination', [
        'Traceroute revealed a routing loop causing packet loss.',
        'The engineer used traceroute to identify the bottleneck hop.',
      ]),
      vocab('SNMP', '/ˌes en em ˈpiː/', 'Simple Network Management Protocol for monitoring network devices', [
        'SNMP monitoring alerts operators to device failures instantly.',
        'SNMP traps notify the NOC of critical threshold breaches.',
      ]),
      vocab('root cause', '/ruːt kɔːz/', 'The fundamental reason behind a network failure or issue', [
        'Root cause analysis identified a firmware bug as the culprit.',
        'Finding the root cause prevents recurring network outages.',
      ]),
      vocab('escalation', '/ˌeskəˈleɪʃən/', 'Raising an unresolved issue to higher support levels', [
        'Tier three escalation resolved the complex routing issue.',
        'Automatic escalation triggers when SLA thresholds are breached.',
      ]),
    ]),
    concept('tel_010', 'Telecommunications Sales', 'advanced', ['tel_007', 'tel_008'], [
      vocab('provisioning', '/prəˈvɪʒənɪŋ/', 'Setting up and configuring services for new customers', [
        'Automated provisioning activates services within minutes of order.',
        'Service provisioning errors were reduced by ninety percent.',
      ]),
      vocab('SLA', '/ˌes el ˈeɪ/', 'Service Level Agreement defining guaranteed performance standards', [
        'The enterprise SLA guarantees ninety-nine point nine percent uptime.',
        'SLA penalties apply when performance targets are not met.',
      ]),
      vocab('churn', '/tʃɜːn/', 'The rate at which customers cancel or switch service providers', [
        'Customer churn decreased after improving network reliability.',
        'Proactive support programs target accounts at risk of churn.',
      ]),
      vocab('upselling', '/ˈʌpselɪŋ/', 'Encouraging customers to purchase higher-tier or additional services', [
        'Upselling fiber upgrades increased average revenue per user.',
        'The sales team focuses on upselling enterprise security packages.',
      ]),
      vocab('ROI', '/ˌɑːr əʊ ˈaɪ/', 'Return on Investment measuring financial benefit relative to cost', [
        'The client calculated ROI from reduced downtime costs.',
        'Presenting ROI data helped close the enterprise contract.',
      ]),
    ]),
  ],
};

// Finance, Tech, Automotive - continue in part 2 due to size
const finance = {
  id: 'finance',
  name: 'Finance',
  concepts: [
    concept('fin_001', 'Investment', 'beginner', [], [
      vocab('portfolio', '/pɔːtˈfəʊliəʊ/', 'A collection of financial assets held by an investor', [
        'The portfolio was diversified across multiple asset classes.',
        'Portfolio performance exceeded the benchmark index this quarter.',
      ]),
      vocab('equity', '/ˈekwəti/', 'Ownership interest in a company represented by shares', [
        'Equity markets rallied following the positive earnings report.',
        'Private equity firms acquired the company for two billion dollars.',
      ]),
      vocab('dividend', '/ˈdɪvɪdend/', 'A payment distributed to shareholders from company profits', [
        'The board approved a quarterly dividend of fifty cents per share.',
        'Dividend yield attracted income-focused investors.',
      ]),
      vocab('liquidity', '/lɪˈkwɪdəti/', 'The ease with which an asset can be converted to cash', [
        'Market liquidity dried up during the financial crisis.',
        'High liquidity ensures investors can exit positions quickly.',
      ]),
      vocab('yield', '/jiːld/', 'The income return on an investment over a given period', [
        'Bond yields rose as central banks tightened monetary policy.',
        'The fund targets a yield of four percent annually.',
      ]),
    ]),
    concept('fin_002', 'Risk', 'beginner', ['fin_001'], [
      vocab('volatility', '/ˌvɒləˈtɪləti/', 'The degree of variation in asset prices over time', [
        'Market volatility increased ahead of the earnings announcement.',
        'Options trading profits from correctly predicting volatility.',
      ]),
      vocab('hedge', '/hedʒ/', 'An investment made to reduce the risk of adverse price movements', [
        'Currency hedging protected the fund from exchange rate fluctuations.',
        'The company hedged commodity exposure through futures contracts.',
      ]),
      vocab('exposure', '/ɪkˈspəʊʒər/', 'The degree to which an investor is vulnerable to financial loss', [
        'Credit exposure limits were tightened across all trading desks.',
        'Geographic exposure was reduced by reallocating to domestic assets.',
      ]),
      vocab('default', '/dɪˈfɔːlt/', 'Failure to fulfill financial obligations such as loan repayment', [
        'Bond default rates remained below historical averages.',
        'Credit analysts assessed the probability of corporate default.',
      ]),
      vocab('correlation', '/ˌkɒrəˈleɪʃən/', 'A statistical relationship between the movements of two assets', [
        'Low correlation between assets improves portfolio diversification.',
        'Correlation analysis revealed hidden concentration risks.',
      ]),
    ]),
    concept('fin_003', 'Market', 'intermediate', ['fin_001'], [
      vocab('bull', '/bʊl/', 'A market condition where prices are rising or expected to rise', [
        'The bull market continued for eighteen consecutive months.',
        'Investor sentiment turned bullish after the policy announcement.',
      ]),
      vocab('bear', '/beər/', 'A market condition where prices are falling or expected to fall', [
        'Bear market conditions prompted defensive portfolio repositioning.',
        'The analyst warned of a potential bear market correction.',
      ]),
      vocab('index', '/ˈɪndeks/', 'A statistical measure tracking performance of a market segment', [
        'The S&P index reached an all-time high last week.',
        'Index funds provide low-cost exposure to broad markets.',
      ]),
      vocab('arbitrage', '/ˈɑːbɪtrɑːʒ/', 'Profiting from price differences of the same asset in different markets', [
        'Arbitrage opportunities disappeared as markets became more efficient.',
        'Statistical arbitrage strategies exploit temporary price discrepancies.',
      ]),
      vocab('sentiment', '/ˈsentɪmənt/', 'The overall attitude of investors toward market conditions', [
        'Market sentiment improved following the interest rate decision.',
        'Sentiment indicators suggest cautious optimism among fund managers.',
      ]),
    ]),
    concept('fin_004', 'Analytics', 'intermediate', ['fin_003', 'fin_002'], [
      vocab('regression', '/rɪˈɡreʃən/', 'A statistical method modeling relationships between variables', [
        'Regression analysis identified key drivers of stock performance.',
        'Multiple regression models forecast revenue with high accuracy.',
      ]),
      vocab('forecasting', '/ˈfɔːkɑːstɪŋ/', 'Predicting future financial outcomes based on historical data', [
        'Revenue forecasting incorporated macroeconomic scenario analysis.',
        'Machine learning improved forecasting accuracy by fifteen percent.',
      ]),
      vocab('benchmark', '/ˈbentʃmɑːk/', 'A standard used to measure performance of investments or strategies', [
        'The fund outperformed its benchmark by two hundred basis points.',
        'Benchmark selection significantly affects perceived fund performance.',
      ]),
      vocab('alpha', '/ˈælfə/', 'Excess return of an investment relative to a benchmark index', [
        'The manager generated positive alpha through stock selection.',
        'Alpha decay occurs as successful strategies attract imitators.',
      ]),
      vocab('beta', '/ˈbeɪtə/', 'A measure of an asset volatility relative to the overall market', [
        'High beta stocks amplify market movements in both directions.',
        'Portfolio beta was adjusted to match the client risk tolerance.',
      ]),
    ]),
    concept('fin_005', 'Portfolio Management', 'intermediate', ['fin_001', 'fin_002'], [
      vocab('rebalancing', '/riːˈbælənsɪŋ/', 'Adjusting portfolio allocations back to target weights', [
        'Quarterly rebalancing maintained the desired asset allocation.',
        'Tax-efficient rebalancing minimized capital gains realization.',
      ]),
      vocab('allocation', '/ˌæləˈkeɪʃən/', 'Distribution of investments across different asset categories', [
        'Strategic asset allocation drives long-term portfolio returns.',
        'The allocation shifted toward fixed income as retirement approached.',
      ]),
      vocab('diversification', '/daɪˌvɜːsɪfɪˈkeɪʃən/', 'Spreading investments to reduce exposure to any single risk', [
        'Portfolio diversification limited losses during the sector downturn.',
        'Geographic diversification reduced country-specific political risk.',
      ]),
      vocab('turnover', '/ˈtɜːnəʊvər/', 'The rate at which portfolio holdings are bought and sold', [
        'Low portfolio turnover reduces transaction costs and taxes.',
        'High turnover may indicate active trading strategy changes.',
      ]),
      vocab('drawdown', '/ˈdrɔːdaʊn/', 'The peak-to-trough decline in portfolio value during a period', [
        'Maximum drawdown is a key risk metric for hedge funds.',
        'The portfolio recovered from a fifteen percent drawdown within six months.',
      ]),
    ]),
    concept('fin_006', 'Compliance', 'advanced', ['fin_002', 'fin_004'], [
      vocab('AML', '/ˌeɪ em ˈel/', 'Anti-Money Laundering regulations preventing illicit financial activity', [
        'AML procedures flagged suspicious transaction patterns automatically.',
        'Staff completed mandatory AML training before year end.',
      ]),
      vocab('KYC', '/ˌkeɪ waɪ ˈsiː/', 'Know Your Customer process verifying client identity and risk profile', [
        'Enhanced KYC requirements apply to high-net-worth clients.',
        'Digital KYC onboarding reduced account opening time significantly.',
      ]),
      vocab('fiduciary', '/fɪˈdjuːʃiəri/', 'A legal obligation to act in the best financial interest of clients', [
        'Fiduciary duty requires transparent fee disclosure to clients.',
        'The advisor operates under strict fiduciary standards.',
      ]),
      vocab('disclosure', '/dɪsˈkləʊʒər/', 'Required revelation of material financial information to stakeholders', [
        'Regulatory disclosure requirements were updated this quarter.',
        'Full disclosure of conflicts of interest builds client trust.',
      ]),
      vocab('sanctions', '/ˈsæŋkʃənz/', 'Government restrictions on financial transactions with certain entities', [
        'Sanctions screening blocked transactions with restricted parties.',
        'Compliance updated sanctions lists daily from regulatory sources.',
      ]),
    ]),
    concept('fin_007', 'Derivatives', 'advanced', ['fin_001', 'fin_002', 'fin_004'], [
      vocab('option', '/ˈɒpʃən/', 'A contract giving the right but not obligation to buy or sell an asset', [
        'Call options gained value as the underlying stock price rose.',
        'Options strategies can generate income in flat markets.',
      ]),
      vocab('futures', '/ˈfjuːtʃəz/', 'Contracts obligating purchase or sale of an asset at a predetermined price', [
        'Commodity futures hedged against raw material price increases.',
        'Futures markets provide price discovery for agricultural products.',
      ]),
      vocab('swap', '/swɒp/', 'An agreement to exchange cash flows between two parties', [
        'Interest rate swaps converted variable payments to fixed rates.',
        'Credit default swaps transferred counterparty risk to insurers.',
      ]),
      vocab('notional', '/ˈnəʊʃənəl/', 'The theoretical value underlying a derivatives contract', [
        'Total notional value of derivatives exceeded one trillion dollars.',
        'Notional amounts do not represent actual money at risk.',
      ]),
      vocab('counterparty', '/ˈkaʊntəpɑːti/', 'The other party in a financial contract or transaction', [
        'Counterparty risk assessment is mandatory before large trades.',
        'Central clearing reduced counterparty risk across the market.',
      ]),
    ]),
    concept('fin_008', 'Financial Reporting', 'intermediate', ['fin_004', 'fin_006'], [
      vocab('reconciliation', '/ˌrekənsɪliˈeɪʃən/', 'Comparing records to ensure consistency between accounts', [
        'Monthly reconciliation identified discrepancies in three accounts.',
        'Automated reconciliation reduced manual processing time by seventy percent.',
      ]),
      vocab('accrual', '/əˈkruːəl/', 'Recording revenue or expenses when earned or incurred, not when paid', [
        'Accrual accounting provides a more accurate financial picture.',
        'Accrued liabilities were properly disclosed in the quarterly report.',
      ]),
      vocab('amortization', '/əˌmɔːtɪˈzeɪʃən/', 'Gradually writing off the cost of an intangible asset over time', [
        'Loan amortization schedules show principal and interest breakdown.',
        'Goodwill amortization affected reported earnings this quarter.',
      ]),
      vocab('impairment', '/ɪmˈpeəmənt/', 'A reduction in the recoverable value of an asset below its book value', [
        'Asset impairment charges reduced net income significantly.',
        'Annual impairment testing is required for intangible assets.',
      ]),
      vocab('consolidation', '/kənˌsɒlɪˈdeɪʃən/', 'Combining financial statements of parent and subsidiary companies', [
        'Financial consolidation included twelve subsidiary entities.',
        'Consolidation adjustments eliminated intercompany transactions.',
      ]),
    ]),
    concept('fin_009', 'Merger and Acquisition', 'advanced', ['fin_001', 'fin_006', 'fin_008'], [
      vocab('due diligence', '/djuː ˈdɪlɪdʒəns/', 'Comprehensive investigation of a company before acquisition', [
        'Due diligence revealed undisclosed liabilities in the target company.',
        'Financial due diligence validated the acquisition valuation.',
      ]),
      vocab('synergy', '/ˈsɪnədʒi/', 'Additional value created by combining two companies', [
        'Cost synergies from the merger totaled fifty million annually.',
        'Revenue synergies will materialize over the next three years.',
      ]),
      vocab('valuation', '/ˌvæljuˈeɪʃən/', 'Determining the economic worth of a company or asset', [
        'DCF valuation supported the proposed acquisition price.',
        'Independent valuation confirmed fair market value of shares.',
      ]),
      vocab('leverage', '/ˈliːvərɪdʒ/', 'Using borrowed capital to increase potential investment returns', [
        'The acquisition was financed through leveraged buyout structure.',
        'Excessive leverage increased financial risk during the downturn.',
      ]),
      vocab('accretion', '/əˈkriːʃən/', 'Growth in earnings per share resulting from an acquisition', [
        'The deal is expected to be accretive to earnings within two years.',
        'Accretion analysis supported board approval of the transaction.',
      ]),
    ]),
    concept('fin_010', 'Asset Management', 'advanced', ['fin_005', 'fin_004', 'fin_006'], [
      vocab('custodian', '/kʌsˈtəʊdiən/', 'A financial institution holding and safeguarding client assets', [
        'The custodian reported all holdings to regulators monthly.',
        'Switching custodians required three months of transition planning.',
      ]),
      vocab('fiduciary', '/fɪˈdjuːʃiəri/', 'Managing assets with legal obligation to prioritize client interests', [
        'Fiduciary asset management demands transparent fee structures.',
        'The firm operates as a registered fiduciary investment advisor.',
      ]),
      vocab('mandate', '/ˈmændeɪt/', 'Specific investment guidelines agreed between client and manager', [
        'The investment mandate restricts exposure to emerging markets.',
        'ESG mandates increasingly influence asset allocation decisions.',
      ]),
      vocab('attribution', '/ˌætrɪˈbjuːʃən/', 'Analysis identifying sources of portfolio performance relative to benchmark', [
        'Performance attribution revealed sector selection drove outperformance.',
        'Risk attribution highlighted unexpected currency exposure.',
      ]),
      vocab('underweight', '/ˌʌndəˈweɪt/', 'Holding less of an asset than its weight in the benchmark index', [
        'The fund is underweight technology relative to the index.',
        'Strategic underweighting of bonds reduced interest rate risk.',
      ]),
    ]),
  ],
};

const technology = {
  id: 'tech',
  name: 'Technology',
  concepts: [
    concept('tech_001', 'Architecture', 'beginner', [], [
      vocab('microservice', '/ˈmaɪkrəʊˌsɜːvɪs/', 'An independently deployable software service in a distributed system', [
        'Microservice architecture enables teams to deploy independently.',
        'Each microservice handles a single business capability.',
      ]),
      vocab('monolith', '/ˈmɒnəlɪθ/', 'A single unified software application containing all functionality', [
        'Migrating from monolith to microservices improved scalability.',
        'The legacy monolith still handles core billing functions.',
      ]),
      vocab('middleware', '/ˈmɪdlweər/', 'Software connecting different applications and enabling data exchange', [
        'Message middleware handles asynchronous communication between services.',
        'API middleware translates requests between incompatible systems.',
      ]),
      vocab('abstraction', '/æbˈstrækʃən/', 'Hiding complex implementation details behind a simplified interface', [
        'Layered abstraction simplifies database access for developers.',
        'Good abstraction reduces coupling between system components.',
      ]),
      vocab('modularity', '/ˌmɒdʒəˈlærəti/', 'Designing systems as interchangeable independent components', [
        'Modularity allows replacing components without affecting the whole system.',
        'High modularity accelerated feature development cycles.',
      ]),
    ]),
    concept('tech_002', 'Development', 'beginner', [], [
      vocab('repository', '/rɪˈpɒzɪtəri/', 'A storage location for software code and version history', [
        'All developers commit code to the central repository daily.',
        'Repository access is restricted to authorized team members.',
      ]),
      vocab('refactoring', '/riːˈfæktərɪŋ/', 'Restructuring existing code without changing its external behavior', [
        'Refactoring improved code readability without introducing bugs.',
        'Regular refactoring prevents technical debt accumulation.',
      ]),
      vocab('debugging', '/diːˈbʌɡɪŋ/', 'Identifying and fixing errors or defects in software code', [
        'Debugging the memory leak took three days of investigation.',
        'Automated debugging tools accelerated issue resolution.',
      ]),
      vocab('iteration', '/ˌɪtəˈreɪʃən/', 'A single cycle of development producing an incremental improvement', [
        'Each sprint iteration delivers working software to stakeholders.',
        'Rapid iteration based on user feedback improved product quality.',
      ]),
      vocab('dependency', '/dɪˈpendənsi/', 'An external library or module required by a software project', [
        'Dependency updates must be tested before production deployment.',
        'Managing dependencies prevents security vulnerabilities in the codebase.',
      ]),
    ]),
    concept('tech_003', 'Deployment', 'intermediate', ['tech_002', 'tech_001'], [
      vocab('pipeline', '/ˈpaɪplaɪn/', 'An automated sequence of steps building and deploying software', [
        'The CI/CD pipeline deploys code to production within thirty minutes.',
        'Pipeline failures trigger immediate notifications to the team.',
      ]),
      vocab('rollback', '/ˈrəʊlbæk/', 'Reverting to a previous software version after a failed deployment', [
        'Automatic rollback activated when error rates exceeded threshold.',
        'The team executed rollback within five minutes of detecting issues.',
      ]),
      vocab('staging', '/ˈsteɪdʒɪŋ/', 'A pre-production environment mirroring production for testing', [
        'All releases are validated in staging before production deployment.',
        'Staging environment tests caught a critical bug before release.',
      ]),
      vocab('artifact', '/ˈɑːtɪfækt/', 'A packaged output produced by the build process ready for deployment', [
        'Build artifacts are stored in the container registry.',
        'Each artifact is tagged with version and commit hash.',
      ]),
      vocab('canary', '/kəˈneəri/', 'A deployment strategy releasing changes to a small subset of users first', [
        'Canary deployment limited blast radius of the new feature.',
        'Monitoring canary metrics guided the full rollout decision.',
      ]),
    ]),
    concept('tech_004', 'Scalability', 'intermediate', ['tech_001'], [
      vocab('horizontal', '/ˌhɒrɪˈzɒntəl/', 'Adding more machines to handle increased workload', [
        'Horizontal scaling added ten servers during the traffic surge.',
        'Load balancers distribute traffic across horizontally scaled instances.',
      ]),
      vocab('vertical', '/ˈvɜːtɪkəl/', 'Adding more power to existing machines to handle increased workload', [
        'Vertical scaling upgraded server memory from sixteen to sixty-four gigabytes.',
        'Vertical scaling has physical limits unlike horizontal approaches.',
      ]),
      vocab('bottleneck', '/ˈbɒtlnek/', 'A component limiting overall system performance or throughput', [
        'Database queries were identified as the primary performance bottleneck.',
        'Removing the bottleneck doubled application response speed.',
      ]),
      vocab('caching', '/ˈkæʃɪŋ/', 'Storing frequently accessed data for faster retrieval', [
        'Redis caching reduced database load by eighty percent.',
        'CDN caching delivers static content from edge locations globally.',
      ]),
      vocab('partitioning', '/pɑːˈtɪʃənɪŋ/', 'Dividing data across multiple storage systems for performance', [
        'Database partitioning improved query performance on large datasets.',
        'Horizontal partitioning distributes rows across multiple servers.',
      ]),
    ]),
    concept('tech_005', 'API Design', 'intermediate', ['tech_001', 'tech_002'], [
      vocab('endpoint', '/ˈendpɔɪnt/', 'A specific URL where an API can be accessed to perform operations', [
        'The REST endpoint returns user data in JSON format.',
        'Deprecated endpoints will be removed in the next major version.',
      ]),
      vocab('payload', '/ˈpeɪləʊd/', 'The actual data transmitted in an API request or response', [
        'Request payload must include valid authentication tokens.',
        'Compressed payloads reduced bandwidth consumption significantly.',
      ]),
      vocab('authentication', '/ɔːˌθentɪˈkeɪʃən/', 'Verifying identity of API consumers before granting access', [
        'OAuth authentication secures all third-party API integrations.',
        'API authentication tokens expire after twenty-four hours.',
      ]),
      vocab('rate limiting', '/reɪt ˈlɪmɪtɪŋ/', 'Restricting the number of API requests a client can make', [
        'Rate limiting prevents abuse of public API endpoints.',
        'Premium clients receive higher rate limiting thresholds.',
      ]),
      vocab('versioning', '/ˈvɜːʃənɪŋ/', 'Managing multiple API versions to maintain backward compatibility', [
        'API versioning ensures existing clients continue functioning.',
        'Semantic versioning communicates breaking changes clearly.',
      ]),
    ]),
    concept('tech_006', 'Cloud Computing', 'intermediate', ['tech_001', 'tech_003'], [
      vocab('serverless', '/ˈsɜːvərləs/', 'Cloud computing where the provider manages server infrastructure', [
        'Serverless functions scale automatically with incoming requests.',
        'Moving to serverless reduced infrastructure management overhead.',
      ]),
      vocab('provisioning', '/prəˈvɪʒənɪŋ/', 'Allocating cloud resources for application deployment', [
        'Infrastructure provisioning is fully automated through Terraform.',
        'Auto-provisioning scales resources based on demand patterns.',
      ]),
      vocab('multi-cloud', '/ˈmʌlti klaʊd/', 'Using services from multiple cloud providers simultaneously', [
        'Multi-cloud strategy avoids vendor lock-in risks.',
        'Data replication across multi-cloud environments ensures resilience.',
      ]),
      vocab('IaC', '/ˌaɪ eɪ ˈsiː/', 'Infrastructure as Code managing cloud resources through configuration files', [
        'IaC templates ensure consistent environment configuration.',
        'Version-controlled IaC enables reproducible infrastructure deployments.',
      ]),
      vocab('resilience', '/rɪˈzɪliəns/', 'The ability of a system to recover from failures and continue operating', [
        'Cloud resilience patterns include circuit breakers and retries.',
        'Multi-region deployment improved system resilience significantly.',
      ]),
    ]),
    concept('tech_007', 'DevOps', 'advanced', ['tech_002', 'tech_003'], [
      vocab('observability', '/əbˌzɜːvəˈbɪləti/', 'The ability to understand internal system state from external outputs', [
        'Full observability requires metrics, logs, and distributed tracing.',
        'Improved observability reduced mean time to detection by sixty percent.',
      ]),
      vocab('incident', '/ˈɪnsɪdənt/', 'An unplanned interruption or reduction in quality of an IT service', [
        'The incident response team resolved the outage within forty-five minutes.',
        'Post-incident reviews identify improvements for future responses.',
      ]),
      vocab('runbook', '/ˈrʌnbʊk/', 'Documented procedures for handling common operational tasks or incidents', [
        'The runbook guided on-call engineers through database recovery.',
        'Automated runbooks execute remediation steps without human intervention.',
      ]),
      vocab('SRE', '/ˌes ɑːr ˈiː/', 'Site Reliability Engineering applying software practices to operations', [
        'SRE principles balance feature development with system reliability.',
        'Error budgets guide decisions between velocity and stability.',
      ]),
      vocab('postmortem', '/ˈpəʊstmɔːtəm/', 'A structured review analyzing the causes and lessons of an incident', [
        'The blameless postmortem identified three actionable improvements.',
        'Postmortem findings are shared across all engineering teams.',
      ]),
    ]),
    concept('tech_008', 'Microservices', 'advanced', ['tech_001', 'tech_005'], [
      vocab('orchestration', '/ˌɔːkɪstreɪˈʃən/', 'Coordinating multiple services to accomplish a business process', [
        'Service orchestration manages complex multi-step workflows.',
        'Kubernetes orchestration handles container scheduling and scaling.',
      ]),
      vocab('service mesh', '/ˈsɜːvɪs meʃ/', 'Infrastructure layer managing service-to-service communication', [
        'The service mesh handles encryption and load balancing transparently.',
        'Istio service mesh provides observability across all microservices.',
      ]),
      vocab('circuit breaker', '/ˈsɜːkɪt ˈbreɪkər/', 'A pattern preventing cascading failures by stopping calls to failing services', [
        'Circuit breaker patterns prevented system-wide outage during database failure.',
        'The circuit breaker opened after five consecutive timeout errors.',
      ]),
      vocab('event-driven', '/ɪˈvent ˈdrɪvən/', 'Architecture where services communicate through asynchronous events', [
        'Event-driven design decouples producers from consumers effectively.',
        'Kafka enables event-driven communication between microservices.',
      ]),
      vocab('idempotency', '/ˌaɪdəmˈpɒtənsi/', 'Ensuring repeated identical requests produce the same result', [
        'Idempotency keys prevent duplicate payment processing.',
        'API design must guarantee idempotency for all mutation endpoints.',
      ]),
    ]),
    concept('tech_009', 'Code Review', 'intermediate', ['tech_002'], [
      vocab('pull request', '/pʊl rɪˈkwest/', 'A proposal to merge code changes reviewed by team members', [
        'Every pull request requires approval from two senior developers.',
        'The pull request description explains the motivation for changes.',
      ]),
      vocab('linting', '/ˈlɪntɪŋ/', 'Automated analysis identifying programming errors and style violations', [
        'Linting rules enforce consistent code style across the team.',
        'CI pipeline fails if linting detects any critical violations.',
      ]),
      vocab('coverage', '/ˈkʌvərɪdʒ/', 'The percentage of code exercised by automated tests', [
        'Test coverage must exceed eighty percent for production releases.',
        'Coverage reports highlight untested critical code paths.',
      ]),
      vocab('convention', '/kənˈvenʃən/', 'Agreed-upon standards for writing and organizing code', [
        'Naming conventions improve code readability for all team members.',
        'Following conventions reduces cognitive load during code reviews.',
      ]),
      vocab('regression', '/rɪˈɡreʃən/', 'A software bug where previously working functionality breaks', [
        'Regression tests caught the bug before it reached production.',
        'The regression was introduced by an unrelated configuration change.',
      ]),
    ]),
    concept('tech_010', 'Performance Optimization', 'advanced', ['tech_004', 'tech_001', 'tech_007'], [
      vocab('profiling', '/ˈprəʊfaɪlɪŋ/', 'Analyzing program execution to identify performance bottlenecks', [
        'CPU profiling revealed an inefficient sorting algorithm.',
        'Memory profiling detected a leak in the connection pool.',
      ]),
      vocab('optimization', '/ˌɒptɪmaɪˈzeɪʃən/', 'Improving system performance by reducing resource consumption', [
        'Query optimization reduced database response time by ninety percent.',
        'Frontend optimization improved page load speed to under two seconds.',
      ]),
      vocab('throughput', '/ˈθruːpʊt/', 'The amount of work completed by a system in a given time period', [
        'System throughput increased threefold after caching implementation.',
        'Load testing measured maximum sustainable throughput levels.',
      ]),
      vocab('latency', '/ˈleɪtənsi/', 'The time delay between a request and its response', [
        'P99 latency must remain below two hundred milliseconds.',
        'Latency spikes during peak hours triggered auto-scaling policies.',
      ]),
      vocab('benchmark', '/ˈbentʃmɑːk/', 'A standardized test measuring system performance against criteria', [
        'Performance benchmarks are run before every major release.',
        'The benchmark suite covers API, database, and rendering metrics.',
      ]),
    ]),
  ],
};

const automotive = {
  id: 'automotive',
  name: 'Automotive',
  concepts: [
    concept('auto_001', 'Design', 'beginner', [], [
      vocab('aerodynamic', '/ˌeərəʊdaɪˈnæmɪk/', 'Designed to reduce air resistance and improve fuel efficiency', [
        'The aerodynamic body shape reduced drag coefficient significantly.',
        'Wind tunnel testing validated the aerodynamic design improvements.',
      ]),
      vocab('chassis', '/ˈʃæsi/', 'The structural framework supporting all vehicle components', [
        'The lightweight chassis improved handling and fuel economy.',
        'Chassis rigidity affects both safety and driving dynamics.',
      ]),
      vocab('ergonomic', '/ˌɜːɡəˈnɒmɪk/', 'Designed for comfort and efficiency of human use', [
        'Ergonomic seat design reduces driver fatigue on long journeys.',
        'The ergonomic dashboard layout places controls within easy reach.',
      ]),
      vocab('prototype', '/ˈprəʊtətaɪp/', 'An early sample or model built to test a design concept', [
        'The design team built three prototypes before finalizing the model.',
        'Prototype testing revealed issues with door seal durability.',
      ]),
      vocab('CAD', '/ˌsiː eɪ ˈdiː/', 'Computer-Aided Design software for creating precise engineering models', [
        'CAD models accelerated collaboration between design and engineering teams.',
        'All components are designed using industry-standard CAD tools.',
      ]),
    ]),
    concept('auto_002', 'Manufacturing', 'beginner', ['auto_001'], [
      vocab('assembly', '/əˈsembli/', 'The process of putting together vehicle components on a production line', [
        'Assembly line automation increased production output by twenty percent.',
        'Just-in-time assembly reduces inventory holding costs.',
      ]),
      vocab('stamping', '/ˈstæmpɪŋ/', 'Shaping metal sheets into vehicle body panels using presses', [
        'Stamping operations produce door panels with micron-level precision.',
        'New stamping dies reduced material waste by twelve percent.',
      ]),
      vocab('welding', '/ˈweldɪŋ/', 'Joining metal parts using heat to create structural connections', [
        'Robotic welding ensures consistent joint quality across all units.',
        'Laser welding provides stronger bonds with less heat distortion.',
      ]),
      vocab('tolerance', '/ˈtɒlərəns/', 'The acceptable range of variation in manufactured part dimensions', [
        'Tight tolerances are critical for engine component fitment.',
        'Quality inspection verifies all parts meet specified tolerances.',
      ]),
      vocab('throughput', '/ˈθruːpʊt/', 'The number of vehicles produced in a given time period', [
        'Factory throughput reached five hundred units per day last month.',
        'Bottleneck analysis improved assembly line throughput by fifteen percent.',
      ]),
    ]),
    concept('auto_003', 'Performance', 'intermediate', ['auto_001'], [
      vocab('horsepower', '/ˈhɔːspaʊər/', 'A unit measuring the power output of an engine', [
        'The turbocharged engine delivers three hundred horsepower.',
        'Horsepower ratings vary between European and American measurement standards.',
      ]),
      vocab('torque', '/tɔːk/', 'Rotational force produced by the engine transmitted to the wheels', [
        'High torque at low RPM improves towing capability significantly.',
        'Electric motors deliver instant torque from standstill.',
      ]),
      vocab('acceleration', '/əkˌseləˈreɪʃən/', 'The rate at which a vehicle increases its speed', [
        'Zero to sixty acceleration takes just four point two seconds.',
        'Acceleration performance is a key selling point for sports models.',
      ]),
      vocab('suspension', '/səˈspenʃən/', 'The system of springs and dampers connecting wheels to the vehicle body', [
        'Adaptive suspension adjusts stiffness based on driving conditions.',
        'Suspension tuning balances comfort against handling performance.',
      ]),
      vocab('aerodynamics', '/ˌeərəʊdaɪˈnæmɪks/', 'The science of how air flow affects vehicle performance and efficiency', [
        'Active aerodynamics deploy spoilers at high speeds for stability.',
        'Aerodynamics improvements extended electric vehicle range by eight percent.',
      ]),
    ]),
    concept('auto_004', 'Safety', 'intermediate', ['auto_001', 'auto_002'], [
      vocab('airbag', '/ˈeəbæɡ/', 'A safety device that inflates rapidly to protect occupants during collision', [
        'Side airbags provide additional protection in lateral impacts.',
        'Airbag deployment sensors distinguish between minor and severe crashes.',
      ]),
      vocab('collision', '/kəˈlɪʒən/', 'An impact between a vehicle and another object or vehicle', [
        'Automatic emergency braking prevents low-speed collision scenarios.',
        'Collision avoidance systems reduced accident rates in fleet testing.',
      ]),
      vocab('restraint', '/rɪˈstreɪnt/', 'Safety equipment limiting occupant movement during a crash', [
        'Three-point restraints are mandatory in all passenger vehicles.',
        'Child restraint systems must meet strict safety certification standards.',
      ]),
      vocab('crumple', '/ˈkrʌmpəl/', 'Designed vehicle zones that deform to absorb crash energy', [
        'Crumple zones protect occupants by dissipating impact forces.',
        'Front crumple zone design was optimized through crash simulations.',
      ]),
      vocab('NCAP', '/ˈen kæp/', 'New Car Assessment Program rating vehicle safety performance', [
        'The model achieved five-star NCAP safety rating.',
        'NCAP testing includes adult and child occupant protection scores.',
      ]),
    ]),
    concept('auto_005', 'Powertrain', 'intermediate', ['auto_001', 'auto_003'], [
      vocab('transmission', '/trænzˈmɪʃən/', 'The system transferring engine power to the drive wheels', [
        'The eight-speed automatic transmission shifts smoothly under acceleration.',
        'Dual-clutch transmission provides faster gear changes than conventional types.',
      ]),
      vocab('drivetrain', '/ˈdraɪvtreɪn/', 'All components delivering power from engine to wheels', [
        'All-wheel drivetrain improves traction on slippery road surfaces.',
        'Drivetrain efficiency directly affects fuel consumption ratings.',
      ]),
      vocab('turbocharger', '/ˈtɜːbəʊˌtʃɑːdʒər/', 'A device forcing extra air into the engine to increase power output', [
        'The turbocharger boosts power without increasing engine displacement.',
        'Twin turbochargers eliminate lag in high-performance applications.',
      ]),
      vocab('differential', '/ˌdɪfəˈrenʃəl/', 'A gearbox allowing wheels to rotate at different speeds when turning', [
        'Limited-slip differential improves traction during aggressive cornering.',
        'Electronic differential control optimizes torque distribution dynamically.',
      ]),
      vocab('efficiency', '/ɪˈfɪʃənsi/', 'The ratio of useful power output to energy input in a powertrain', [
        'Powertrain efficiency improvements reduced emissions by twenty percent.',
        'Thermal efficiency of the new engine exceeds forty percent.',
      ]),
    ]),
    concept('auto_006', 'Electric Vehicle', 'advanced', ['auto_005', 'auto_004'], [
      vocab('battery', '/ˈbætəri/', 'An energy storage device powering electric vehicle motors', [
        'Battery capacity determines maximum driving range per charge.',
        'Solid-state battery technology promises faster charging and longer life.',
      ]),
      vocab('regenerative', '/rɪˈdʒenərətɪv/', 'Recovering kinetic energy during braking to recharge the battery', [
        'Regenerative braking extends range by up to twenty percent.',
        'One-pedal driving maximizes regenerative energy recovery.',
      ]),
      vocab('charging', '/ˈtʃɑːdʒɪŋ/', 'Supplying electrical energy to recharge an electric vehicle battery', [
        'Fast charging stations deliver eighty percent charge in thirty minutes.',
        'Home charging infrastructure is included with every vehicle purchase.',
      ]),
      vocab('kilowatt', '/ˈkɪləwɒt/', 'A unit of electrical power measuring motor output or charging rate', [
        'The motor produces two hundred fifty kilowatts of peak power.',
        'One hundred fifty kilowatt charging reduces downtime significantly.',
      ]),
      vocab('range', '/reɪndʒ/', 'The maximum distance an electric vehicle can travel on a full charge', [
        'EPA-rated range exceeds four hundred miles on a single charge.',
        'Cold weather reduces effective range by approximately twenty percent.',
      ]),
    ]),
    concept('auto_007', 'Autonomous Driving', 'advanced', ['auto_006', 'auto_004', 'auto_003'], [
      vocab('LiDAR', '/ˈlaɪdɑːr/', 'Light Detection and Ranging using lasers to map the surrounding environment', [
        'LiDAR sensors create detailed three-dimensional environment maps.',
        'Combining LiDAR with cameras improves object detection accuracy.',
      ]),
      vocab('autonomous', '/ɔːˈtɒnəməs/', 'Capable of operating without human intervention or control', [
        'Level three autonomous driving handles highway conditions automatically.',
        'Autonomous vehicle testing requires millions of simulated miles.',
      ]),
      vocab('perception', '/pəˈsepʃən/', 'The ability of a vehicle to detect and interpret its surroundings', [
        'Perception algorithms fuse data from multiple sensor types.',
        'Adverse weather conditions challenge perception system reliability.',
      ]),
      vocab('waypoint', '/ˈweɪpɔɪnt/', 'A defined location used for navigation routing in autonomous systems', [
        'The route planner calculates optimal waypoints for delivery vehicles.',
        'Dynamic waypoint adjustment responds to real-time traffic conditions.',
      ]),
      vocab('redundancy', '/rɪˈdʌndənsi/', 'Duplication of critical systems to ensure safe autonomous operation', [
        'Sensor redundancy ensures continued operation if one component fails.',
        'Computing redundancy meets functional safety ISO requirements.',
      ]),
    ]),
    concept('auto_008', 'Supply Chain', 'intermediate', ['auto_002'], [
      vocab('logistics', '/ləˈdʒɪstɪks/', 'Planning and executing the movement of materials and finished vehicles', [
        'Global logistics networks deliver parts to factories within forty-eight hours.',
        'Logistics optimization reduced shipping costs by twelve percent.',
      ]),
      vocab('procurement', '/prəˈkjʊəmənt/', 'The process of sourcing and purchasing materials and components', [
        'Strategic procurement secured long-term semiconductor supply agreements.',
        'Procurement teams negotiate pricing with tier-one suppliers annually.',
      ]),
      vocab('inventory', '/ˈɪnvəntəri/', 'Stock of parts and materials held for production and distribution', [
        'Lean inventory practices minimize warehouse holding costs.',
        'Inventory shortages halted production for three days last quarter.',
      ]),
      vocab('supplier', '/səˈplaɪər/', 'A company providing parts, materials, or services to the manufacturer', [
        'Supplier quality audits ensure components meet engineering specifications.',
        'Diversifying suppliers reduced single-source dependency risks.',
      ]),
      vocab('lead time', '/liːd taɪm/', 'The time between placing an order and receiving delivery', [
        'Semiconductor lead times extended to twenty-six weeks during the shortage.',
        'Reducing lead times requires closer supplier collaboration.',
      ]),
    ]),
    concept('auto_009', 'Quality Control', 'intermediate', ['auto_002', 'auto_004'], [
      vocab('inspection', '/ɪnˈspekʃən/', 'Systematic examination of vehicles or parts to verify quality standards', [
        'Final inspection checks over two hundred quality points per vehicle.',
        'Automated visual inspection detected paint defects with high accuracy.',
      ]),
      vocab('defect', '/ˈdiːfekt/', 'A flaw or imperfection that fails to meet quality specifications', [
        'Zero-defect policy drives continuous improvement in manufacturing.',
        'The defect rate dropped below fifty parts per million.',
      ]),
      vocab('warranty', '/ˈwɒrənti/', 'A guarantee covering repair or replacement of defective components', [
        'Extended warranty programs increase customer confidence in reliability.',
        'Warranty claim data identifies recurring quality issues for correction.',
      ]),
      vocab('recall', '/rɪˈkɔːl/', 'A manufacturer action to return and fix defective vehicles', [
        'The safety recall affected two hundred thousand vehicles nationwide.',
        'Rapid recall response protects brand reputation and customer safety.',
      ]),
      vocab('traceability', '/ˌtreɪsəˈbɪləti/', 'Ability to track component history from supplier to finished vehicle', [
        'Full traceability enabled rapid identification of affected recall units.',
        'Batch traceability links every component to its production records.',
      ]),
    ]),
    concept('auto_010', 'Product Launch', 'advanced', ['auto_001', 'auto_003', 'auto_009'], [
      vocab('unveiling', '/ʌnˈveɪlɪŋ/', 'The official public introduction of a new vehicle model', [
        'The global unveiling generated unprecedented media coverage.',
        'Virtual unveiling reached audiences in fifty countries simultaneously.',
      ]),
      vocab('positioning', '/pəˈzɪʃənɪŋ/', 'Defining how a product is perceived relative to competitors in the market', [
        'Premium positioning targets affluent buyers seeking luxury features.',
        'Market positioning differentiates the brand from mass-market competitors.',
      ]),
      vocab('dealer', '/ˈdiːlər/', 'An authorized business selling and servicing vehicles to consumers', [
        'Dealer network expansion added forty locations this year.',
        'Dealer training ensures consistent customer experience nationwide.',
      ]),
      vocab('MSRP', '/ˌem es ɑːr ˈpiː/', 'Manufacturer Suggested Retail Price for a new vehicle', [
        'MSRP for the base model starts at thirty-five thousand dollars.',
        'Dealers may offer discounts below MSRP during promotional periods.',
      ]),
      vocab('market penetration', '/ˈmɑːkɪt ˌpenɪˈtreɪʃən/', 'The extent to which a product gains adoption in its target market', [
        'Market penetration exceeded projections in the first sales quarter.',
        'Aggressive pricing strategy accelerated market penetration rates.',
      ]),
    ]),
  ],
};

const ontology = {
  version: '1.0',
  domains: [medical, telecom, finance, technology, automotive],
};

// Validate
const allConcepts = ontology.domains.flatMap(d => d.concepts);
const allIds = new Set(allConcepts.map(c => c.id));

for (const domain of ontology.domains) {
  const domainIds = new Set(domain.concepts.map(c => c.id));
  for (const concept of domain.concepts) {
    for (const prereq of concept.prerequisites) {
      if (!domainIds.has(prereq)) {
        throw new Error(`Invalid prerequisite ${prereq} in ${concept.id}`);
      }
    }
    if (concept.vocabulary.length < 5) {
      throw new Error(`Concept ${concept.id} has fewer than 5 vocabulary items`);
    }
  }
}

// Cycle detection
function hasCycle(domain) {
  const visited = new Set();
  const stack = new Set();
  const adj = Object.fromEntries(domain.concepts.map(c => [c.id, c.prerequisites]));

  function dfs(id) {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    for (const p of adj[id] || []) {
      if (dfs(p)) return true;
    }
    stack.delete(id);
    return false;
  }

  return domain.concepts.some(c => dfs(c.id));
}

for (const domain of ontology.domains) {
  if (hasCycle(domain)) throw new Error(`Cycle detected in domain ${domain.id}`);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(ontology, null, 2));

console.log(`Generated ontology.json:`);
console.log(`  Domains: ${ontology.domains.length}`);
console.log(`  Concepts: ${allConcepts.length}`);
console.log(`  Vocabulary: ${allConcepts.reduce((s, c) => s + c.vocabulary.length, 0)}`);
