import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      brand: { title: 'HWS فيديوهات' },
      home: {
        heading: '📺 مكتبة فيديوهات HWS',
        loading: 'جارِ التحميل…',
        pageXofY: 'صفحة {{x}} من {{y}}',
        prev: 'السابق',
        next: 'التالي',
        heroTitle: 'فيديوهات تدريب HotelRunner',
        heroSubtitle: 'تعلّم خصائص المنصة بسرعة مع فيديوهات قصيرة ومباشرة.',
      },
      filters: {
        searchPlaceholder: 'ابحث بعنوان أو وصف أو وسم...',
        allCategories: 'كل التصنيفات',
        allLanguages: 'كل اللغات',
        apply: 'تطبيق الفلاتر',
        reset: 'إعادة تعيين',
      },
      empty: {
        title: 'لا توجد نتائج',
        hint: 'جرّب تعديل كلمات البحث أو الفلاتر.',
      },
      watch: {
        back: '← رجوع إلى المكتبة',
        info: 'معلومات',
        category: 'التصنيف',
        language: 'اللغة',
        tags: 'الوسوم',
        invalid: 'رابط YouTube غير صالح',
        share: 'مشاركة',
        related: 'فيديوهات ذات صلة',
        shareWhatsApp: 'مشاركة واتساب',
        shareEmail: 'مشاركة عبر البريد',
      },
      lang: { label: 'اللغة', ar: 'العربية', fr: 'الفرنسية', en: 'الإنجليزية' },
    },
  },
  fr: {
    translation: {
      brand: { title: 'HWS Vidéos' },
      home: {
        heading: '📺 Bibliothèque des vidéos HWS',
        loading: 'Chargement…',
        pageXofY: 'Page {{x}} sur {{y}}',
        prev: 'Précédent',
        next: 'Suivant',
        heroTitle: 'Vidéos de formation HotelRunner',
        heroSubtitle: 'Apprenez les fonctionnalités de la plateforme rapidement grâce à des vidéos courtes et directes.',
      },
      filters: {
        searchPlaceholder: 'Rechercher par titre, description ou tag…',
        allCategories: 'Toutes les catégories',
        allLanguages: 'Toutes les langues',
        apply: 'Appliquer',
        reset: 'Réinitialiser',
      },
      empty: {
        title: 'Aucun résultat',
        hint: "Essayez d’ajuster les mots-clés ou les filtres.",
      },
      watch: {
        back: '← Retour à la bibliothèque',
        info: 'Informations',
        category: 'Catégorie',
        language: 'Langue',
        tags: 'Tags',
        invalid: 'Lien YouTube invalide',
        share: 'Partager',
        related: 'Vidéos connexes',
        shareWhatsApp: 'Partager sur WhatsApp',
        shareEmail: 'Partager par e-mail',
      },
      lang: { label: 'Langue', ar: 'Arabe', fr: 'Français', en: 'Anglais' },
    },
  },
  en: {
    translation: {
      brand: { title: 'HWS Videos' },
      home: {
        heading: '📺 HWS Video Library',
        loading: 'Loading…',
        pageXofY: 'Page {{x}} of {{y}}',
        prev: 'Prev',
        next: 'Next',
        heroTitle: 'HotelRunner Training Videos',
        heroSubtitle: 'Learn platform features quickly with short, direct videos.',
      },
      filters: {
        searchPlaceholder: 'Search by title, description or tag…',
        allCategories: 'All categories',
        allLanguages: 'All languages',
        apply: 'Apply Filters',
        reset: 'Reset',
      },
      empty: {
        title: 'No results',
        hint: 'Try changing search keywords or filters.',
      },
      watch: {
        back: '← Back to library',
        info: 'Information',
        category: 'Category',
        language: 'Language',
        tags: 'Tags',
        invalid: 'Invalid YouTube link',
        share: 'Share',
        related: 'Related videos',
        shareWhatsApp: 'Share on WhatsApp',
        shareEmail: 'Share via Email',
      },
      lang: { label: 'Language', ar: 'Arabic', fr: 'French', en: 'English' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
