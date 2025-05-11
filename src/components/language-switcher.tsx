"use client"

import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react'
import "../styles/actions.css"

type Language = {
  code: string
  name: string
  flag?: string
  countryCode?: string
}

const languages: Language[] = [
  { code: "en", name: "English", countryCode: "US" },
  { code: "he", name: "Hebrew", countryCode: "IL" },
  { code: "es", name: "Spanish", countryCode: "ES" },
]

// Define allowed language codes
type LanguageCode = "en" | "he" | "es"

// Comprehensive translations for the entire site
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navbar
    features: "Features",
    blog: "Blog",
    about: "About",
    projects: "Projects",
    pricing: "Pricing",
    signIn: "Sign in",
    signOut: "Sign out",
    getStarted: "Get started",
    dashboard: "Dashboard",

    // Home page
    heroTitle: "Build, Sell, and Collaborate — All in One Free Platform.",
    heroSubtitle:
      "Sell your digital products, find partners for startups, and grow together — with no commissions, no premium walls. 100% open, powered by community support.",
    startBrowsing: "Start browsing",
    watchDemo: "Watch demo",
    securePayments: "Secure Payments",
    securePaymentsDesc: "Protected transactions with escrow and milestone-based releases.",
    teamCollaboration: "Team Collaboration",
    teamCollaborationDesc: "Work seamlessly with developers and creators worldwide.",
    qualityAssurance: "Quality Assurance",
    qualityAssuranceDesc: "Built-in review processes and quality checks for all projects.",

    // About page
    aboutUs: "About Us",
    aboutDesc1:
      "DisPlan was born out of a simple yet powerful observation: every developer, every team, and every company faces common problems. We saw that platforms like GitHub are incredible, but they focus mainly on hosting code. What about everything else? What about making project management, collaboration, and deployment easier, more streamlined, and accessible to everyone — without walls of payments or confusing subscriptions?",
    aboutDesc2:
      "That's where DisPlan comes in. We're not here to replace existing platforms — we're here to upgrade the experience. Our mission is to provide an open, powerful, and entirely free platform where developers and teams can collaborate, manage, and grow their projects without barriers. Every feature on DisPlan is unlocked from day one. No paywalls. No hidden \"premium\" tiers. Whether you're a solo developer or a global company, you get the same powerful tools — completely free.",
    aboutDesc3:
      "Inspired by models like Blender, we believe that technology should be open to all. Our platform runs on modern infrastructure, powered by Supabase for our backend server layers, offering scalable, real-time data handling for our users. Additionally, we leverage AI technologies to help maintain, clean, and organize data across the platform, ensuring performance and reliability at every step.",
    founderInfo:
      "At the heart of DisPlan is our founder, Oral Revivo, whose vision drives everything we do. Oral started DisPlan after experiencing first-hand the fragmented tools and expensive ecosystems that developers face daily. His idea was simple: build a place where the best features are open to everyone, forever — without limits. That idea quickly grew, bringing together a community of like-minded developers and supporters who believe in a freer, better ecosystem.",
    aboutDesc4:
      "We got here because we listened. We listened to developers frustrated with half-solutions. We listened to companies tired of paying more for features that should be standard. And we acted. Today, DisPlan offers a seamless suite of features for code hosting, project management, collaboration, and more — all while being 100% free for every user.",
    aboutDesc5:
      "Of course, running an open platform like this requires resources. That's why we offer an optional donation system. Donations help sustain our servers, pay our team, and ensure we can keep building new features while keeping everything free for everyone. Supporting us is optional, but it directly strengthens our mission and keeps DisPlan alive and growing.",
    ourPromise: "At DisPlan, our promise is clear:",
    promise1: "No monthly subscriptions.",
    promise2: "No premium paywalls.",
    promise3: "Every company, every developer, gets the same access.",
    promise4: "Donations are welcome, but never required.",
    aboutDesc6:
      "We're proud to stand for a future where development tools are open, powerful, and accessible to all. And we invite you to be part of this journey.",
    openPlatform: "Open Platform",
    openPlatformDesc: "All features available to everyone, with no premium tiers or paywalls.",
    communityDriven: "Community Driven",
    communityDrivenDesc: "Built by developers, for developers, with community support at its core.",
    modernInfrastructure: "Modern Infrastructure",
    modernInfrastructureDesc: "Powered by Supabase and AI technologies for reliable, scalable performance.",
    explorePlan: "Explore DisPlan",
    supportMission: "Support Our Mission",

    // Terms page
    termsOfUse: "Terms of Use",
    introduction: "1. Introduction",
    introductionDesc:
      "Welcome to our platform, where creators, developers, and entrepreneurs collaborate, sell, and grow together. By accessing or using our services, you agree to these Terms of Use. Please read them carefully.",
    eligibility: "2. Eligibility",
    eligibilityDesc:
      "To use this platform, you must be at least 16 years old. By using our services, you confirm that you meet this requirement.",
    accountRegistration: "3. Account Registration",
    accountRegistrationDesc:
      "You are responsible for keeping your account secure. Use a strong password and do not share your login details. Any activity under your account is your responsibility.",
    communityGuidelines: "4. Community Guidelines",
    communityGuidelinesDesc:
      "All users are expected to respect one another. No harassment, hate speech, or fraudulent behavior will be tolerated. Violations may lead to account suspension.",
    digitalProductSales: "5. Digital Product Sales",
    digitalProductSalesDesc:
      "You may list and sell digital products. No commissions are charged. However, it is your duty to ensure your products comply with intellectual property laws.",
    teamCollaborations: "6. Team Collaborations",
    teamCollaborationsDesc:
      "When collaborating with others, users must clearly define terms such as payment, deadlines, and responsibilities. Our platform does not mediate disputes.",
    paymentsFees: "7. Payments & Fees",
    paymentsFeesDesc:
      "Payments between users are protected through escrow and milestone systems. We do not charge transaction fees, but payment processors may apply their own fees.",
    qualityAssuranceTerms: "8. Quality Assurance",
    qualityAssuranceTermsDesc:
      "Users must maintain a standard of quality. False claims or substandard work can result in penalties, including removal of listings.",
    platformUsage: "9. Platform Usage",
    platformUsageDesc:
      "You may not misuse our services, attempt to hack, overload, or reverse engineer the platform. Respect the system and its users.",
    termination: "10. Termination",
    terminationDesc:
      "We reserve the right to suspend or terminate accounts that violate our terms or put the community at risk.",
    changesToTerms: "11. Changes to Terms",
    changesToTermsDesc:
      "We may update these terms as the platform evolves. We will notify users of significant changes.",
    limitationOfLiability: "12. Limitation of Liability",
    limitationOfLiabilityDesc:
      "We are not liable for disputes between users or damages arising from the use of our services.",
    governingLaw: "13. Governing Law",
    governingLawDesc: "These terms are governed by the laws of your local jurisdiction.",
    contactUs: "14. Contact Us",
    contactUsDesc: "For questions about these terms, please contact our support team.",
    viewPrivacyPolicy: "View Privacy Policy",
    backToHome: "Back to Home",

    // Privacy page
    privacyPolicy: "Privacy Policy",
    informationWeCollect: "2. Information We Collect",
    informationWeCollectDesc:
      "We collect information when you register, such as your email address, username, and payment details (only processed, not stored). We also collect usage data for improving our services.",
    howWeUseYourInformation: "3. How We Use Your Information",
    howWeUseYourInformationDesc: "We use your data to:",
    provideServices: "Provide and improve our services",
    processTransactions: "Process transactions",
    communicateWithYou: "Communicate with you about updates and offers",
    preventFraud: "Prevent fraud and maintain security",
    cookiesAndTracking: "4. Cookies and Tracking",
    cookiesAndTrackingDesc:
      "We use cookies to enhance user experience, remember preferences, and analyze site traffic. You can disable cookies in your browser settings.",
    sharingYourData: "5. Sharing Your Data",
    sharingYourDataDesc:
      "We do not sell your personal data. We only share information with payment processors and analytics services necessary to operate the platform.",
    dataRetention: "6. Data Retention",
    dataRetentionDesc:
      "We keep your information as long as your account is active. You can request deletion of your account and data at any time.",
    userRights: "7. User Rights",
    userRightsDesc: "You have the right to:",
    accessData: "Access the data we hold about you",
    correctInaccuracies: "Correct inaccuracies",
    requestDeletion: "Request deletion",
    objectToProcessing: "Object to processing",
    dataSecurity: "8. Data Security",
    dataSecurityDesc:
      "We implement security measures to protect your information, including encryption and secure servers.",
    thirdPartyServices: "9. Third-Party Services",
    thirdPartyServicesDesc:
      "We may link to or use third-party services (e.g., payment gateways). Please review their privacy policies separately.",
    childrensPrivacy: "10. Children's Privacy",
    childrensPrivacyDesc:
      "Our services are not intended for children under 16. We do not knowingly collect information from minors.",
    changesToPolicy: "11. Changes to This Policy",
    changesToPolicyDesc:
      "We may update this policy. If significant changes occur, we will notify you through the platform.",
    contactUsPrivacy: "12. Contact Us",
    contactUsPrivacyDesc: "If you have questions about this privacy policy, please contact our support team.",
    viewTermsOfUse: "View Terms of Use",

    // Footer
    company: "Company",
    careers: "Careers",
    resources: "Resources",
    documentation: "Documentation",
    help: "Help Center",
    guides: "Guides",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    connect: "Connect",
    twitter: "Twitter",
    discord: "Discord",
    github: "GitHub",
    copyright: "© 2024 DisPlan. All rights reserved.",

    // Info box
    infoBoxText:
      "No hidden fees, no commissions, no extra charges. Our platform stays free thanks to community support and optional donations. Help us keep it growing — for everyone.",
  },
  he: {
    // Navbar
    features: "תכונות",
    blog: "בלוג",
    about: "אודות",
    projects: "פרויקטים",
    pricing: "תמחור",
    signIn: "התחברות",
    signOut: "התנתקות",
    getStarted: "להתחיל",
    dashboard: "לוח בקרה",

    // Home page
    heroTitle: "בנה, מכור ושתף פעולה — הכל בפלטפורמה חינמית אחת.",
    heroSubtitle:
      "מכור את המוצרים הדיגיטליים שלך, מצא שותפים לסטארטאפים, וצמחו יחד — ללא עמלות, ללא חומות פרימיום. 100% פתוח, מופעל על ידי תמיכת הקהילה.",
    startBrowsing: "התחל לגלוש",
    watchDemo: "צפה בהדגמה",
    securePayments: "תשלומים מאובטחים",
    securePaymentsDesc: "עסקאות מוגנות עם נאמנות ושחרור מבוסס אבני דרך.",
    teamCollaboration: "שיתוף פעולה בצוות",
    teamCollaborationDesc: "עבוד בצורה חלקה עם מפתחים ויוצרים מכל העולם.",
    qualityAssurance: "הבטחת איכות",
    qualityAssuranceDesc: "תהליכי ביקורת ובדיקות איכות מובנים לכל הפרויקטים.",

    // About page
    aboutUs: "אודותינו",
    aboutDesc1:
      "DisPlan נולד מתוך תובנה פשוטה אך חזקה: כל מפתח, כל צוות, וכל חברה מתמודדים עם בעיות נפוצות. ראינו שפלטפורמות כמו GitHub הן מדהימות, אבל הן מתמקדות בעיקר באירוח קוד. מה לגבי כל השאר? מה לגבי הפיכת ניהול פרויקטים, שיתוף פעולה ופריסה לקלים יותר, יעילים יותר ונגישים לכולם — ללא חומות של תשלומים או מנויים מבלבלים?",
    aboutDesc2:
      'זה המקום שבו DisPlan נכנס. אנחנו לא כאן כדי להחליף פלטפורמות קיימות — אנחנו כאן כדי לשדרג את החוויה. המשימה שלנו היא לספק פלטפורמה פתוחה, חזקה ולחלוטין חינמית שבה מפתחים וצוותים יכולים לשתף פעולה, לנהל ולפתח את הפרויקטים שלהם ללא מחסומים. כל תכונה ב-DisPlan פתוחה מהיום הראשון. ללא חומות תשלום. ללא רמות "פרימיום" נסתרות. בין אם אתה מפתח יחיד או חברה גלובלית, אתה מקבל את אותם כלים חזקים — לחלוטין בחינם.',
    aboutDesc3:
      "בהשראת מודלים כמו Blender, אנו מאמינים שטכנולוגיה צריכה להיות פתוחה לכולם. הפלטפורמה שלנו פועלת על תשתית מודרנית, מופעלת על ידי Supabase עבור שכבות השרת האחורי שלנו, ומציעה טיפול נתונים מדרגי ובזמן אמת למשתמשים שלנו. בנוסף, אנו מנצלים טכנולוגיות AI כדי לעזור לתחזק, לנקות ולארגן נתונים בכל הפלטפורמה, ולהבטיח ביצועים ואמינות בכל שלב.",
    founderInfo:
      "בלב של DisPlan נמצא המייסד שלנו, אוראל רביבו, שהחזון שלו מניע את כל מה שאנחנו עושים. אוראל התחיל את DisPlan לאחר שחווה באופן ישיר את הכלים המפוצלים והמערכות האקולוגיות היקרות שמפתחים מתמודדים איתם מדי יום. הרעיון שלו היה פשוט: לבנות מקום שבו התכונות הטובות ביותר פתוחות לכולם, לתמיד — ללא הגבלות. הרעיון הזה צמח במהירות, והביא יחד קהילה של מפתחים ותומכים בעלי דעה דומה שמאמינים במערכת אקולוגית חופשית וטובה יותר.",
    aboutDesc4:
      "הגענו לכאן כי הקשבנו. הקשבנו למפתחים מתוסכלים עם פתרונות חלקיים. הקשבנו לחברות שעייפו מלשלם יותר עבור תכונות שצריכות להיות סטנדרטיות. ופעלנו. היום, DisPlan מציעה חבילה חלקה של תכונות לאירוח קוד, ניהול פרויקטים, שיתוף פעולה ועוד — כל זאת תוך שהיא 100% חינמית לכל משתמש.",
    aboutDesc5:
      "כמובן, הפעלת פלטפורמה פתוחה כזו דורשת משאבים. לכן אנו מציעים מערכת תרומות אופציונלית. תרומות עוזרות לקיים את השרתים שלנו, לשלם לצוות שלנו, ולהבטיח שנוכל להמשיך לבנות תכונות חדשות תוך שמירה על הכל חינמי לכולם. תמיכה בנו היא אופציונלית, אבל היא מחזקת ישירות את המשימה שלנו ושומרת על DisPlan חי וצומח.",
    ourPromise: "ב-DisPlan, ההבטחה שלנו ברורה:",
    promise1: "אין מנויים חודשיים.",
    promise2: "אין חומות תשלום פרימיום.",
    promise3: "כל חברה, כל מפתח, מקבלים את אותה גישה.",
    promise4: "תרומות מתקבלות בברכה, אבל לעולם לא נדרשות.",
    aboutDesc6:
      "אנחנו גאים לעמוד למען עתיד שבו כלי פיתוח הם פתוחים, חזקים ונגישים לכולם. ואנו מזמינים אותך להיות חלק ממסע זה.",
    openPlatform: "פלטפורמה פתוחה",
    openPlatformDesc: "כל התכונות זמינות לכולם, ללא רמות פרימיום או חומות תשלום.",
    communityDriven: "מונע קהילה",
    communityDrivenDesc: "נבנה על ידי מפתחים, עבור מפתחים, עם תמיכת הקהילה בליבו.",
    modernInfrastructure: "תשתית מודרנית",
    modernInfrastructureDesc: "מופעל על ידי Supabase וטכנולוגיות AI לביצועים אמינים ומדרגיים.",
    explorePlan: "חקור את DisPlan",
    supportMission: "תמוך במשימה שלנו",

    // Terms page
    termsOfUse: "תנאי שימוש",
    introduction: "1. מבוא",
    introductionDesc:
      "ברוכים הבאים לפלטפורמה שלנו, שבה יוצרים, מפתחים ויזמים משתפים פעולה, מוכרים וצומחים יחד. על ידי גישה או שימוש בשירותים שלנו, אתה מסכים לתנאי שימוש אלה. אנא קרא אותם בעיון.",
    eligibility: "2. זכאות",
    eligibilityDesc:
      "כדי להשתמש בפלטפורמה זו, עליך להיות בן 16 לפחות. על ידי שימוש בשירותים שלנו, אתה מאשר שאתה עומד בדרישה זו.",
    accountRegistration: "3. רישום חשבון",
    accountRegistrationDesc:
      "אתה אחראי לשמור על אבטחת החשבון שלך. השתמש בסיסמה חזקה ואל תשתף את פרטי ההתחברות שלך. כל פעילות תחת החשבון שלך היא באחריותך.",
    communityGuidelines: "4. הנחיות קהילה",
    communityGuidelinesDesc:
      "כל המשתמשים מצופים לכבד זה את זה. לא יתקבלו הטרדה, דיבור שנאה או התנהגות מרמה. הפרות עלולות להוביל להשעיית חשבון.",
    digitalProductSales: "5. מכירות מוצרים דיגיטליים",
    digitalProductSalesDesc:
      "אתה רשאי לרשום ולמכור מוצרים דיגיטליים. לא נגבות עמלות. עם זאת, זוהי חובתך להבטיח שהמוצרים שלך עומדים בחוקי קניין רוחני.",
    teamCollaborations: "6. שיתופי פעולה בצוות",
    teamCollaborationsDesc:
      "בעת שיתוף פעולה עם אחרים, משתמשים חייבים להגדיר בבירור תנאים כגון תשלום, מועדי יעד ואחריות. הפלטפורמה שלנו אינה מתווכת בסכסוכים.",
    paymentsFees: "7. תשלומים ועמלות",
    paymentsFeesDesc:
      "תשלומים בין משתמשים מוגנים באמצעות מערכות נאמנות ואבני דרך. אנו לא גובים עמלות עסקה, אך מעבדי תשלומים עשויים להחיל את העמלות שלהם.",
    qualityAssuranceTerms: "8. הבטחת איכות",
    qualityAssuranceTermsDesc:
      "משתמשים חייבים לשמור על רמת איכות. טענות שקריות או עבודה ברמה נמוכה עלולות להוביל לעונשים, כולל הסרת רישומים.",
    platformUsage: "9. שימוש בפלטפורמה",
    platformUsageDesc:
      "אינך רשאי לעשות שימוש לרעה בשירותים שלנו, לנסות לפרוץ, להעמיס יתר על המידה או להנדס לאחור את הפלטפורמה. כבד את המערכת ואת משתמשיה.",
    termination: "10. סיום",
    terminationDesc: "אנו שומרים לעצמנו את הזכות להשעות או לסיים חשבונות שמפרים את התנאים שלנו או מסכנים את הקהילה.",
    changesToTerms: "11. שינויים בתנאים",
    changesToTermsDesc: "אנו עשויים לעדכן תנאים אלה ככל שהפלטפורמה מתפתחת. אנו נודיע למשתמשים על שינויים משמעותיים.",
    limitationOfLiability: "12. הגבלת אחריות",
    limitationOfLiabilityDesc: "איננו אחראים לסכסוכים בין משתמשים או נזקים הנובעים משימוש בשירותים שלנו.",
    governingLaw: "13. חוק שולט",
    governingLawDesc: "תנאים אלה נשלטים על ידי חוקי השיפוט המקומי שלך.",
    contactUs: "14. צור קשר",
    contactUsDesc: "לשאלות לגבי תנאים אלה, אנא צור קשר עם צוות התמיכה שלנו.",
    viewPrivacyPolicy: "צפה במדיניות הפרטיות",
    backToHome: "חזרה לדף הבית",

    // Privacy page
    privacyPolicy: "מדיניות פרטיות",
    informationWeCollect: "2. מידע שאנו אוספים",
    informationWeCollectDesc:
      "אנו אוספים מידע כאשר אתה נרשם, כגון כתובת האימייל שלך, שם המשתמש ופרטי תשלום (רק מעובדים, לא מאוחסנים). אנו גם אוספים נתוני שימוש לשיפור השירותים שלנו.",
    howWeUseYourInformation: "3. כיצד אנו משתמשים במידע שלך",
    howWeUseYourInformationDesc: "אנו משתמשים בנתונים שלך כדי:",
    provideServices: "לספק ולשפר את השירותים שלנו",
    processTransactions: "לעבד עסקאות",
    communicateWithYou: "לתקשר איתך לגבי עדכונים והצעות",
    preventFraud: "למנוע הונאה ולשמור על אבטחה",
    cookiesAndTracking: "4. עוגיות ומעקב",
    cookiesAndTrackingDesc:
      "אנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש, לזכור העדפות ולנתח את תנועת האתר. אתה יכול להשבית עוגיות בהגדרות הדפדפן שלך.",
    sharingYourData: "5. שיתוף הנתונים שלך",
    sharingYourDataDesc:
      "אנחנו לא מוכרים את הנתונים האישיים שלך. אנו משתפים מידע רק עם מעבדי תשלומים ושירותי אנליטיקה הנחוצים להפעלת הפלטפורמה.",
    dataRetention: "6. שמירת נתונים",
    dataRetentionDesc:
      "אנו שומרים את המידע שלך כל עוד החשבון שלך פעיל. אתה יכול לבקש מחיקה של החשבון והנתונים שלך בכל עת.",
    userRights: "7. זכויות משתמש",
    userRightsDesc: "יש לך את הזכות:",
    accessData: "לגשת לנתונים שאנו מחזיקים עליך",
    correctInaccuracies: "לתקן אי-דיוקים",
    requestDeletion: "לבקש מחיקה",
    objectToProcessing: "להתנגד לעיבוד",
    dataSecurity: "8. אבטחת נתונים",
    dataSecurityDesc: "אנו מיישמים אמצעי אבטחה להגנה על המידע שלך, כולל הצפנה ושרתים מאובטחים.",
    thirdPartyServices: "9. שירותי צד שלישי",
    thirdPartyServicesDesc:
      "אנו עשויים לקשר או להשתמש בשירותי צד שלישי (למשל, שערי תשלום). אנא סקור את מדיניות הפרטיות שלהם בנפרד.",
    childrensPrivacy: "10. פרטיות ילדים",
    childrensPrivacyDesc: "השירותים שלנו אינם מיועדים לילדים מתחת לגיל 16. איננו אוספים ביודעין מידע מקטינים.",
    changesToPolicy: "11. שינויים במדיניות זו",
    changesToPolicyDesc: "אנו עשויים לעדכן מדיניות זו. אם יחולו שינויים משמעותיים, נודיע לך דרך הפלטפורמה.",
    contactUsPrivacy: "12. צור קשר",
    contactUsPrivacyDesc: "אם יש לך שאלות לגבי מדיניות פרטיות זו, אנא צור קשר עם צוות התמיכה שלנו.",
    viewTermsOfUse: "צפה בתנאי השימוש",

    // Footer
    company: "חברה",
    careers: "קריירה",
    resources: "משאבים",
    documentation: "תיעוד",
    help: "מרכז עזרה",
    guides: "מדריכים",
    legal: "משפטי",
    privacy: "מדיניות פרטיות",
    terms: "תנאי שירות",
    cookies: "מדיניות עוגיות",
    connect: "התחבר",
    twitter: "טוויטר",
    discord: "דיסקורד",
    github: "גיטהאב",
    copyright: "© 2024 DisPlan. כל הזכויות שמורות.",

    // Info box
    infoBoxText:
      "אין עמלות נסתרות, אין עמלות, אין חיובים נוספים. הפלטפורמה שלנו נשארת חינמית הודות לתמיכת הקהילה ותרומות אופציונליות. עזור לנו לשמור עליה צומחת — עבור כולם.",
  },
  es: {
    // Navbar
    features: "Características",
    blog: "Blog",
    about: "Acerca de",
    projects: "proyectos",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    getStarted: "Comenzar",
    dashboard: "Panel",

    // Home page
    heroTitle: "Construye, Vende y Colabora — Todo en Una Plataforma Gratuita.",
    heroSubtitle:
      "Vende tus productos digitales, encuentra socios para startups y crezcan juntos — sin comisiones, sin límites y sin muros premium. 100% abierto, impulsado por el apoyo de la comunidad.",
    startBrowsing: "Empezar a navegar",
    watchDemo: "Ver demo",
    securePayments: "Pagos Seguros",
    securePaymentsDesc: "Transacciones protegidas con depósito en garantía y liberaciones basadas en hitos.",
    teamCollaboration: "Colaboración en Equipo",
    teamCollaborationDesc: "Trabaja sin problemas con desarrolladores y creadores de todo el mundo.",
    qualityAssurance: "Garantía de Calidad",
    qualityAssuranceDesc: "Procesos de revisión incorporados y controles de calidad para todos los proyectos.",

    // About page
    aboutUs: "Sobre Nosotros",
    aboutDesc1:
      "DisPlan nació de una observación simple pero poderosa: cada desarrollador, cada equipo y cada empresa enfrenta problemas comunes. Vimos que plataformas como GitHub son increíbles, pero se centran principalmente en alojar código. ¿Qué pasa con todo lo demás? ¿Qué hay de hacer que la gestión de proyectos, la colaboración y el despliegue sean más fáciles, más eficientes y accesibles para todos, sin muros de pagos o suscripciones confusas?",
    aboutDesc2:
      'Ahí es donde entra DisPlan. No estamos aquí para reemplazar las plataformas existentes, estamos aquí para mejorar la experiencia. Nuestra misión es proporcionar una plataforma abierta, potente y completamente gratuita donde los desarrolladores y equipos puedan colaborar, gestionar y hacer crecer sus proyectos sin barreras. Cada característica en DisPlan está desbloqueada desde el primer día. Sin muros de pago. Sin niveles "premium" ocultos. Ya sea que seas un desarrollador independiente o una empresa global, obtienes las mismas herramientas potentes, completamente gratis.',
    aboutDesc3:
      "Inspirados en modelos como Blender, creemos que la tecnología debe estar abierta a todos. Nuestra plataforma funciona con infraestructura moderna, impulsada por Supabase para nuestras capas de servidor backend, ofreciendo manejo de datos escalable y en tiempo real para nuestros usuarios. Además, aprovechamos las tecnologías de IA para ayudar a mantener, limpiar y organizar datos en toda la plataforma, asegurando rendimiento y fiabilidad en cada paso.",
    founderInfo:
      "En el corazón de DisPlan está nuestro fundador, Oral Revivo, cuya visión impulsa todo lo que hacemos. Oral comenzó DisPlan después de experimentar de primera mano las herramientas fragmentadas y los ecosistemas costosos que los desarrolladores enfrentan a diario. Su idea era simple: construir un lugar donde las mejores características estén abiertas a todos, para siempre, sin límites. Esa idea creció rápidamente, reuniendo a una comunidad de desarrolladores y partidarios de ideas afines que creen en un ecosistema más libre y mejor.",
    aboutDesc4:
      "Llegamos aquí porque escuchamos. Escuchamos a los desarrolladores frustrados con soluciones a medias. Escuchamos a las empresas cansadas de pagar más por características que deberían ser estándar. Y actuamos. Hoy, DisPlan ofrece un conjunto perfecto de características para alojamiento de código, gestión de proyectos, colaboración y más, todo mientras es 100% gratuito para cada usuario.",
    aboutDesc5:
      "Por supuesto, ejecutar una plataforma abierta como esta requiere recursos. Es por eso que ofrecemos un sistema de donación opcional. Las donaciones ayudan a mantener nuestros servidores, pagar a nuestro equipo y asegurar que podamos seguir construyendo nuevas características mientras mantenemos todo gratuito para todos. Apoyarnos es opcional, pero fortalece directamente nuestra misión y mantiene a DisPlan vivo y creciendo.",
    ourPromise: "En DisPlan, nuestra promesa es clara:",
    promise1: "Sin suscripciones mensuales.",
    promise2: "Sin muros de pago premium.",
    promise3: "Cada empresa, cada desarrollador, obtiene el mismo acceso.",
    promise4: "Las donaciones son bienvenidas, pero nunca requeridas.",
    aboutDesc6:
      "Estamos orgullosos de defender un futuro donde las herramientas de desarrollo sean abiertas, potentes y accesibles para todos. Y te invitamos a ser parte de este viaje.",
    openPlatform: "Plataforma Abierta",
    openPlatformDesc: "Todas las características disponibles para todos, sin niveles premium ni muros de pago.",
    communityDriven: "Impulsado por la Comunidad",
    communityDrivenDesc:
      "Construido por desarrolladores, para desarrolladores, con el apoyo de la comunidad en su núcleo.",
    modernInfrastructure: "Infraestructura Moderna",
    modernInfrastructureDesc: "Impulsado por Supabase y tecnologías de IA para un rendimiento fiable y escalable.",
    explorePlan: "Explorar DisPlan",
    supportMission: "Apoyar Nuestra Misión",

    // Terms page
    termsOfUse: "Términos de Uso",
    introduction: "1. Introducción",
    introductionDesc:
      "Bienvenido a nuestra plataforma, donde creadores, desarrolladores y emprendedores colaboran, venden y crecen juntos. Al acceder o utilizar nuestros servicios, aceptas estos Términos de Uso. Por favor, léelos cuidadosamente.",
    eligibility: "2. Elegibilidad",
    eligibilityDesc:
      "Para usar esta plataforma, debes tener al menos 16 años. Al usar nuestros servicios, confirmas que cumples con este requisito.",
    accountRegistration: "3. Registro de Cuenta",
    accountRegistrationDesc:
      "Eres responsable de mantener tu cuenta segura. Usa una contraseña fuerte y no compartas tus datos de inicio de sesión. Cualquier actividad bajo tu cuenta es tu responsabilidad.",
    communityGuidelines: "4. Directrices de la Comunidad",
    communityGuidelinesDesc:
      "Se espera que todos los usuarios se respeten mutuamente. No se tolerará acoso, discurso de odio o comportamiento fraudulento. Las violaciones pueden llevar a la suspensión de la cuenta.",
    digitalProductSales: "5. Ventas de Productos Digitales",
    digitalProductSalesDesc:
      "Puedes listar y vender productos digitales. No se cobran comisiones. Sin embargo, es tu deber asegurarte de que tus productos cumplan con las leyes de propiedad intelectual.",
    teamCollaborations: "6. Colaboraciones en Equipo",
    teamCollaborationsDesc:
      "Al colaborar con otros, los usuarios deben definir claramente términos como pago, plazos y responsabilidades. Nuestra plataforma no media en disputas.",
    paymentsFees: "7. Pagos y Tarifas",
    paymentsFeesDesc:
      "Los pagos entre usuarios están protegidos a través de sistemas de depósito en garantía y hitos. No cobramos tarifas de transacción, pero los procesadores de pago pueden aplicar sus propias tarifas.",
    qualityAssuranceTerms: "8. Garantía de Calidad",
    qualityAssuranceTermsDesc:
      "Los usuarios deben mantener un estándar de calidad. Las afirmaciones falsas o el trabajo de baja calidad pueden resultar en penalizaciones, incluida la eliminación de listados.",
    platformUsage: "9. Uso de la Plataforma",
    platformUsageDesc:
      "No puedes hacer mal uso de nuestros servicios, intentar hackear, sobrecargar o realizar ingeniería inversa de la plataforma. Respeta el sistema y sus usuarios.",
    termination: "10. Terminación",
    terminationDesc:
      "Nos reservamos el derecho de suspender o terminar cuentas que violen nuestros términos o pongan en riesgo a la comunidad.",
    changesToTerms: "11. Cambios en los Términos",
    changesToTermsDesc:
      "Podemos actualizar estos términos a medida que la plataforma evoluciona. Notificaremos a los usuarios de cambios significativos.",
    limitationOfLiability: "12. Limitación de Responsabilidad",
    limitationOfLiabilityDesc:
      "No somos responsables de disputas entre usuarios o daños derivados del uso de nuestros servicios.",
    governingLaw: "13. Ley Aplicable",
    governingLawDesc: "Estos términos se rigen por las leyes de tu jurisdicción local.",
    contactUs: "14. Contáctanos",
    contactUsDesc: "Para preguntas sobre estos términos, por favor contacta a nuestro equipo de soporte.",
    viewPrivacyPolicy: "Ver Política de Privacidad",
    backToHome: "Volver al Inicio",

    // Privacy page
    privacyPolicy: "Política de Privacidad",
    informationWeCollect: "2. Información que Recopilamos",
    informationWeCollectDesc:
      "Recopilamos información cuando te registras, como tu dirección de correo electrónico, nombre de usuario y detalles de pago (solo procesados, no almacenados). También recopilamos datos de uso para mejorar nuestros servicios.",
    howWeUseYourInformation: "3. Cómo Usamos Tu Información",
    howWeUseYourInformationDesc: "Usamos tus datos para:",
    provideServices: "Proporcionar y mejorar nuestros servicios",
    processTransactions: "Procesar transacciones",
    communicateWithYou: "Comunicarnos contigo sobre actualizaciones y ofertas",
    preventFraud: "Prevenir fraudes y mantener la seguridad",
    cookiesAndTracking: "4. Cookies y Seguimiento",
    cookiesAndTrackingDesc:
      "Usamos cookies para mejorar la experiencia del usuario, recordar preferencias y analizar el tráfico del sitio. Puedes desactivar las cookies en la configuración de tu navegador.",
    sharingYourData: "5. Compartiendo Tus Datos",
    sharingYourDataDesc:
      "No vendemos tus datos personales. Solo compartimos información con procesadores de pago y servicios de análisis necesarios para operar la plataforma.",
    dataRetention: "6. Retención de Datos",
    dataRetentionDesc:
      "Mantenemos tu información mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.",
    userRights: "7. Derechos del Usuario",
    userRightsDesc: "Tienes derecho a:",
    accessData: "Acceder a los datos que tenemos sobre ti",
    correctInaccuracies: "Corregir inexactitudes",
    requestDeletion: "Solicitar eliminación",
    objectToProcessing: "Objetar al procesamiento",
    dataSecurity: "8. Seguridad de Datos",
    dataSecurityDesc:
      "Implementamos medidas de seguridad para proteger tu información, incluyendo encriptación y servidores seguros.",
    thirdPartyServices: "9. Servicios de Terceros",
    thirdPartyServicesDesc:
      "Podemos enlazar o usar servicios de terceros (por ejemplo, pasarelas de pago). Por favor, revisa sus políticas de privacidad por separado.",
    childrensPrivacy: "10. Privacidad de los Niños",
    childrensPrivacyDesc:
      "Nuestros servicios no están destinados a niños menores de 16 años. No recopilamos a sabiendas información de menores.",
    changesToPolicy: "11. Cambios en Esta Política",
    changesToPolicyDesc:
      "Podemos actualizar esta política. Si ocurren cambios significativos, te notificaremos a través de la plataforma.",
    contactUsPrivacy: "12. Contáctanos",
    contactUsPrivacyDesc:
      "Si tienes preguntas sobre esta política de privacidad, por favor contacta a nuestro equipo de soporte.",
    viewTermsOfUse: "Ver Términos de Uso",

    // Footer
    company: "Empresa",
    careers: "Carreras",
    resources: "Recursos",
    documentation: "Documentación",
    help: "Centro de Ayuda",
    guides: "Guías",
    legal: "Legal",
    privacy: "Política de Privacidad",
    terms: "Términos de Servicio",
    cookies: "Política de Cookies",
    connect: "Conectar",
    twitter: "Twitter",
    discord: "Discord",
    github: "GitHub",
    copyright: "© 2024 DisPlan. Todos los derechos reservados.",

    // Info box
    infoBoxText:
      "Sin tarifas ocultas, sin comisiones, sin cargos adicionales. Nuestra plataforma se mantiene gratuita gracias al apoyo de la comunidad y donaciones opcionales. Ayúdanos a mantenerla creciendo — para todos.",
  },
}

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [mounted, setMounted] = useState(false)

  // Apply translations to the page
  const applyTranslations = (languageCode: LanguageCode) => {
    const elements = document.querySelectorAll("[data-i18n]")
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n")
      if (key && translations[languageCode] && translations[languageCode][key]) {
        element.textContent = translations[languageCode][key]
      }
    })

    // Update HTML lang attribute
    document.documentElement.lang = languageCode

    // For RTL languages like Hebrew
    if (languageCode === "he") {
      document.documentElement.dir = "rtl"
      // Add RTL specific classes to adjust layout
      document.body.classList.add("rtl-layout")

      // Adjust flex direction for RTL layout in navigation and buttons
      const navItems = document.querySelectorAll(".flex")
      navItems.forEach((item) => {
        if (item.classList.contains("items-center") && !item.classList.contains("flex-col")) {
          item.classList.add("rtl-flex")
        }
      })
    } else {
      document.documentElement.dir = "ltr"
      document.body.classList.remove("rtl-layout")

      // Remove RTL specific classes
      const rtlElements = document.querySelectorAll(".rtl-flex")
      rtlElements.forEach((el) => {
        el.classList.remove("rtl-flex")
      })
    }
  }

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferredLanguage", language.code)
    applyTranslations(language.code as LanguageCode)
  }

  // Load preferred language on component mount
  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
        setTimeout(() => applyTranslations(language.code as LanguageCode), 100) // Small delay to ensure DOM is ready
      }
    }
  }, [])

  // Apply translations whenever the page changes or route changes
  useEffect(() => {
    if (mounted && currentLanguage) {
      // Apply translations on initial load
      applyTranslations(currentLanguage.code as LanguageCode)

      // Also apply translations when the URL changes (page navigation)
      const handleRouteChange = () => {
        setTimeout(() => {
          applyTranslations(currentLanguage.code as LanguageCode)
        }, 300) // Delay to ensure new page content is loaded
      }

      // Listen for URL changes
      window.addEventListener("popstate", handleRouteChange)

      return () => {
        window.removeEventListener("popstate", handleRouteChange)
      }
    }
  }, [mounted, currentLanguage])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="post-actions-menu-button">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="post-dropdown-menu2" align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="post-dropdown-item link_button"
          >
            <span className="post-dropdown-item-icon">{language.countryCode}</span>
            {language.name}
            {currentLanguage.code === language.code && (
              <span className="ml-auto h-2 w-2 rounded-full bg-purple-500"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
