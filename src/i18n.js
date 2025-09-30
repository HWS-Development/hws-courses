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
      

      auth: {
        createAccount: 'إنشاء حساب',
        signIn: 'تسجيل الدخول',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        register: 'تسجيل',
        or: 'أو',
        continueWithGoogle: 'المتابعة عبر Google',
        checkEmail: 'تحقق من بريدك الإلكتروني لتأكيد الحساب.',
        somethingWrong: 'حدث خطأ ما',
        haveAccount: 'لديك حساب مسبقاً؟',
        newHere: 'مستخدم جديد؟',
        logout: 'تسجيل الخروج',
        forgot: 'نسيت كلمة المرور؟',
        resetPassword: 'إعادة تعيين كلمة المرور',
        sendResetLink: 'إرسال رابط إعادة التعيين',
        backToLogin: 'الرجوع لتسجيل الدخول',
        loading: 'جارٍ...',
capsOn: 'Caps Lock مفعّل',
show: 'إظهار',
hide: 'إخفاء',
remember: 'تذكّرني',
rules: '8+ أحرف، حروف كبيرة/صغيرة، رقم ورمز',
strength: { veryWeak: 'ضعيف جدًا', weak: 'ضعيف', ok: 'مقبول', good: 'جيد', strong: 'قوي' },
errEmailRequired: 'البريد مطلوب',
errEmailInvalid: 'بريد غير صالح',
errPwShort: 'كلمة المرور أقصر من المطلوب',

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
      auth: {
        createAccount: 'Créer un compte',
        signIn: 'Se connecter',
        email: 'E-mail',
        password: 'Mot de passe',
        register: 'S’inscrire',
        or: 'ou',
        continueWithGoogle: 'Continuer avec Google',
        checkEmail: 'Vérifiez votre e-mail pour confirmer votre compte.',
        somethingWrong: 'Une erreur est survenue',
        haveAccount: 'Vous avez déjà un compte ?',
        newHere: 'Nouveau ici ?',
        logout: 'Se déconnecter',
        forgot: 'Mot de passe oublié ?',
        resetPassword: 'Réinitialiser le mot de passe',
        sendResetLink: 'Envoyer le lien de réinitialisation',
        backToLogin: 'Retour à la connexion',
        loading: 'Chargement…',
capsOn: 'Verrouillage maj. activé',
show: 'Afficher',
hide: 'Masquer',
remember: 'Se souvenir de moi',
rules: '≥8 caractères, maj/min, nombre & symbole',
strength: { veryWeak: 'Très faible', weak: 'Faible', ok: 'Correct', good: 'Bon', strong: 'Fort' },
errEmailRequired: 'E-mail requis',
errEmailInvalid: 'E-mail invalide',
errPwShort: 'Mot de passe trop court',


      }
      ,
      
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
      auth: {
        createAccount: 'Create account',
        signIn: 'Sign in',
        email: 'Email',
        password: 'Password',
        register: 'Register',
        or: 'or',
        continueWithGoogle: 'Continue with Google',
        checkEmail: 'Check your email to confirm your account.',
        somethingWrong: 'Something went wrong',
        haveAccount: 'Already have an account?',
        newHere: 'New here?',
        logout: 'Logout',
        forgot: 'Forgot password?',
        resetPassword: 'Reset password',
        sendResetLink: 'Send reset link',
        backToLogin: 'Back to login',
        loading: 'Loading…',
capsOn: 'Caps Lock is on',
show: 'Show',
hide: 'Hide',
remember: 'Remember me',
rules: '8+ chars, upper/lower, number & symbol',
strength: { veryWeak: 'Very weak', weak: 'Weak', ok: 'Okay', good: 'Good', strong: 'Strong' },
errEmailRequired: 'Email is required',
errEmailInvalid: 'Invalid email',
errPwShort: 'Password too short',

      }
      ,
      
      lang: { label: 'Language', ar: 'Arabic', fr: 'French', en: 'English' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
