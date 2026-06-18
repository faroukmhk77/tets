export type Lang = 'fr' | 'ar' | 'darija';

export const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  'nav.home': { fr: 'Accueil', ar: 'الرئيسية', darija: 'الدار' },
  'nav.shop': { fr: 'Boutique', ar: 'المتجر', darija: 'البوتيك' },
  'nav.about': { fr: 'À Propos', ar: 'من نحن', darija: 'علاش' },
  'nav.contact': { fr: 'Contact', ar: 'اتصل بنا', darija: 'كونطاك' },
  'nav.faq': { fr: 'FAQ', ar: 'الأسئلة الشائعة', darija: 'الأسئلة لي كيتكراو' },
  'nav.wishlist': { fr: 'Favoris', ar: 'المفضلة', darija: 'المفضلة' },
  'nav.cart': { fr: 'Panier', ar: 'السلة', darija: 'الكابا' },
  'nav.admin': { fr: 'Admin', ar: 'الإدارة', darija: 'الأدمين' },

  // Hero
  'hero.subtitle': { fr: 'Collection Exclusive', ar: 'مجموعة حصرية', darija: 'كولكسيون حصرية' },
  'hero.cta': { fr: 'Découvrir la Collection', ar: 'اكتشف المجموعة', darija: 'اكتشف الكولكسيون' },
  'hero.cta2': { fr: 'Voir les Nouveautés', ar: 'شاهد الجديد', darija: 'شوف الجديد' },

  // Product
  'product.addToCart': { fr: 'Ajouter au Panier', ar: 'أضف إلى السلة', darija: 'زيد فالكابا' },
  'product.orderWhatsApp': { fr: 'Commander sur WhatsApp', ar: 'اطلب عبر واتساب', darija: 'أوردي علا واتساب' },
  'product.selectSize': { fr: 'Choisir la taille', ar: 'اختر المقاس', darija: 'اختر المقاس' },
  'product.price': { fr: 'Prix', ar: 'السعر', darija: 'البري' },
  'product.condition': { fr: 'État', ar: 'الحالة', darija: 'الحالة' },
  'product.description': { fr: 'Description', ar: 'الوصف', darija: 'الوصف' },
  'product.sizes': { fr: 'Tailles', ar: 'المقاسات', darija: 'المقاسات' },
  'product.stock': { fr: 'En stock', ar: 'متوفر', darija: 'كاين' },
  'product.outOfStock': { fr: 'Rupture de stock', ar: 'غير متوفر', darija: 'ما كاينش' },
  'product.related': { fr: 'Produits Similaires', ar: 'منتجات مشابهة', darija: 'برودوي مشابهين' },
  'product.quantity': { fr: 'Quantité', ar: 'الكمية', darija: 'الكمية' },
  'product.mad': { fr: 'MAD', ar: 'درهم', darija: 'درهم' },

  // Cart
  'cart.title': { fr: 'Votre Panier', ar: 'سلتك', darija: 'الكابا ديالك' },
  'cart.empty': { fr: 'Votre panier est vide', ar: 'سلتك فارغة', darija: 'الكابا ديالك خاوية' },
  'cart.total': { fr: 'Total', ar: 'المجموع', darija: 'التوتال' },
  'cart.checkout': { fr: 'Commander sur WhatsApp', ar: 'اطلب عبر واتساب', darija: 'أوردي علا واتساب' },
  'cart.remove': { fr: 'Supprimer', ar: 'حذف', darija: 'حيد' },
  'cart.subtotal': { fr: 'Sous-total', ar: 'المجموع الفرعي', darija: 'السوتوتال' },

  // Wishlist
  'wishlist.title': { fr: 'Mes Favoris', ar: 'مفضلتي', darija: 'المفضلة ديالي' },
  'wishlist.empty': { fr: 'Aucun favori', ar: 'لا توجد مفضلات', darija: 'ما كاين حتا مفضلة' },
  'wishlist.added': { fr: 'Ajouté aux favoris', ar: 'تمت الإضافة إلى المفضلة', darija: 'تزادت للمفضلة' },

  // Order form
  'order.title': { fr: 'Passer la Commande', ar: 'تقديم الطلب', darija: 'أوردي' },
  'order.name': { fr: 'Nom Complet', ar: 'الاسم الكامل', darija: 'الاسم الكامل' },
  'order.phone': { fr: 'Numéro de Téléphone', ar: 'رقم الهاتف', darija: 'نوميرو ديال التيليفون' },
  'order.phoneLabel': { fr: 'Téléphone', ar: 'الهاتف', darija: 'التيليفون' },
  'order.city': { fr: 'Ville', ar: 'المدينة', darija: 'المدينة' },
  'order.address': { fr: 'Adresse', ar: 'العنوان', darija: 'لادريس' },
  'order.submit': { fr: 'Confirmer et Commander sur WhatsApp', ar: 'تأكيد والطلب عبر واتساب', darija: 'أكد وأوردي علا واتساب' },
  'order.success': { fr: 'Commande envoyée avec succès!', ar: 'تم إرسال الطلب بنجاح!', darija: 'تم إرسال الطلب بنجاح!' },

  // Sections
  'section.featured': { fr: 'Produits Vedettes', ar: 'منتجات مميزة', darija: 'برودوي مميزين' },
  'section.newArrivals': { fr: 'Nouveautés', ar: 'الجديد', darija: 'الجديد' },
  'section.bestSellers': { fr: 'Meilleures Ventes', ar: 'الأكثر مبيعاً', darija: 'لي كيتباع بزاف' },
  'section.limited': { fr: 'Édition Limitée', ar: 'إصدار محدود', darija: 'إيديسيون ليميتي' },
  'section.trust': { fr: 'Pourquoi Nous Choisir', ar: 'لماذا تختارنا', darija: 'علاش تختارنا' },
  'section.testimonials': { fr: 'Avis Clients', ar: 'آراء العملاء', darija: 'آراء الكليان' },
  'section.instagram': { fr: 'Suivez-nous sur Instagram', ar: 'تابعنا على إنستغرام', darija: 'تابعنا علا إنستا' },
  'section.newsletter': { fr: 'Newsletter', ar: 'النشرة الإخبارية', darija: 'النشرة' },
  'section.subscribe': { fr: "S'abonner", ar: 'اشترك', darija: 'أشترك' },
  'section.email': { fr: 'Votre email', ar: 'بريدك الإلكتروني', darija: 'لإيميل ديالك' },

  // Trust
  'trust.authentic': { fr: '100% Authentique', ar: '100% أصلي', darija: '100% أصلي' },
  'trust.authenticDesc': { fr: 'Chaque paire est vérifiée pour son authenticité', ar: 'كل زوج يتم التحقق من أصالته', darija: 'كل پاي كيتشيك على أصالتو' },
  'trust.quality': { fr: 'Qualité Premium', ar: 'جودة فاخرة', darija: 'كواليتي بريميوم' },
  'trust.qualityDesc': { fr: 'Sélection rigoureuse des meilleures pièces', ar: 'اختيار دقيق لأفضل القطع', darija: 'اختيار دقيق لأحسن القطع' },
  'trust.delivery': { fr: 'Livraison Rapide', ar: 'توصيل سريع', darija: 'ليفريسون خفيفة' },
  'trust.deliveryDesc': { fr: 'Livraison partout au Maroc', ar: 'توصيل لكل أنحاء المغرب', darija: 'ليفريسون فكل بلاصة فالمغرب' },
  'trust.support': { fr: 'Support WhatsApp', ar: 'دعم واتساب', darija: 'سوبور واتساب' },
  'trust.supportDesc': { fr: 'Réponse rapide via WhatsApp', ar: 'رد سريع عبر واتساب', darija: 'جواب خفيف علا واتساب' },

  // Footer
  'footer.rights': { fr: 'Tous droits réservés', ar: 'جميع الحقوق محفوظة', darija: 'كل الحقوق محفوظة' },
  'footer.quickLinks': { fr: 'Liens Rapides', ar: 'روابط سريعة', darija: 'روابط خفيفة' },
  'footer.contactUs': { fr: 'Contactez-nous', ar: 'اتصل بنا', darija: 'كونطاكتنا' },

  // About
  'about.title': { fr: 'À Propos de Nous', ar: 'من نحن', darija: 'علاش' },
  'about.story': { fr: 'Notre Histoire', ar: 'قصتنا', darija: 'قصتنا' },

  // Contact
  'contact.title': { fr: 'Contactez-nous', ar: 'اتصل بنا', darija: 'كونطاكتنا' },
  'contact.subtitle': { fr: 'Nous sommes là pour vous aider', ar: 'نحن هنا لمساعدتك', darija: 'كناين باش نعاونوك' },
  'contact.sendWhatsApp': { fr: 'Envoyer un message WhatsApp', ar: 'أرسل رسالة واتساب', darija: 'صيفط مساج علا واتساب' },

  // FAQ
  'faq.title': { fr: 'Questions Fréquentes', ar: 'الأسئلة الشائعة', darija: 'الأسئلة لي كيتكراو' },

  // Admin
  'admin.login': { fr: 'Connexion', ar: 'تسجيل الدخول', darija: 'الكونيكسيون' },
  'admin.email': { fr: 'Email', ar: 'البريد الإلكتروني', darija: 'لإيميل' },
  'admin.password': { fr: 'Mot de passe', ar: 'كلمة المرور', darija: 'لو مود باس' },
  'admin.loginBtn': { fr: 'Se Connecter', ar: 'تسجيل الدخول', darija: 'كونيكتي' },
  'admin.products': { fr: 'Produits', ar: 'المنتجات', darija: 'البرودوي' },
  'admin.orders': { fr: 'Commandes', ar: 'الطلبات', darija: 'الأوردات' },
  'admin.instagram': { fr: 'Instagram', ar: 'إنستغرام', darija: 'إنستا' },
  'admin.settings': { fr: 'Paramètres', ar: 'الإعدادات', darija: 'الباراميتر' },
  'admin.addProduct': { fr: 'Ajouter un Produit', ar: 'إضافة منتج', darija: 'زيد برودوي' },
  'admin.editProduct': { fr: 'Modifier le Produit', ar: 'تعديل المنتج', darija: 'بدل البرودوي' },
  'admin.save': { fr: 'Enregistrer', ar: 'حفظ', darija: 'سيف' },
  'admin.cancel': { fr: 'Annuler', ar: 'إلغاء', darija: 'أنولي' },
  'admin.delete': { fr: 'Supprimer', ar: 'حذف', darija: 'حيد' },
  'admin.logout': { fr: 'Déconnexion', ar: 'تسجيل الخروج', darija: 'ديكونيكتي' },
  'admin.dashboard': { fr: 'Tableau de Bord', ar: 'لوحة التحكم', darija: 'الداشبورد' },
  'admin.welcome': { fr: 'Bienvenue, Admin', ar: 'مرحباً، المدير', darija: 'مرحبا الأدمين' },
  'admin.orderNew': { fr: 'Nouveau', ar: 'جديد', darija: 'جديد' },
  'admin.orderContacted': { fr: 'Contacté', ar: 'تم التواصل', darija: 'كونتاكتي' },
  'admin.orderConfirmed': { fr: 'Confirmé', ar: 'مؤكد', darija: 'كونفيرمي' },
  'admin.orderShipped': { fr: 'Expédié', ar: 'تم الشحن', darija: 'شيبي' },
  'admin.orderDelivered': { fr: 'Livré', ar: 'تم التوصيل', darija: 'ديليفري' },
  'admin.orderCancelled': { fr: 'Annulé', ar: 'ملغي', darija: 'أنولي' },

  // Common
  'common.loading': { fr: 'Chargement...', ar: 'جاري التحميل...', darija: 'كيتحمل...' },
  'common.error': { fr: 'Une erreur est survenue', ar: 'حدث خطأ', darija: 'طرا إيرور' },
  'common.search': { fr: 'Rechercher', ar: 'بحث', darija: 'سيرشي' },
  'common.filter': { fr: 'Filtrer', ar: 'تصفية', darija: 'فيلتري' },
  'common.all': { fr: 'Tous', ar: 'الكل', darija: 'كامل' },
  'common.back': { fr: 'Retour', ar: 'رجوع', darija: 'رجع' },
  'common.viewAll': { fr: 'Voir Tout', ar: 'شاهد الكل', darija: 'شوف كامل' },
  'common.new': { fr: 'Nouveau', ar: 'جديد', darija: 'جديد' },
  'common.limited': { fr: 'Limité', ar: 'محدود', darija: 'ليميتي' },
  'common.bestSeller': { fr: 'Best-Seller', ar: 'الأكثر مبيعاً', darija: 'بيست سيلير' },
  'common.featured': { fr: 'Vedette', ar: 'مميز', darija: 'مميز' },
  'common.products': { fr: 'produits', ar: 'منتجات', darija: 'برودوي' },
  'common.product': { fr: 'produit', ar: 'منتج', darija: 'برودوي' },
  'common.noProducts': { fr: 'Aucun produit trouvé', ar: 'لا توجد منتجات', darija: 'ما كاين حتى برودوي' },
  'common.sortNewest': { fr: 'Nouveaux', ar: 'الأحدث', darija: 'الجديد' },
  'common.sortPriceAsc': { fr: 'Prix: Croissant', ar: 'السعر: تصاعدي', darija: 'البري: يطلع' },
  'common.sortPriceDesc': { fr: 'Prix: Décroissant', ar: 'السعر: تنازلي', darija: 'البري: يهبط' },
  'common.allCategories': { fr: 'Toutes catégories', ar: 'جميع الفئات', darija: 'كامل الكاتيݣوري' },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.['fr'] || key;
}

export function getLocalizedField(data: Record<string, string> | null | undefined, lang: Lang): string {
  if (!data) return '';
  return data[lang] || data['fr'] || Object.values(data)[0] || '';
}

export const rtlLangs: Lang[] = ['ar', 'darija'];

export function isRTL(lang: Lang): boolean {
  return rtlLangs.includes(lang);
}
