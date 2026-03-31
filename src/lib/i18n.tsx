'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'az' | 'ru';

export interface Translations {
  [key: string]: string | string[] | Translations;
}

const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: 'Home', jobs: 'Browse Jobs', companies: 'Companies', pricing: 'Pricing',
      dashboard: 'Dashboard', signIn: 'Sign In', signUp: 'Get Started', signOut: 'Sign Out', language: 'Language',
    },
    hero: {
      badge: '10,000+ active job listings in your area', title: 'Find Your Next Opportunity,', titleAccent: 'Locally',
      subtitle: 'Find your next opportunity, locally. The fastest way to connect with employers in your city.',
      searchPlaceholder: 'Job title, keyword, or company', locationPlaceholder: 'City or zip code', search: 'Search',
      remote: 'Remote', engineering: 'Engineering', marketing: 'Marketing', design: 'Design', sales: 'Sales',
    },
    stats: { activeJobs: 'Active Jobs', companies: 'Companies', hiredThisMonth: 'Hired This Month', cities: 'Cities' },
    features: {
      title: 'Everything you need to land your dream job',
      subtitle: 'Powerful tools designed to make your job search faster and more effective.',
      localSearch: { title: 'Hyper-Local Search', description: 'Find jobs near you with precise location-based filtering. No more sifting through irrelevant results.' },
      oneClick: { title: '1-Click Apply', description: 'Apply to jobs instantly with your saved profile. No lengthy forms, no friction.' },
      verified: { title: 'Verified Employers', description: 'Every company is verified so you can apply with confidence. No scams, no fake listings.' },
      tracking: { title: 'Track Applications', description: 'See exactly where you stand with every application. Real-time status updates.' },
      messaging: { title: 'Direct Messaging', description: 'Chat directly with employers and recruiters. No more playing phone tag.' },
      aiTips: { title: 'AI Resume Tips', description: 'Get smart suggestions to improve your resume and stand out from the crowd.' },
    },
    pricing: {
      title: 'Simple, transparent pricing', subtitle: 'Start free, upgrade when you are ready. No hidden fees, cancel anytime.',
      free: { name: 'Free', features: ['Browse all local jobs', 'Create a basic profile', '5 applications per month', 'View company profiles & reviews'] },
      premium: { name: 'Premium', period: '/month', badge: 'Most Popular', features: ['Everything in Free', 'Unlimited applications', 'Priority application ranking', 'Advanced job filters', 'Application tracking dashboard', 'AI resume optimization', 'Direct messaging with employers', 'Exclusive premium-only jobs'] },
      getStarted: 'Get Started', getStartedFree: 'Get Started Free', currentPlan: 'Current Plan', upgradeNow: 'Upgrade Now',
      premiumPlan: 'You are on the Premium plan',
      faq: {
        title: 'Frequently Asked Questions',
        cancel: { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. You will continue to have access until the end of your billing period.' },
        payment: { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe, our secure payment processor.' },
        trial: { q: 'Is there a free trial?', a: 'The free plan lets you browse all jobs and apply to up to 5 jobs per month. No credit card required.' },
        priority: { q: 'How does priority ranking work?', a: 'Premium applications are highlighted and sorted to the top of the employer dashboard, giving you 3x more visibility.' },
      },
    },
    cta: {
      title: 'Ready to find your next opportunity?',
      subtitle: 'Join thousands of job seekers who have already found their dream jobs through JobMarket.',
      createAccount: 'Create Free Account', browseJobs: 'Browse Jobs',
    },
    footer: {
      description: 'Connecting local talent with local opportunities. Find your dream job today.',
      jobSeekers: 'Job Seekers', employers: 'Employers', support: 'Support',
      browseJobs: 'Browse Jobs', companies: 'Companies', premium: 'Premium', createAccount: 'Create Account',
      postJob: 'Post a Job', pricing: 'Pricing', companyProfile: 'Company Profile',
      helpCenter: 'Help Center', privacy: 'Privacy Policy', terms: 'Terms of Service', contact: 'Contact Us', rights: 'All rights reserved.',
    },
    auth: {
      login: {
        title: 'Welcome back', subtitle: 'Sign in to your JobMarket account',
        email: 'Email', password: 'Password', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In', signingIn: 'Signing in...', orContinueWith: 'or continue with', continueGoogle: 'Continue with Google',
        noAccount: "Don't have an account?", signUpFree: 'Sign up free', welcomeBack: 'Welcome back!',
      },
      register: {
        title: 'Create your account', subtitle: 'Join JobMarket and start your journey',
        jobSeeker: 'Job Seeker', employer: 'Employer',
        firstName: 'First Name', lastName: 'Last Name', email: 'Email', password: 'Password',
        firstNamePlaceholder: 'John', lastNamePlaceholder: 'Doe', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'At least 8 characters',
        minChars: 'Minimum 8 characters', createAccount: 'Create Account', creatingAccount: 'Creating account...',
        hasAccount: 'Already have an account?', signIn: 'Sign in',
        terms: 'By creating an account, you agree to our', termsOfService: 'Terms of Service', and: 'and', privacyPolicy: 'Privacy Policy',
        accountCreated: 'Account created! Welcome to JobMarket',
      },
      error: {
        title: 'Authentication Error',
        configuration: 'There is a problem with the server configuration.',
        accessDenied: 'You do not have permission to access this resource.',
        verification: 'The verification link may have expired or already been used.',
        default: 'An error occurred during authentication.',
        tryAgain: 'Try Again', goHome: 'Go Home',
      },
    },
    jobs: {
      searchPlaceholder: 'Search jobs, skills, companies...', cityPlaceholder: 'City or zip code',
      filters: 'Filters', jobType: 'Job Type', workModel: 'Work Model', experienceLevel: 'Experience Level',
      industry: 'Industry', allIndustries: 'All Industries',
      searching: 'Searching...', jobsFound: 'jobs found', noJobs: 'No jobs found',
      noJobsDesc: 'Try adjusting your search or filters',
      sort: { newest: 'Newest First', salaryHigh: 'Highest Salary', salaryLow: 'Lowest Salary', oldest: 'Oldest First' },
      badges: { featured: 'Featured', premium: 'Premium', urgent: 'Urgent' },
      previous: 'Previous', next: 'Next', page: 'Page', of: 'of', more: 'more',
    },
    jobDetail: {
      backToJobs: 'Back to jobs', applyNow: 'Apply Now', applied: 'Applied', saved: 'Saved', save: 'Save', share: 'Share',
      aboutRole: 'About this role', requirements: 'Requirements', responsibilities: 'Responsibilities', skills: 'Skills',
      jobDetails: 'Job Details', salary: 'Salary', jobType: 'Job Type', workModel: 'Work Model',
      experience: 'Experience', industry: 'Industry', posted: 'Posted', benefits: 'Benefits',
      about: 'About', viewCompany: 'View Company Profile',
      applyModal: { title: 'Apply to', at: 'at', coverLetter: 'Cover Letter (optional)', coverLetterPlaceholder: 'Tell the employer why you are a great fit...', submit: 'Submit Application', submitting: 'Submitting...', cancel: 'Cancel' },
      notSpecified: 'Not specified', perYear: '/ year',
      toasts: { applied: 'Application submitted successfully!', failed: 'Failed to apply', saved: 'Job saved!', unsaved: 'Job unsaved', saveFailed: 'Failed to save job' },
      reviews: 'Reviews', pros: 'Pros', cons: 'Cons',
      openPositions: 'Open Positions', noPositions: 'No open positions at the moment', companyNotFound: 'Company not found',
      verified: 'Verified', employees: 'employees',
    },
    companies: {
      title: 'Companies', hiring: 'companies hiring on JobMarket', searchPlaceholder: 'Search companies...',
      noCompanies: 'No companies found', noCompaniesDesc: 'Try a different search term', openJobs: 'open jobs',
    },
    dashboard: {
      welcome: 'Welcome back', welcomeName: 'Welcome back,', subtitle: "Here's what's happening with your job search",
      upgradePremium: 'Upgrade to Premium', postJob: 'Post a Job',
      freePlan: 'Free Plan', runningLow: 'Running Low', remainingApps: 'applications remaining this month',
      unlimitedApps: 'Unlimited applications',
      upgradeDesc: 'Upgrade to Premium for unlimited applications, priority ranking, and more.',
      upgradePrice: 'Upgrade - $9.99/mo',
      stats: { applications: 'Applications', remaining: 'Remaining', profileViews: 'Profile Views', plan: 'Plan', thisMonth: 'this month', premiumPlan: 'Premium plan', applicationsLeft: 'applications left', totalViews: 'total views', active: 'active', upgradeAvailable: 'upgrade available' },
      recentApps: 'Recent Applications', viewAll: 'View all', noApps: 'No applications yet', noAppsDesc: 'Start applying to jobs to track your progress here.',
      browseJobs: 'Browse Jobs', quickActions: 'Quick Actions', editProfile: 'Edit Profile', savedJobs: 'Saved Jobs', applications: 'Applications',
      recommended: 'Recommended', unlimited: 'Unlimited', premium: 'Premium', free: 'Free',
    },
    applications: {
      title: 'My Applications', total: 'total applications', browseJobs: 'Browse Jobs',
      all: 'All', noApps: 'No applications found', noAppsFiltered: 'No applications with this status', noAppsDesc: 'Start applying to jobs to see them here',
      priority: 'Priority', applied: 'Applied', withdraw: 'Withdraw',
      interview: 'Interview scheduled:', confirmWithdraw: 'Are you sure you want to withdraw this application?',
      previous: 'Previous', next: 'Next',
    },
    profile: {
      title: 'Edit Profile', subtitle: 'Keep your profile up to date to attract employers',
      saveChanges: 'Save Changes', saving: 'Saving...', saveAll: 'Save All Changes',
      basicInfo: 'Basic Information', firstName: 'First Name', lastName: 'Last Name', headline: 'Headline',
      headlinePlaceholder: 'e.g. Senior Software Engineer with 5+ years experience',
      phone: 'Phone', phonePlaceholder: '+1 (555) 000-0000', city: 'City', cityPlaceholder: 'San Francisco', state: 'State', statePlaceholder: 'CA',
      about: 'About', bioPlaceholder: 'Tell employers about yourself, your experience, and what you are looking for...',
      experience: 'Experience', yearsExp: 'Years of Experience', expLevel: 'Experience Level', salaryExp: 'Salary Expectation (annual)',
      salaryPlaceholder: 'e.g. 80000', openToWork: 'Open to work',
      skills: 'Skills', skillPlaceholder: 'Type a skill and press Enter', add: 'Add', popularSkills: 'Popular skills:',
      links: 'Links', linkedin: 'LinkedIn URL', linkedinPlaceholder: 'https://linkedin.com/in/yourname',
      portfolio: 'Portfolio URL', portfolioPlaceholder: 'https://yourportfolio.com',
      github: 'GitHub URL', githubPlaceholder: 'https://github.com/yourname',
      resume: 'Resume', uploadResume: 'Upload your resume', resumeFormats: 'PDF, DOC, or DOCX up to 5MB',
    },
    messages: {
      title: 'Messages', premiumFeature: 'Premium Feature', premiumDesc: 'Direct messaging is available for Premium members',
      upgradePremium: 'Upgrade to Premium', searchPlaceholder: 'Search conversations...', noConversations: 'No conversations yet',
      conversation: 'Conversation', back: 'Back', typePlaceholder: 'Type a message...', send: 'Send',
      selectConversation: 'Select a conversation to start messaging',
      toasts: { failed: 'Failed to send', sendFailed: 'Failed to send message' },
    },
    saved: {
      title: 'Saved Jobs', savedCount: 'saved jobs', noSaved: 'No saved jobs', noSavedDesc: 'Save jobs to review them later',
      browseJobs: 'Browse Jobs', removed: 'Job removed from saved', removeFailed: 'Failed to remove',
    },
    postJob: {
      createCompany: 'Create Company Profile', createCompanyDesc: 'You need a company profile before posting jobs',
      companyName: 'Company Name *', description: 'Description', industry: 'Industry', selectIndustry: 'Select',
      website: 'Website', city: 'City', state: 'State', createCompanyBtn: 'Create Company',
      title: 'Post a Job', subtitle: 'Fill in the details to create a new job listing',
      jobDetails: 'Job Details', jobTitle: 'Job Title *', jobTitlePlaceholder: 'e.g. Senior Software Engineer',
      jobDesc: 'Description *', jobDescPlaceholder: 'Describe the role, team, and what makes this opportunity special...',
      jobType: 'Job Type', workModel: 'Work Model', expLevel: 'Experience Level',
      locationSalary: 'Location & Salary', minSalary: 'Min Salary (annual)', maxSalary: 'Max Salary (annual)',
      salaryPlaceholder: 'e.g. 50000',
      requirements: 'Requirements', reqPlaceholder: 'e.g. 3+ years of React experience', addReq: '+ Add Requirement',
      responsibilities: 'Responsibilities', respPlaceholder: 'e.g. Design and implement new features', addResp: '+ Add Responsibility',
      benefits: 'Benefits', benefitPlaceholder: 'e.g. Health insurance', addBenefit: '+ Add Benefit',
      requiredSkills: 'Required Skills', skillPlaceholder: 'Type a skill and press Enter', add: 'Add',
      postJob: 'Post Job', posting: 'Posting...', companyCreated: 'Company created!', jobPosted: 'Job posted!',
    },
    admin: {
      dashboard: 'Admin Dashboard', subtitle: 'Platform overview and management', manageUsers: 'Manage Users', manageJobs: 'Manage Jobs',
      stats: { totalUsers: 'Total Users', activeJobs: 'Active Jobs', applications: 'Applications', revenue: 'Revenue', premiumUsers: 'Premium Users', companies: 'Companies', thisMonth: 'this month', total: 'total', conversion: 'conversion', verified: 'verified' },
      userGrowth: 'User Growth (6 months)', jobsByType: 'Jobs by Type', appsByStatus: 'Applications by Status',
      jobs: { title: 'Manage Jobs', searchPlaceholder: 'Search jobs or companies...', job: 'Job', company: 'Company', applications: 'Applications', views: 'Views', status: 'Status', actions: 'Actions',
        active: 'Active', inactive: 'Inactive', deactivate: 'Deactivate', activate: 'Activate', unfeature: 'Unfeature', feature: 'Feature', noJobs: 'No jobs found' },
      users: { title: 'Manage Users', searchPlaceholder: 'Search by email or name...', allRoles: 'All Roles', jobSeekers: 'Job Seekers', employers: 'Employers', recruiters: 'Recruiters', admins: 'Admins',
        user: 'User', role: 'Role', plan: 'Plan', applications: 'Applications', joined: 'Joined', actions: 'Actions',
        deactivate: 'Deactivate', activate: 'Activate', noUsers: 'No users found' },
      previous: 'Previous', next: 'Next',
    },
    common: { loading: 'Loading...', somethingWrong: 'Something went wrong' },
  },
  az: {
    nav: {
      home: 'Ana Səhifə', jobs: 'Vakansiyalar', companies: 'Şirkətlər', pricing: 'Qiymətlər',
      dashboard: 'İdarə Paneli', signIn: 'Daxil Ol', signUp: 'Başla', signOut: 'Çıxış', language: 'Dil',
    },
    hero: {
      badge: 'Bölgənizdə 10,000+ aktiv vakansiya', title: 'Növbəti Fürsətinizi Tapın,', titleAccent: 'Yerli Olaraq',
      subtitle: 'Növbəti fürsətinizi, yerli olaraq tapın. Şəhərinizdə işəgötürənlərlə əlaqə qurmağın ən sürətli yolu.',
      searchPlaceholder: 'Vəzifə, açar söz və ya şirkət', locationPlaceholder: 'Şəhər və ya poçt kodu', search: 'Axtar',
      remote: 'Məsafədən', engineering: 'Mühəndislik', marketing: 'Marketinq', design: 'Dizayn', sales: 'Satış',
    },
    stats: { activeJobs: 'Aktiv Vakansiyalar', companies: 'Şirkətlər', hiredThisMonth: 'Bu Ay İşə Götürülənlər', cities: 'Şəhərlər' },
    features: {
      title: 'Xəyal işinizi tapmaq üçün lazım olan hər şey',
      subtitle: 'İş axtarışınızı daha sürətli və effektiv etmək üçün hazırlanmış güclü alətlər.',
      localSearch: { title: 'Hiper-Yerli Axtarış', description: 'Dəqiq yer-based filtrasiya ilə yaxınlığınızdakı işləri tapın. Artıq lazımsız nəticələrə baxmaq yoxdur.' },
      oneClick: { title: '1-Klik Müraciət', description: 'Saxlanmış profilinizlə dərhal işlərə müraciət edin. Uzun formalara ehtiyac yoxdur.' },
      verified: { title: 'Təsdiqlənmiş İşəgötürənlər', description: 'Hər şirkət təsdiqlənib ki, siz əminliklə müraciət edə biləsiniz. Saxtakarlıq yoxdur.' },
      tracking: { title: 'Müraciətləri İzləyin', description: 'Hər müraciətinizdə harada olduğunuzu dəqiq bilin. Real vaxt yeniləmələri.' },
      messaging: { title: 'Birbaşa Mesajlaşma', description: 'İşəgötürənlər və recruiterlərlə birbaşa danışın. Artıq telefon oyunu yoxdur.' },
      aiTips: { title: 'CV Məsləhətləri', description: 'CV-nizi yaxşılaşdırmaq üçün ağıllı tövsiyələr alın və izdihamdan fərqlənin.' },
    },
    pricing: {
      title: 'Sadə, şəffaf qiymətlər', subtitle: 'Pulsuz başlayın, hazır olduğunuzda yüksəldin. Gizli ödəniş yoxdur, istənilən vaxt ləğv edin.',
      free: { name: 'Pulsuz', features: ['Bütün yerli işlərə baxın', 'Əsas profil yaradın', 'Aya 5 müraciət', 'Şirkət profillərinə baxın'] },
      premium: { name: 'Premium', period: '/ay', badge: 'Ən Populyar', features: ['Pulsuz paktda olan hər şey', 'Limitsiz müraciətlər', 'Prioritet müraciət sıralaması', 'Təkmil filtrlər', 'Müraciət izləmə paneli', 'CV optimallaşdırması', 'İşəgötürənlərlə birbaşa mesajlaşma', 'Xüsusi premium işlər'] },
      getStarted: 'Başla', getStartedFree: 'Pulsuz Başla', currentPlan: 'Cari Plan', upgradeNow: 'İndi Yüksəlt',
      premiumPlan: 'Premium planındasınız',
      faq: {
        title: 'Tez-tez Verilən Suallar',
        cancel: { q: 'İstənilən vaxt ləğv edə bilərəmmi?', a: 'Bəli! Abunəliyinizi istənilən vaxt ləğv edə bilərsiniz. Hesab dövrünüzün sonuna qədər girişiniz davam edəcək.' },
        payment: { q: 'Hansı ödəniş üsullarını qəbul edirsiniz?', a: 'Stripe vasitəsilə bütün əsas kredit kartlarını qəbul edirik.' },
        trial: { q: 'Pulsuz sınaq varmı?', a: 'Pulsuz plan bütün işlərə baxmağa və aya 5 işə müraciət etməyə imkan verir. Kredit kartı tələb olunmur.' },
        priority: { q: 'Prioritet sıralama necə işləyir?', a: 'Premium müraciətlər işəgötürən panelində yuxarıda vurğulanır, 3 dəfə daha çox görünürlük verir.' },
      },
    },
    cta: {
      title: 'Növbəti fürsətinizi tapmağa hazırsınız?',
      subtitle: 'JobMarket vasitəsilə artıq xəyal işlərini tapmış minlərlə iş axtarana qoşulun.',
      createAccount: 'Pulsuz Hesab Yaradın', browseJobs: 'Vakansiyaları Gör',
    },
    footer: {
      description: 'Yerli istedadları yerli fürsətlərlə birləşdiririk. Bu gün xəyal işinizi tapın.',
      jobSeekers: 'İş Axtaranlar', employers: 'İşəgötürənlər', support: 'Dəstək',
      browseJobs: 'Vakansiyaları Gör', companies: 'Şirkətlər', premium: 'Premium', createAccount: 'Hesab Yaradın',
      postJob: 'İş Yerləşdir', pricing: 'Qiymətlər', companyProfile: 'Şirkət Profili',
      helpCenter: 'Kömək Mərkəzi', privacy: 'Məxfilik Siyasəti', terms: 'Xidmət Şərtləri', contact: 'Bizimlə Əlaqə', rights: 'Bütün hüquqlar qorunur.',
    },
    auth: {
      login: {
        title: 'Xoş gəlmisiniz', subtitle: 'JobMarket hesabınıza daxil olun',
        email: 'E-poçt', password: 'Şifrə', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'Şifrənizi daxil edin',
        signIn: 'Daxil Ol', signingIn: 'Daxil olunur...', orContinueWith: 'və ya davam edin', continueGoogle: 'Google ilə davam edin',
        noAccount: 'Hesabınız yoxdur?', signUpFree: 'Pulsuz qeydiyyatdan keçin', welcomeBack: 'Xoş gəldiniz!',
      },
      register: {
        title: 'Hesabınızı yaradın', subtitle: 'JobMarket-a qoşulun və səyahətinizə başlayın',
        jobSeeker: 'İş Axtaran', employer: 'İşəgötürən',
        firstName: 'Ad', lastName: 'Soyad', email: 'E-poçt', password: 'Şifrə',
        firstNamePlaceholder: 'Ad', lastNamePlaceholder: 'Soyad', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'Ən azı 8 simvol',
        minChars: 'Minimum 8 simvol', createAccount: 'Hesab Yaradın', creatingAccount: 'Hesab yaradılır...',
        hasAccount: 'Artıq hesabınız var?', signIn: 'Daxil olun',
        terms: 'Hesab yaradaraq bizim razılaşırsınız', termsOfService: 'Xidmət Şərtləri', and: 'və', privacyPolicy: 'Məxfilik Siyasəti',
        accountCreated: 'Hesab yaradıldı! JobMarket-a xoş gəldiniz',
      },
      error: {
        title: 'Autentifikasiya Xətası',
        configuration: 'Server konfiqurasiyasında problem var.',
        accessDenied: 'Bu resursa giriş icazəniz yoxdur.',
        verification: 'Doğrulama linkinin müddəti bitmiş və ya artıq istifadə edilmiş ola bilər.',
        default: 'Autentifikasiya zamanı xəta baş verdi.',
        tryAgain: 'Yenidən Cəhd Edin', goHome: 'Ana Səhifə',
      },
    },
    jobs: {
      searchPlaceholder: 'İş, bacarıq, şirkət axtar...', cityPlaceholder: 'Şəhər və ya poçt kodu',
      filters: 'Filtrlər', jobType: 'İş Növü', workModel: 'İş Modeli', experienceLevel: 'Təcrübə Səviyyəsi',
      industry: 'Sənaye', allIndustries: 'Bütün Sənayelər',
      searching: 'Axtarılır...', jobsFound: 'iş tapıldı', noJobs: 'İş tapılmadı',
      noJobsDesc: 'Axtarışınızı və ya filtrlərinizi dəyişdirməyə cəhd edin',
      sort: { newest: 'Ən Yeni', salaryHigh: 'Ən Yüksək Maaş', salaryLow: 'Ən Aşağı Maaş', oldest: 'Ən Köhnə' },
      badges: { featured: 'Seçilmiş', premium: 'Premium', urgent: 'Təcili' },
      previous: 'Əvvəlki', next: 'Növbəti', page: 'Səhifə', of: '/', more: 'daha çox',
    },
    jobDetail: {
      backToJobs: 'İşlərə qayıt', applyNow: 'İndi Müraciət Et', applied: 'Müraciət Edilib', saved: 'Saxlanıldı', save: 'Saxla', share: 'Paylaş',
      aboutRole: 'Bu rol haqqında', requirements: 'Tələblər', responsibilities: 'Məsuliyyətlər', skills: 'Bacarıqlar',
      jobDetails: 'İş Təfərrüatları', salary: 'Maaş', jobType: 'İş Növü', workModel: 'İş Modeli',
      experience: 'Təcrübə', industry: 'Sənaye', posted: 'Yerləşdirilib', benefits: 'Faydalar',
      about: 'Haqqında', viewCompany: 'Şirkət Profilinə Bax',
      applyModal: { title: 'Müraciət:', at: '-', coverLetter: 'Məktub (ixtiyari)', coverLetterPlaceholder: 'İşəgötürənə niyə əlaqə namizəd olduğunuzu söyləyin...', submit: 'Müraciəti Göndər', submitting: 'Göndərilir...', cancel: 'Ləğv et' },
      notSpecified: 'Göstərilməyib', perYear: '/ il',
      toasts: { applied: 'Müraciət uğurla göndərildi!', failed: 'Müraciət uğursuz oldu', saved: 'İş saxlanıldı!', unsaved: 'İş saxlanmadı', saveFailed: 'İş saxlanmadı' },
      reviews: 'Rəylər', pros: 'Müsbət', cons: 'Mənfi',
      openPositions: 'Açıq Vəzifələr', noPositions: 'Hazırda açıq vəzifə yoxdur', companyNotFound: 'Şirkət tapılmadı',
      verified: 'Təsdiqlənmiş', employees: 'işçi',
    },
    companies: {
      title: 'Şirkətlər', hiring: 'JobMarket-da işə götürən şirkətlər', searchPlaceholder: 'Şirkət axtar...',
      noCompanies: 'Şirkət tapılmadı', noCompaniesDesc: 'Fərqli axtarış sözü sınayın', openJobs: 'açıq iş',
    },
    dashboard: {
      welcome: 'Xoş gəldiniz', welcomeName: 'Xoş gəldiniz,', subtitle: 'İş axtarışınızda baş verənlər',
      upgradePremium: 'Premium-a Yüksəlt', postJob: 'İş Yerləşdir',
      freePlan: 'Pulsuz Plan', runningLow: 'Azalır', remainingApps: 'bu ay üçün qalan müraciət',
      unlimitedApps: 'Limitsiz müraciətlər',
      upgradeDesc: 'Limitsiz müraciətlər, prioritet sıralama və daha çox üçün Premium-a yüksəldin.',
      upgradePrice: 'Yüksəlt - $9.99/ay',
      stats: { applications: 'Müraciətlər', remaining: 'Qalan', profileViews: 'Profil Baxışları', plan: 'Plan', thisMonth: 'bu ay', premiumPlan: 'Premium plan', applicationsLeft: 'qalan müraciət', totalViews: 'ümumi baxış', active: 'aktiv', upgradeAvailable: 'yüksəltmə mövcuddur' },
      recentApps: 'Son Müraciətlər', viewAll: 'Hamısına bax', noApps: 'Hələ müraciət yoxdur', noAppsDesc: 'Tərəqqinizi izləmək üçün işlərə müraciət etməyə başlayın.',
      browseJobs: 'Vakansiyaları Gör', quickActions: 'Sürətli Əməliyyatlar', editProfile: 'Profili Redaktə Et', savedJobs: 'Saxlanılan İşlər', applications: 'Müraciətlər',
      recommended: 'Tövsiyə Edilən', unlimited: 'Limitsiz', premium: 'Premium', free: 'Pulsuz',
    },
    applications: {
      title: 'Mənim Müraciətlərim', total: 'ümumi müraciət', browseJobs: 'Vakansiyaları Gör',
      all: 'Hamısı', noApps: 'Müraciət tapılmadı', noAppsFiltered: 'Bu statusda müraciət yoxdur', noAppsDesc: 'Burada görmək üçün işlərə müraciət etməyə başlayın',
      priority: 'Prioritet', applied: 'Müraciət Edilib', withdraw: 'Geri Çək',
      interview: 'Müsahibə planlaşdırılıb:', confirmWithdraw: 'Bu müraciəti geri çəkmək istədiyinizə əminsiniz?',
      previous: 'Əvvəlki', next: 'Növbəti',
    },
    profile: {
      title: 'Profili Redaktə Et', subtitle: 'İşəgötürənləri cəlb etmək üçün profilinizi yeniləyin',
      saveChanges: 'Dəyişiklikləri Saxla', saving: 'Saxlanılır...', saveAll: 'Bütün Dəyişiklikləri Saxla',
      basicInfo: 'Əsas Məlumat', firstName: 'Ad', lastName: 'Soyad', headline: 'Başlıq',
      headlinePlaceholder: 'məs. 5+ il təcrübəli Senior Proqram Tərtibatçısı',
      phone: 'Telefon', phonePlaceholder: '+994 50 000 00 00', city: 'Şəhər', cityPlaceholder: 'Bakı', state: 'Bölgə', statePlaceholder: 'Bakı',
      about: 'Haqqında', bioPlaceholder: 'İşəgötürənlərə özünüz, təcrübəniz və nə axtardığınız barədə danışın...',
      experience: 'Təcrübə', yearsExp: 'İl Təcrübə', expLevel: 'Təcrübə Səviyyəsi', salaryExp: 'Maaş Gözləntisi (illik)',
      salaryPlaceholder: 'məs. 80000', openToWork: 'İşə açıqdır',
      skills: 'Bacarıqlar', skillPlaceholder: 'Bacarıq yazın və Enter basın', add: 'Əlavə et', popularSkills: 'Populyar bacarıqlar:',
      links: 'Keçidlər', linkedin: 'LinkedIn URL', linkedinPlaceholder: 'https://linkedin.com/in/adınız',
      portfolio: 'Portfolio URL', portfolioPlaceholder: 'https://portfolio.com',
      github: 'GitHub URL', githubPlaceholder: 'https://github.com/adınız',
      resume: 'CV', uploadResume: 'CV-nizi yükləyin', resumeFormats: 'PDF, DOC, və ya DOCX 5MB-a qədər',
    },
    messages: {
      title: 'Mesajlar', premiumFeature: 'Premium Xüsusiyyət', premiumDesc: 'Birbaşa mesajlaşma Premium üzvlər üçün mövcuddur',
      upgradePremium: 'Premium-a Yüksəlt', searchPlaceholder: 'Söhbətləri axtar...', noConversations: 'Hələ söhbət yoxdur',
      conversation: 'Söhbət', back: 'Geri', typePlaceholder: 'Mesaj yazın...', send: 'Göndər',
      selectConversation: 'Mesajlaşmağa başlamaq üçün söhbət seçin',
      toasts: { failed: 'Göndərilmədi', sendFailed: 'Mesaj göndərilmədi' },
    },
    saved: {
      title: 'Saxlanılan İşlər', savedCount: 'saxlanılan iş', noSaved: 'Saxlanılan iş yoxdur', noSavedDesc: 'Sonra baxmaq üçün işləri saxlayın',
      browseJobs: 'Vakansiyaları Gör', removed: 'İş silindi', removeFailed: 'Silinmədi',
    },
    postJob: {
      createCompany: 'Şirkət Profili Yaradın', createCompanyDesc: 'İş yerləşdirməzdən əvvəl şirkət profiliniz olmalıdır',
      companyName: 'Şirkət Adı *', description: 'Təsvir', industry: 'Sənaye', selectIndustry: 'Seçin',
      website: 'Veb sayt', city: 'Şəhər', state: 'Bölgə', createCompanyBtn: 'Şirkət Yaradın',
      title: 'İş Yerləşdir', subtitle: 'Yeni iş elanı yaratmaq üçün məlumatları doldurun',
      jobDetails: 'İş Təfərrüatları', jobTitle: 'Vəzifə *', jobTitlePlaceholder: 'məs. Senior Proqram Tərtibatçısı',
      jobDesc: 'Təsvir *', jobDescPlaceholder: 'Rolu, komandanı və bu fürsəti xüsusi edən şeyi təsvir edin...',
      jobType: 'İş Növü', workModel: 'İş Modeli', expLevel: 'Təcrübə Səviyyəsi',
      locationSalary: 'Məkan və Maaş', minSalary: 'Minimum Maaş (illik)', maxSalary: 'Maksimum Maaş (illik)',
      salaryPlaceholder: 'məs. 50000',
      requirements: 'Tələblər', reqPlaceholder: 'məs. 3+ il React təcrübəsi', addReq: '+ Tələb Əlavə Et',
      responsibilities: 'Məsuliyyətlər', respPlaceholder: 'məs. Yeni xüsusiyyətlərin dizaynı və tətbiqi', addResp: '+ Məsuliyyət Əlavə Et',
      benefits: 'Faydalar', benefitPlaceholder: 'məs. Sığorta', addBenefit: '+ Fayda Əlavə Et',
      requiredSkills: 'Tələb Olunan Bacarıqlar', skillPlaceholder: 'Bacarıq yazın və Enter basın', add: 'Əlavə et',
      postJob: 'İş Yerləşdir', posting: 'Yerləşdirilir...', companyCreated: 'Şirkət yaradıldı!', jobPosted: 'İş yerləşdirildi!',
    },
    admin: {
      dashboard: 'Admin Paneli', subtitle: 'Platform icmalı və idarəetmə', manageUsers: 'İstifadəçiləri İdarə Et', manageJobs: 'İşləri İdarə Et',
      stats: { totalUsers: 'Ümumi İstifadəçilər', activeJobs: 'Aktiv İşlər', applications: 'Müraciətlər', revenue: 'Gəlir', premiumUsers: 'Premium İstifadəçilər', companies: 'Şirkətlər', thisMonth: 'bu ay', total: 'ümumi', conversion: 'konversiya', verified: 'təsdiqlənmiş' },
      userGrowth: 'İstifadəçi Artımı (6 ay)', jobsByType: 'İş Növünə Görə', appsByStatus: 'Statusa Görə Müraciətlər',
      jobs: { title: 'İşləri İdarə Et', searchPlaceholder: 'İş və ya şirkət axtar...', job: 'İş', company: 'Şirkət', applications: 'Müraciətlər', views: 'Baxışlar', status: 'Status', actions: 'Əməliyyatlar',
        active: 'Aktiv', inactive: 'Qeyri-aktiv', deactivate: 'Deaktiv et', activate: 'Aktiv et', unfeature: 'Seçimdən çıxar', feature: 'Seç', noJobs: 'İş tapılmadı' },
      users: { title: 'İstifadəçiləri İdarə Et', searchPlaceholder: 'E-poçt və ya ad ilə axtar...', allRoles: 'Bütün Rollar', jobSeekers: 'İş Axtaranlar', employers: 'İşəgötürənlər', recruiters: 'Recruiterlər', admins: 'Adminlər',
        user: 'İstifadəçi', role: 'Rolu', plan: 'Plan', applications: 'Müraciətlər', joined: 'Qoşulub', actions: 'Əməliyyatlar',
        deactivate: 'Deaktiv et', activate: 'Aktiv et', noUsers: 'İstifadəçi tapılmadı' },
      previous: 'Əvvəlki', next: 'Növbəti',
    },
    common: { loading: 'Yüklənir...', somethingWrong: 'Nəsə səhv getdi' },
  },
  ru: {
    nav: {
      home: 'Главная', jobs: 'Вакансии', companies: 'Компании', pricing: 'Цены',
      dashboard: 'Панель', signIn: 'Войти', signUp: 'Начать', signOut: 'Выйти', language: 'Язык',
    },
    hero: {
      badge: '10,000+ активных вакансий в вашем регионе', title: 'Найдите Свою Следующую Возможность,', titleAccent: 'Локально',
      subtitle: 'Найдите свою следующую возможность локально. Самый быстрый способ связаться с работодателями в вашем городе.',
      searchPlaceholder: 'Должность, ключевое слово или компания', locationPlaceholder: 'Город или почтовый индекс', search: 'Поиск',
      remote: 'Удалённо', engineering: 'Инженерия', marketing: 'Маркетинг', design: 'Дизайн', sales: 'Продажи',
    },
    stats: { activeJobs: 'Активные Вакансии', companies: 'Компании', hiredThisMonth: 'Нанятых В Эттом Месяце', cities: 'Города' },
    features: {
      title: 'Всё необходимое для получения работы мечты',
      subtitle: 'Мощные инструменты для более быстрого и эффективного поиска работы.',
      localSearch: { title: 'Локальный Поиск', description: 'Находите работы рядом с вами с помощью точной геолокационной фильтрации.' },
      oneClick: { title: 'Подача Заявки в 1 Клик', description: 'Подавайте заявки мгновенно с сохранённым профилем. Без длинных форм.' },
      verified: { title: 'Проверенные Работодатели', description: 'Каждая компания проверена. Подавайте заявки с уверенностью.' },
      tracking: { title: 'Отслеживание Заявок', description: 'Отслеживайте статус каждой заявки в реальном времени.' },
      messaging: { title: 'Прямое Общение', description: 'Общайтесь напрямую с работодателями и рекрутерами.' },
      aiTips: { title: 'Советы по Резюме', description: 'Получайте умные рекомендации по улучшению резюме.' },
    },
    pricing: {
      title: 'Простое, прозрачное ценообразование', subtitle: 'Начните бесплатно, обновитесь когда будете готовы. Без скрытых платежей, отмена в любое время.',
      free: { name: 'Бесплатно', features: ['Просмотр всех вакансий', 'Создание профиля', '5 заявок в месяц', 'Просмотр профилей компаний'] },
      premium: { name: 'Премиум', period: '/месяц', badge: 'Самый Популярный', features: ['Всё из бесплатного', 'Безлимитные заявки', 'Приоритетное ранжирование', 'Расширенные фильтры', 'Панель отслеживания', 'Оптимизация резюме', 'Прямое общение с работодателями', 'Эксклюзивные вакансии'] },
      getStarted: 'Начать', getStartedFree: 'Начать Бесплатно', currentPlan: 'Текущий План', upgradeNow: 'Обновить Сейчас',
      premiumPlan: 'Вы на Премиум плане',
      faq: {
        title: 'Часто Задаваемые Вопросы',
        cancel: { q: 'Могу ли я отменить в любое время?', a: 'Да! Вы можете отменить подписку в любое время. Доступ сохранится до конца расчётного периода.' },
        payment: { q: 'Какие способы оплаты вы принимаете?', a: 'Мы принимаем все основные кредитные карты через Stripe.' },
        trial: { q: 'Есть ли бесплатный пробный период?', a: 'Бесплатный план позволяет просматривать все вакансии и подавать до 5 заявок в месяц. Карта не требуется.' },
        priority: { q: 'Как работает приоритетное ранжирование?', a: 'Премиум заявки выделяются и сортируются вверху панели работодателя, давая 3x больше видимости.' },
      },
    },
    cta: {
      title: 'Готовы найти свою следующую возможность?',
      subtitle: 'Присоединяйтесь к тысячам соискателей, которые уже нашли работу мечты через JobMarket.',
      createAccount: 'Создать Бесплатный Аккаунт', browseJobs: 'Просмотреть Вакансии',
    },
    footer: {
      description: 'Соединяем местные таланты с местными возможностями. Найдите работу мечты сегодня.',
      jobSeekers: 'Соискателям', employers: 'Работодателям', support: 'Поддержка',
      browseJobs: 'Просмотреть Вакансии', companies: 'Компании', premium: 'Премиум', createAccount: 'Создать Аккаунт',
      postJob: 'Разместить Вакансию', pricing: 'Цены', companyProfile: 'Профиль Компании',
      helpCenter: 'Центр Помощи', privacy: 'Политика Конфиденциальности', terms: 'Условия Использования', contact: 'Связаться с Нами', rights: 'Все права защищены.',
    },
    auth: {
      login: {
        title: 'С возвращением', subtitle: 'Войдите в свой аккаунт JobMarket',
        email: 'Email', password: 'Пароль', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'Введите пароль',
        signIn: 'Войти', signingIn: 'Вход...', orContinueWith: 'или продолжить с', continueGoogle: 'Продолжить с Google',
        noAccount: 'Нет аккаунта?', signUpFree: 'Зарегистрироваться бесплатно', welcomeBack: 'С возвращением!',
      },
      register: {
        title: 'Создайте аккаунт', subtitle: 'Присоединяйтесь к JobMarket и начните путь',
        jobSeeker: 'Соискатель', employer: 'Работодатель',
        firstName: 'Имя', lastName: 'Фамилия', email: 'Email', password: 'Пароль',
        firstNamePlaceholder: 'Иван', lastNamePlaceholder: 'Иванов', emailPlaceholder: 'you@example.com', passwordPlaceholder: 'Минимум 8 символов',
        minChars: 'Минимум 8 символов', createAccount: 'Создать Аккаунт', creatingAccount: 'Создание аккаунта...',
        hasAccount: 'Уже есть аккаунт?', signIn: 'Войти',
        terms: 'Создавая аккаунт, вы соглашаетесь с нашими', termsOfService: 'Условиями', and: 'и', privacyPolicy: 'Политикой Конфиденциальности',
        accountCreated: 'Аккаунт создан! Добро пожаловать в JobMarket',
      },
      error: {
        title: 'Ошибка Аутентификации',
        configuration: 'Проблема с конфигурацией сервера.',
        accessDenied: 'У вас нет доступа к этому ресурсу.',
        verification: 'Ссылка для подтверждения могла истечь или уже использована.',
        default: 'Произошла ошибка при аутентификации.',
        tryAgain: 'Попробовать Снова', goHome: 'На Главную',
      },
    },
    jobs: {
      searchPlaceholder: 'Поиск вакансий, навыков, компаний...', cityPlaceholder: 'Город или почтовый индекс',
      filters: 'Фильтры', jobType: 'Тип Работы', workModel: 'Формат Работы', experienceLevel: 'Уровень Опыта',
      industry: 'Отрасль', allIndustries: 'Все Отрасли',
      searching: 'Поиск...', jobsFound: 'вакансий найдено', noJobs: 'Вакансии не найдены',
      noJobsDesc: 'Попробуйте изменить параметры поиска или фильтры',
      sort: { newest: 'Сначала Новые', salaryHigh: 'Высокая Зарплата', salaryLow: 'Низкая Зарплата', oldest: 'Сначала Старые' },
      badges: { featured: 'Рекомендуемая', premium: 'Премиум', urgent: 'Срочно' },
      previous: 'Назад', next: 'Далее', page: 'Страница', of: 'из', more: 'ещё',
    },
    jobDetail: {
      backToJobs: 'Назад к вакансиям', applyNow: 'Откликнуться', applied: 'Откликнулись', saved: 'Сохранено', save: 'Сохранить', share: 'Поделиться',
      aboutRole: 'О позиции', requirements: 'Требования', responsibilities: 'Обязанности', skills: 'Навыки',
      jobDetails: 'Детали Вакансии', salary: 'Зарплата', jobType: 'Тип Работы', workModel: 'Формат Работы',
      experience: 'Опыт', industry: 'Отрасль', posted: 'Опубликовано', benefits: 'Преимущества',
      about: 'О компании', viewCompany: 'Профиль Компании',
      applyModal: { title: 'Отклик на', at: 'в', coverLetter: 'Сопроводительное письмо (необязательно)', coverLetterPlaceholder: 'Расскажите работодателю, почему вы подходите...', submit: 'Отправить Заявку', submitting: 'Отправка...', cancel: 'Отмена' },
      notSpecified: 'Не указано', perYear: '/ год',
      toasts: { applied: 'Заявка успешно отправлена!', failed: 'Не удалось откликнуться', saved: 'Вакансия сохранена!', unsaved: 'Вакансия удалена из сохранённых', saveFailed: 'Не удалось сохранить' },
      reviews: 'Отзывы', pros: 'Плюсы', cons: 'Минусы',
      openPositions: 'Открытые Позиции', noPositions: 'В данный момент открытых позиций нет', companyNotFound: 'Компания не найдена',
      verified: 'Проверена', employees: 'сотрудников',
    },
    companies: {
      title: 'Компании', hiring: 'компаний нанимают на JobMarket', searchPlaceholder: 'Поиск компаний...',
      noCompanies: 'Компании не найдены', noCompaniesDesc: 'Попробуйте другой поисковый запрос', openJobs: 'открытых вакансий',
    },
    dashboard: {
      welcome: 'С возвращением', welcomeName: 'С возвращением,', subtitle: 'Что происходит с вашим поиском работы',
      upgradePremium: 'Обновить до Премиум', postJob: 'Разместить Вакансию',
      freePlan: 'Бесплатный План', runningLow: 'Заканчивается', remainingApps: 'заявок осталось в этом месяце',
      unlimitedApps: 'Безлимитные заявки',
      upgradeDesc: 'Обновитесь до Премиум для безлимитных заявок, приоритета и многого другого.',
      upgradePrice: 'Обновить - $9.99/мес',
      stats: { applications: 'Заявки', remaining: 'Осталось', profileViews: 'Просмотры Профиля', plan: 'План', thisMonth: 'в этом месяце', premiumPlan: 'Премиум план', applicationsLeft: 'заявок осталось', totalViews: 'всего просмотров', active: 'активен', upgradeAvailable: 'доступно обновление' },
      recentApps: 'Последние Заявки', viewAll: 'Показать все', noApps: 'Заявок пока нет', noAppsDesc: 'Начните откликаться на вакансии, чтобы отслеживать прогресс здесь.',
      browseJobs: 'Просмотреть Вакансии', quickActions: 'Быстрые Действия', editProfile: 'Редактировать Профиль', savedJobs: 'Сохранённые', applications: 'Заявки',
      recommended: 'Рекомендовано', unlimited: 'Безлимитно', premium: 'Премиум', free: 'Бесплатно',
    },
    applications: {
      title: 'Мои Заявки', total: 'всего заявок', browseJobs: 'Просмотреть Вакансии',
      all: 'Все', noApps: 'Заявки не найдены', noAppsFiltered: 'Нет заявок с этим статусом', noAppsDesc: 'Начните откликаться на вакансии, чтобы увидеть их здесь',
      priority: 'Приоритет', applied: 'Подана', withdraw: 'Отозвать',
      interview: 'Собеседование назначено:', confirmWithdraw: 'Вы уверены, что хотите отозвать эту заявку?',
      previous: 'Назад', next: 'Далее',
    },
    profile: {
      title: 'Редактировать Профиль', subtitle: 'Обновляйте профиль, чтобы привлекать работодателей',
      saveChanges: 'Сохранить', saving: 'Сохранение...', saveAll: 'Сохранить Все Изменения',
      basicInfo: 'Основная Информация', firstName: 'Имя', lastName: 'Фамилия', headline: 'Заголовок',
      headlinePlaceholder: 'напр. Старший разработчик с 5+ летним опытом',
      phone: 'Телефон', phonePlaceholder: '+7 (999) 000-00-00', city: 'Город', cityPlaceholder: 'Москва', state: 'Регион', statePlaceholder: 'МО',
      about: 'О себе', bioPlaceholder: 'Расскажите работодателям о себе, опыте и что вы ищете...',
      experience: 'Опыт', yearsExp: 'Лет Опыта', expLevel: 'Уровень Опыта', salaryExp: 'Ожидаемая Зарплата (годовая)',
      salaryPlaceholder: 'напр. 100000', openToWork: 'Открыт к предложениям',
      skills: 'Навыки', skillPlaceholder: 'Введите навык и нажмите Enter', add: 'Добавить', popularSkills: 'Популярные навыки:',
      links: 'Ссылки', linkedin: 'LinkedIn URL', linkedinPlaceholder: 'https://linkedin.com/in/вашеимя',
      portfolio: 'Портфолио URL', portfolioPlaceholder: 'https://portfolio.com',
      github: 'GitHub URL', githubPlaceholder: 'https://github.com/вашеимя',
      resume: 'Резюме', uploadResume: 'Загрузите резюме', resumeFormats: 'PDF, DOC или DOCX до 5МБ',
    },
    messages: {
      title: 'Сообщения', premiumFeature: 'Премиум Функция', premiumDesc: 'Прямые сообщения доступны для Премиум пользователей',
      upgradePremium: 'Обновить до Премиум', searchPlaceholder: 'Поиск бесед...', noConversations: 'Бесед пока нет',
      conversation: 'Беседа', back: 'Назад', typePlaceholder: 'Напишите сообщение...', send: 'Отправить',
      selectConversation: 'Выберите беседу для начала общения',
      toasts: { failed: 'Не удалось отправить', sendFailed: 'Не удалось отправить сообщение' },
    },
    saved: {
      title: 'Сохранённые Вакансии', savedCount: 'сохранённых вакансий', noSaved: 'Нет сохранённых вакансий', noSavedDesc: 'Сохраняйте вакансии для просмотра позже',
      browseJobs: 'Просмотреть Вакансии', removed: 'Вакансия удалена', removeFailed: 'Не удалось удалить',
    },
    postJob: {
      createCompany: 'Создать Профиль Компании', createCompanyDesc: 'Вам нужен профиль компании перед размещением вакансий',
      companyName: 'Название Компании *', description: 'Описание', industry: 'Отрасль', selectIndustry: 'Выберите',
      website: 'Веб-сайт', city: 'Город', state: 'Регион', createCompanyBtn: 'Создать Компанию',
      title: 'Разместить Вакансию', subtitle: 'Заполните данные для создания нового объявления',
      jobDetails: 'Детали Вакансии', jobTitle: 'Должность *', jobTitlePlaceholder: 'напр. Старший Разработчик',
      jobDesc: 'Описание *', jobDescPlaceholder: 'Опишите роль, команду и что делает эту возможность особенной...',
      jobType: 'Тип Работы', workModel: 'Формат Работы', expLevel: 'Уровень Опыта',
      locationSalary: 'Местоположение и Зарплата', minSalary: 'Мин. Зарплата (годовая)', maxSalary: 'Макс. Зарплата (годовая)',
      salaryPlaceholder: 'напр. 100000',
      requirements: 'Требования', reqPlaceholder: 'напр. 3+ лет опыта с React', addReq: '+ Добавить Требование',
      responsibilities: 'Обязанности', respPlaceholder: 'напр. Разработка и внедрение новых функций', addResp: '+ Добавить Обязанность',
      benefits: 'Преимущества', benefitPlaceholder: 'напр. Медицинская страховка', addBenefit: '+ Добавить Преимущество',
      requiredSkills: 'Требуемые Навыки', skillPlaceholder: 'Введите навык и нажмите Enter', add: 'Добавить',
      postJob: 'Разместить', posting: 'Публикация...', companyCreated: 'Компания создана!', jobPosted: 'Вакансия опубликована!',
    },
    admin: {
      dashboard: 'Панель Администратора', subtitle: 'Обзор платформы и управление', manageUsers: 'Управление Пользователями', manageJobs: 'Управление Вакансиями',
      stats: { totalUsers: 'Всего Пользователей', activeJobs: 'Активные Вакансии', applications: 'Заявки', revenue: 'Доход', premiumUsers: 'Премиум Пользователи', companies: 'Компании', thisMonth: 'в этом месяце', total: 'всего', conversion: 'конверсия', verified: 'проверено' },
      userGrowth: 'Рост Пользователей (6 мес)', jobsByType: 'Вакансии по Типу', appsByStatus: 'Заявки по Статусу',
      jobs: { title: 'Управление Вакансиями', searchPlaceholder: 'Поиск вакансий или компаний...', job: 'Вакансия', company: 'Компания', applications: 'Заявки', views: 'Просмотры', status: 'Статус', actions: 'Действия',
        active: 'Активна', inactive: 'Неактивна', deactivate: 'Деактивировать', activate: 'Активировать', unfeature: 'Убрать из рекоменд.', feature: 'Рекомендовать', noJobs: 'Вакансии не найдены' },
      users: { title: 'Управление Пользователями', searchPlaceholder: 'Поиск по email или имени...', allRoles: 'Все Роли', jobSeekers: 'Соискатели', employers: 'Работодатели', recruiters: 'Рекрутеры', admins: 'Администраторы',
        user: 'Пользователь', role: 'Роль', plan: 'План', applications: 'Заявки', joined: 'Регистрация', actions: 'Действия',
        deactivate: 'Деактивировать', activate: 'Активировать', noUsers: 'Пользователи не найдены' },
      previous: 'Назад', next: 'Далее',
    },
    common: { loading: 'Загрузка...', somethingWrong: 'Что-то пошло не так' },
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string | string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('workwave-locale') as Locale;
    if (saved && ['en', 'az', 'ru'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('workwave-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string | string[] => {
    const keys = key.split('.');
    let value: any = translations[locale];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  az: 'Azərbaycan',
  ru: 'Русский',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  az: '🇦🇿',
  ru: '🇷🇺',
};
