'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'az' | 'ru';

export interface Translations {
  [key: string]: string | string[] | Translations;
}

const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: 'Home',
      jobs: 'Browse Jobs',
      companies: 'Companies',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      signUp: 'Get Started',
      signOut: 'Sign Out',
      language: 'Language',
    },
    hero: {
      badge: '10,000+ active job listings in your area',
      title: 'Find Your Next Opportunity,',
      titleAccent: 'Locally',
      subtitle: 'Find your next opportunity, locally. The fastest way to connect with employers in your city.',
      searchPlaceholder: 'Job title, keyword, or company',
      locationPlaceholder: 'City or zip code',
      search: 'Search',
      remote: 'Remote',
      engineering: 'Engineering',
      marketing: 'Marketing',
      design: 'Design',
      sales: 'Sales',
    },
    stats: {
      activeJobs: 'Active Jobs',
      companies: 'Companies',
      hiredThisMonth: 'Hired This Month',
      cities: 'Cities',
    },
    features: {
      title: 'Everything you need to land your dream job',
      subtitle: 'Powerful tools designed to make your job search faster and more effective.',
      localSearch: {
        title: 'Hyper-Local Search',
        description: 'Find jobs near you with precise location-based filtering. No more sifting through irrelevant results.',
      },
      oneClick: {
        title: '1-Click Apply',
        description: 'Apply to jobs instantly with your saved profile. No lengthy forms, no friction.',
      },
      verified: {
        title: 'Verified Employers',
        description: 'Every company is verified so you can apply with confidence. No scams, no fake listings.',
      },
      tracking: {
        title: 'Track Applications',
        description: 'See exactly where you stand with every application. Real-time status updates.',
      },
      messaging: {
        title: 'Direct Messaging',
        description: 'Chat directly with employers and recruiters. No more playing phone tag.',
      },
      aiTips: {
        title: 'AI Resume Tips',
        description: 'Get smart suggestions to improve your resume and stand out from the crowd.',
      },
    },
    pricing: {
      title: 'Simple, transparent pricing',
      subtitle: 'Start free, upgrade when you are ready. No hidden fees.',
      free: {
        name: 'Free',
        features: ['Browse all local jobs', 'Create a basic profile', '5 applications per month', 'View company profiles & reviews'],
      },
      premium: {
        name: 'Premium',
        period: '/month',
        badge: 'Most Popular',
        features: ['Everything in Free', 'Unlimited applications', 'Priority application ranking', 'Advanced job filters', 'Application tracking dashboard', 'AI resume optimization', 'Direct messaging with employers', 'Exclusive premium-only jobs'],
      },
      getStarted: 'Get Started',
    },
    cta: {
      title: 'Ready to find your next opportunity?',
      subtitle: 'Join thousands of job seekers who have already found their dream jobs through JobMarket.',
      createAccount: 'Create Free Account',
      browseJobs: 'Browse Jobs',
    },
    footer: {
      description: 'Connecting local talent with local opportunities. Find your dream job today.',
      jobSeekers: 'Job Seekers',
      employers: 'Employers',
      support: 'Support',
      browseJobs: 'Browse Jobs',
      companies: 'Companies',
      premium: 'Premium',
      createAccount: 'Create Account',
      postJob: 'Post a Job',
      pricing: 'Pricing',
      companyProfile: 'Company Profile',
      helpCenter: 'Help Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      rights: 'All rights reserved.',
    },
  },
  az: {
    nav: {
      home: 'Ana Səhifə',
      jobs: 'Vakansiyalar',
      companies: 'Şirkətlər',
      pricing: 'Qiymətlər',
      dashboard: 'İdarə Paneli',
      signIn: 'Daxil Ol',
      signUp: 'Başla',
      signOut: 'Çıxış',
      language: 'Dil',
    },
    hero: {
      badge: 'Bölgənizdə 10,000+ aktiv vakansiya',
      title: 'Növbəti Fürsətinizi Tapın,',
      titleAccent: 'Yerli Olaraq',
      subtitle: 'Növbəti fürsətinizi, yerli olaraq tapın. Şəhərinizdə işəgötürənlərlə əlaqə qurmağın ən sürətli yolu.',
      searchPlaceholder: 'Vəzifə, açar söz və ya şirkət',
      locationPlaceholder: 'Şəhər və ya poçt kodu',
      search: 'Axtar',
      remote: 'Məsafədən',
      engineering: 'Mühəndislik',
      marketing: 'Marketinq',
      design: 'Dizayn',
      sales: 'Satış',
    },
    stats: {
      activeJobs: 'Aktiv Vakansiyalar',
      companies: 'Şirkətlər',
      hiredThisMonth: 'Bu Ay İşə Götürülənlər',
      cities: 'Şəhərlər',
    },
    features: {
      title: 'Xəyal işinizi tapmaq üçün lazım olan hər şey',
      subtitle: 'İş axtarışınızı daha sürətli və effektiv etmək üçün hazırlanmış güclü alətlər.',
      localSearch: {
        title: 'Hiper-Yerli Axtarış',
        description: 'Dəqiq yer-based filtrasiya ilə yaxınlığınızdakı işləri tapın. Artıq lazımsız nəticələrə baxmaq yoxdur.',
      },
      oneClick: {
        title: '1-Klik Müraciət',
        description: 'Saxlanmış profilinizlə dərhal işlərə müraciət edin. Uzun formalara ehtiyac yoxdur.',
      },
      verified: {
        title: 'Təsdiqlənmiş İşəgötürənlər',
        description: 'Hər şirkət təsdiqlənib ki, siz əminliklə müraciət edə biləsiniz. Saxtakarlıq yoxdur.',
      },
      tracking: {
        title: 'Müraciətləri İzləyin',
        description: 'Hər müraciətinizdə harada olduğunuzu dəqiq bilin. Real vaxt yeniləmələri.',
      },
      messaging: {
        title: 'Birbaşa Mesajlaşma',
        description: 'İşəgötürənlər və recruiterlərlə birbaşa danışın. Artıq telefon oyunu yoxdur.',
      },
      aiTips: {
        title: 'CV Məsləhətləri',
        description: 'CV-nizi yaxşılaşdırmaq üçün ağıllı tövsiyələr alın və izdihamdan fərqlənin.',
      },
    },
    pricing: {
      title: 'Sadə, şəffaf qiymətlər',
      subtitle: 'Pulsuz başlayın, hazır olduğunuzda yüksəldin. Gizli ödəniş yoxdur.',
      free: {
        name: 'Pulsuz',
        features: ['Bütün yerli işlərə baxın', 'Əsas profil yaradın', 'Aya 5 müraciət', 'Şirkət profillərinə baxın'],
      },
      premium: {
        name: 'Premium',
        period: '/ay',
        badge: 'Ən Populyar',
        features: ['Pulsuz paktda olan hər şey', 'Limitsiz müraciətlər', 'Prioritet müraciət sıralaması', 'Təkmil filtrlər', 'Müraciət izləmə paneli', 'CV optimallaşdırması', 'İşəgötürənlərlə birbaşa mesajlaşma', 'Xüsusi premium işlər'],
      },
      getStarted: 'Başla',
    },
    cta: {
      title: 'Növbəti fürsətinizi tapmağa hazırsınız?',
      subtitle: 'JobMarket vasitəsilə artıq xəyal işlərini tapmış minlərlə iş axtarana qoşulun.',
      createAccount: 'Pulsuz Hesab Yaradın',
      browseJobs: 'Vakansiyaları Gör',
    },
    footer: {
      description: 'Yerli istedadları yerli fürsətlərlə birləşdiririk. Bu gün xəyal işinizi tapın.',
      jobSeekers: 'İş Axtaranlar',
      employers: 'İşəgötürənlər',
      support: 'Dəstək',
      browseJobs: 'Vakansiyaları Gör',
      companies: 'Şirkətlər',
      premium: 'Premium',
      createAccount: 'Hesab Yaradın',
      postJob: 'İş Yerləşdir',
      pricing: 'Qiymətlər',
      companyProfile: 'Şirkət Profili',
      helpCenter: 'Kömək Mərkəzi',
      privacy: 'Məxfilik Siyasəti',
      terms: 'Xidmət Şərtləri',
      contact: 'Bizimlə Əlaqə',
      rights: 'Bütün hüquqlar qorunur.',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      jobs: 'Вакансии',
      companies: 'Компании',
      pricing: 'Цены',
      dashboard: 'Панель',
      signIn: 'Войти',
      signUp: 'Начать',
      signOut: 'Выйти',
      language: 'Язык',
    },
    hero: {
      badge: '10,000+ активных вакансий в вашем регионе',
      title: 'Найдите Свою Следующую Возможность,',
      titleAccent: 'Локально',
      subtitle: 'Найдите свою следующую возможность локально. Самый быстрый способ связаться с работодателями в вашем городе.',
      searchPlaceholder: 'Должность, ключевое слово или компания',
      locationPlaceholder: 'Город или почтовый индекс',
      search: 'Поиск',
      remote: 'Удалённо',
      engineering: 'Инженерия',
      marketing: 'Маркетинг',
      design: 'Дизайн',
      sales: 'Продажи',
    },
    stats: {
      activeJobs: 'Активные Вакансии',
      companies: 'Компании',
      hiredThisMonth: 'Нанятых В Эттом Месяце',
      cities: 'Города',
    },
    features: {
      title: 'Всё необходимое для получения работы мечты',
      subtitle: 'Мощные инструменты для более быстрого и эффективного поиска работы.',
      localSearch: {
        title: 'Локальный Поиск',
        description: 'Находите работы рядом с вами с помощью точной геолокационной фильтрации.',
      },
      oneClick: {
        title: 'Подача Заявки в 1 Клик',
        description: 'Подавайте заявки мгновенно с сохранённым профилем. Без длинных форм.',
      },
      verified: {
        title: 'Проверенные Работодатели',
        description: 'Каждая компания проверена. Подавайте заявки с уверенностью.',
      },
      tracking: {
        title: 'Отслеживание Заявок',
        description: 'Отслеживайте статус каждой заявки в реальном времени.',
      },
      messaging: {
        title: 'Прямое Общение',
        description: 'Общайтесь напрямую с работодателями и рекрутерами.',
      },
      aiTips: {
        title: 'Советы по Резюме',
        description: 'Получайте умные рекомендации по улучшению резюме.',
      },
    },
    pricing: {
      title: 'Простое, прозрачное ценообразование',
      subtitle: 'Начните бесплатно, обновитесь когда будете готовы. Без скрытых платежей.',
      free: {
        name: 'Бесплатно',
        features: ['Просмотр всех вакансий', 'Создание профиля', '5 заявок в месяц', 'Просмотр профилей компаний'],
      },
      premium: {
        name: 'Премиум',
        period: '/месяц',
        badge: 'Самый Популярный',
        features: ['Всё из бесплатного', 'Безлимитные заявки', 'Приоритетное ранжирование', 'Расширенные фильтры', 'Панель отслеживания', 'Оптимизация резюме', 'Прямое общение с работодателями', 'Эксклюзивные вакансии'],
      },
      getStarted: 'Начать',
    },
    cta: {
      title: 'Готовы найти свою следующую возможность?',
      subtitle: 'Присоединяйтесь к тысячам соискателей, которые уже нашли работу мечты через JobMarket.',
      createAccount: 'Создать Бесплатный Аккаунт',
      browseJobs: 'Просмотреть Вакансии',
    },
    footer: {
      description: 'Соединяем местные таланты с местными возможностями. Найдите работу мечты сегодня.',
      jobSeekers: 'Соискателям',
      employers: 'Работодателям',
      support: 'Поддержка',
      browseJobs: 'Просмотреть Вакансии',
      companies: 'Компании',
      premium: 'Премиум',
      createAccount: 'Создать Аккаунт',
      postJob: 'Разместить Вакансию',
      pricing: 'Цены',
      companyProfile: 'Профиль Компании',
      helpCenter: 'Центр Помощи',
      privacy: 'Политика Конфиденциальности',
      terms: 'Условия Использования',
      contact: 'Связаться с Нами',
      rights: 'Все права защищены.',
    },
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
