export type VerificationStatus = "example" | "to_verify" | "sourced";

export type Scholar = {
  slug: string;
  nameFr: string;
  nameAr: string;
  nisba: string;
  period: string;
  places: string;
  specialties: string[];
  madrassas: string[];
  teachers: string[];
  students: string[];
  works: string[];
  biography: string;
  sources: string[];
  image?: string;
  imageCredit?: string;
  status: VerificationStatus;
  featured?: boolean;
};

export type Madrassa = {
  slug: string;
  name: string;
  nameAr: string;
  village: string;
  commune: string;
  province: string;
  lat: number;
  lng: number;
  specialties: string[];
  history: string;
  currentStatus: string;
  contact: string;
  scholars: string[];
  sources?: string[];
  image?: string;
  imageCredit?: string;
  status: VerificationStatus;
  featured?: boolean;
};

export type Theme = {
  slug: string;
  label: string;
};

export type Article = {
  slug: string;
  title: string;
  titleAr: string;
  theme: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  summary: string;
  body: string;
  sources: string[];
  tags: string[];
  scholarSlugs: string[];
  madrassaSlugs: string[];
  image?: string;
  imageCredit?: string;
  status: VerificationStatus;
};

export type Travel = {
  slug: string;
  title: string;
  duration: string;
  dates: string;
  price: string;
  itinerary: string[];
  program: string[];
  practicalInfo: string;
  madrassaSlugs: string[];
  status: VerificationStatus;
  featured?: boolean;
};

export const scholars: Scholar[] = [
  {
    slug: "sidi-mohammed-nazir",
    nameFr: "Sidi Mohammed Nazir",
    nameAr: "سيدي محمد نظير",
    nisba: "Mohammed ibn Said ibn al-Mokhtar Nazir",
    period: "Ne en 1981",
    places: "Essaouira, Souss, Tata, Sidi Ifni, Assa",
    specialties: ["qiraat", "sept lectures", "Warsh", "Qalun", "Ibn Kathir", "Abu Amr al-Basri", "Hamza", "rasm", "dabt", "fiqh malikite", "usul al-fiqh"],
    madrassas: ["ecole-traditionnelle-zawiya-assa"],
    teachers: [
      "Sidi Mouloud Asmou",
      "Sidi Mohammed ibn al-Hussein",
      "Sidi Ibrahim Abou Ziya",
      "Sidi al-Hajj Tayyib",
      "Sidi Mbarek Bou al-Hussein Ait Oulbir",
      "Sidi al-Hajj Abdallah Khattab al-Baqili",
      "Sidi al-Hajj Mohammed Tawfiq al-Tajajti",
      "Sidi Hassan al-Marrakchi",
      "Sidi Ibrahim al-Sahili",
      "Sidi Mohammed Bouchatr",
      "Sidi Mohammed al-Raji al-Hamzawi",
      "Dr Sidi Hassan Hamitou",
      "Dr al-Hajj Mohammed al-Hafdhawi"
    ],
    students: ["Etudiants de la Zawiya d'Assa"],
    works: [
      "Memoire de licence : Les fondements et manifestations de l'ethique dans la sourate al-Hujurat",
      "Memoire de master : edition critique de Tadhkirat al-Muqri fi Qiraat Abi Amr al-Basri",
      "Participation a trois manuels de l'enseignement traditionnel marocain consacres au rasm et au dabt"
    ],
    biography:
      "Sidi Mohammed ibn Said ibn al-Mokhtar Nazir est ne en 1981 au douar Ait Aissa, a Ait Biyoud, dans la tribu d'Ida Ou Zemzem, relevant de la commune et du caidat de Bizdad, dans la province d'Essaouira.\n\nIl commenca tres jeune l'apprentissage et la memorisation du Coran au kuttab de la mosquee de son village natal, aupres des maitres qui se succedaient dans le cadre de la musharata, notamment Sidi Mouloud Asmou et Sidi Mohammed ibn al-Hussein. Entre 1986 et 1997, il acheva trois lectures completes du Coran.\n\nIl poursuivit ensuite sa formation dans plusieurs madrasas traditionnelles : al-Baarir dans la province de Taroudant, aupres de Sidi Ibrahim Abou Ziya ; Imi Nouadi, aupres de Sidi al-Hajj Tayyib ; puis Taktart a Ida Gougmar, aupres du specialiste des dix lectures Sidi Mbarek Bou al-Hussein Ait Oulbir. C'est la qu'il aborda les qiraat, avec 20 hizb selon Warsh, puis Qalun et Ibn Kathir autour de 2001.\n\nIl etudia ensuite les sciences religieuses a Doukadir al-Ilghiyya aupres de Sidi al-Hajj Abdallah Khattab al-Baqili, puis a al-Karima al-Sahiliyya dans la region de Tiznit, aupres de Sidi al-Hajj Mohammed Tawfiq al-Tajajti, ou il resta jusqu'en 2005 et etudia une grande partie des principaux mutun des madrasas atiqa marocaines.\n\nIl revint ensuite aux lectures coraniques a la madrasa al-Rashad a Assaki, dependante d'Imi Nouadi, aupres de Sidi Hassan al-Marrakchi. En trois mois, il lut 30 hizb selon Warsh et 7 hizb selon Ibn Kathir. A Oulad Bouris, a Sidi Ayyad dans la region de Houara, il acheva deux lectures completes selon Ibn Kathir et deux selon Abu Amr al-Basri aupres de Sidi Ibrahim al-Sahili. Il etudia aussi aupres de Sidi Mohammed Bouchatr l'Alfiyya, la Risala, le tafsir, le fiqh, les usul al-fiqh et la balagha, jusqu'en 2008.\n\nIl aborda ensuite la lecture de Hamza aupres de Sidi Mohammed al-Raji al-Hamzawi, puis etudia les sept lectures a la madrasa des qiraat de Taroudant.\n\nEn 2009, il enseigna le Coran a la madrasa Tamazt, dans la region d'Oulad Berhil, aupres de Sidi al-Hajj Mohammed Amchghal al-Nfifi. En 2010, il entra pleinement dans la musharata et rejoignit la madrasa du cheikh al-Tamnarti a Tamanart, dans la province de Tata, ou il resta pres de dix annees, jusqu'en 2020. Apres cela, il passa environ un an et demi a la madrasa Moumtoul, dans la tribu de Majjat, province de Sidi Ifni, ou il fut le premier enseignant a ouvrir la madrasa et a y instituer la priere du vendredi.\n\nVers 2022, il rejoignit la madrasa de la Zaouia d'Assa, dans la ville d'Assa, region de Guelmim, ou il exerce encore aujourd'hui et enseigne notamment les qiraat.\n\nParallelement a son parcours traditionnel, il obtint le baccalaureat de l'enseignement traditionnel en candidat libre a Guelmim, puis une licence en 2013 avec un memoire sur l'ethique dans la sourate al-Hujurat. En 2019, il obtint un master en discours religieux sous la direction du regrette Dr Sidi Hassan Hamitou, avec une edition critique de Tadhkirat al-Muqri fi Qiraat Abi Amr al-Basri. Il poursuit actuellement une recherche doctorale a la Faculte de la Charia sous la direction de Dr al-Hajj Mohammed al-Hafdhawi, sur l'utilisation des lectures coraniques par les malikites de l'Occident islamique dans l'argumentation et la deduction juridique.\n\nIl a egalement participe, aux cotes du Dr Sidi Hassan Hamitou, a la redaction de trois ouvrages pour le ministere consacres aux sciences du rasm et du dabt, destines aux quatrieme, cinquieme et sixieme niveaux de l'enseignement traditionnel marocain.",
    sources: ["Texte original redige par Mohammed Chakir.", "Biographie fournie pour integration editoriale."],
    image: "/images/scholars/mohammed-nazir-hq.png",
    imageCredit: "Photo fournie : Sidi Mohammed Nazir, version optimisee haute qualite.",
    status: "sourced",
    featured: true
  }
];

export const madrassas: Madrassa[] = [];

export const themes: Theme[] = [
  { slug: "qiraat", label: "Qiraat" },
  { slug: "coran-sciences-coraniques", label: "Coran et sciences coraniques" },
  { slug: "enseignement-traditionnel", label: "Enseignement traditionnel" },
  { slug: "histoire-madrassas", label: "Histoire des madrassas" },
  { slug: "savants-souss", label: "Savants du Souss" },
  { slug: "manuscrits-ouvrages", label: "Manuscrits et ouvrages" },
  { slug: "patrimoine-souss", label: "Patrimoine du Souss" },
  { slug: "recherche-etudes", label: "Recherche / etudes" }
];

export const articles: Article[] = [];

export const travels: Travel[] = [];

export const glossary = [
  { term: "Silsila", ar: "سلسلة", definition: "Chaine de transmission reliant maitres et disciples.", category: "Transmission" },
  { term: "Tolba", ar: "طلبة", definition: "Etudiants des madrassas traditionnelles.", category: "Vie des madrassas" },
  { term: "Dabt", ar: "الضبط", definition: "Systeme de signes servant a preciser la lecture du texte coranique.", category: "Coran" }
];

export function statusLabel(status: VerificationStatus) {
  if (status === "sourced") return "Source";
  if (status === "to_verify") return "A verifier";
  return "Exemple a remplacer";
}
