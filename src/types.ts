export type Language = 'en' | 'bn';

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  priceEn: number;
  priceBn: string; // e.g. "৳ ৮৯০"
  category: 'fashion' | 'electronics' | 'home_kitchen' | 'beauty' | 'groceries' | 'gadgets' | string;
  categoryEn: string;
  categoryBn: string;
  image: string;
  hoverImage?: string;
  badgeEn?: string;
  badgeBn?: string;
  descriptionEn: string;
  descriptionBn: string;
  sizes: string[];
  fabricEn: string; // Used for Specs / Features
  fabricBn: string;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface LookbookPost {
  id: string;
  titleEn: string;
  titleBn: string;
  dateEn: string;
  dateBn: string;
  tagEn: string;
  tagBn: string;
  image: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string[];
  contentBn: string[];
}

export interface TranslationDictionary {
  nav: {
    shop: string;
    categories: string;
    bestSellers: string;
    whyUs: string;
    about: string;
    lookbook: string;
    contact: string;
  };
  hero: {
    slide1Title: string;
    slide1Subtitle: string;
    slide2Title: string;
    slide2Subtitle: string;
    slide3Title: string;
    slide3Subtitle: string;
    shopCta: string;
    storyCta: string;
  };
  categories: {
    title: string;
    subtitle: string;
    fashion: string;
    electronics: string;
    homeKitchen: string;
    beauty: string;
    groceries: string;
    gadgets: string;
    explore: string;
  };
  bestSellers: {
    title: string;
    subtitle: string;
    codTag: string;
    addToCart: string;
    quickView: string;
    viewAll: string;
    filterAll: string;
    filterFashion: string;
    filterElectronics: string;
    filterHomeKitchen: string;
    filterBeauty: string;
    filterGroceries: string;
    filterGadgets: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  about: {
    title: string;
    subtitle: string;
    para1: string;
    para2: string;
    cta: string;
    statsMills: string;
    statsMillsLabel: string;
    statsDistricts: string;
    statsDistrictsLabel: string;
  };
  lookbook: {
    title: string;
    subtitle: string;
    readMore: string;
    closeArticle: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySubtitle: string;
    subtotal: string;
    deliveryFee: string;
    deliveryInfo: string;
    total: string;
    checkoutCod: string;
    continueShopping: string;
    freeDeliveryBadge: string;
    codGuaranteed: string;
    sizeLabel: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    fullName: string;
    phoneNumber: string;
    phoneHelp: string;
    district: string;
    selectDistrict: string;
    fullAddress: string;
    orderNotes: string;
    placeOrder: string;
    successTitle: string;
    successDesc: string;
    orderIdLabel: string;
    paymentModeLabel: string;
    paymentModeValue: string;
    estimatedDeliveryLabel: string;
    estimatedDeliveryValue: string;
    backToStore: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    popularTags: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    customerCare: string;
    contactUs: string;
    address: string;
    phone: string;
    email: string;
    rights: string;
    codBanner: string;
  };
  auth: {
    titleLogin: string;
    titleRegister: string;
    loginTab: string;
    registerTab: string;
    subtitle: string;
    noPaymentNote: string;
    orderingLabel: string;
    totalLabel: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    loginBtn: string;
    registerBtn: string;
    emailError: string;
    passwordError: string;
    alreadyHaveAccount: string;
    needAccount: string;
    loggedInAs: string;
    logout: string;
  };
}
