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
  },
  {
    slug: "sidi-mohammed-amgour-al-baamrani",
    nameFr: "Sidi al-Hajj Mohammed Amgour al-Baamrani",
    nameAr: "سيدي الحاج محمد أمگور الباعمراني",
    nisba: "Connu sous le surnom al-Driyush / الدريوش",
    period: "Ne en 1956 - actif en 2026",
    places: "Tlat Imagern, Ait Baamrane, Lakhsas, Sidi Ifni, Azrou",
    specialties: ["Qur'an", "hifz", "Warsh an Nafi", "qiraat", "al-Makki a confirmer", "talaqqi", "enseignement coranique"],
    madrassas: [],
    teachers: [
      "Sidi al-Hasan al-Bouhali",
      "Sidi Ahmad Ou Ali",
      "Sidi Abid b. Hammad",
      "Sidi al-Hajj Muhammad Boutougha",
      "Sidi Muhammad b. Ali Khath",
      "Sidi Ibrahim b. al-Hasan al-Hilali",
      "Sidi Hasan Asban",
      "Sidi Ibrahim al-Noumri",
      "Sidi Ibrahim b. al-Arabi al-Milki al-Masoudi",
      "Sidi al-Hajj Muhammad Tawfiq al-Tajajti"
    ],
    students: ["Anciens eleves de la Madrassa coranique d'Azrou", "Abd al-Sadiq al-Nasiri, temoignage public a confirmer"],
    works: ["Transmission orale du Qur'an et de la riwaya de Warsh", "Enseignement coranique a la Madrassa Azrou"],
    biography:
      "Sidi al-Hajj Mohammed Amgour al-Baamrani, connu sous le surnom d'al-Driyush, est un muqri du pays Ait Baamrane, ne en 1956 a Tlat Imagern, dans la tribu Ait Yakhlef. Les notices publiques le presentent comme une figure de l'enseignement coranique, particulierement associee a la riwaya de Warsh.\n\nApres avoir memorise le Qur'an aupres de plusieurs fuqaha du Souss, il poursuivit sa formation en qiraat aupres de maitres etablis notamment a Lakhsas, Tngarfa, al-Mnizla, Bankmoud, Sidi Said Oumsaoud et Toughzift. Une notice mentionne egalement la lecture dite al-Makki dans sa formation ; cette information est conservee comme element a preciser avant d'etre assimilee explicitement a Ibn Kathir.\n\nSon itineraire d'enseignement le relie a l'ecole Sidi Ali Ousaid, a Lakhsas, puis a la Grande Mosquee de Sidi Ifni. Vers 1999, il rejoint la Madrassa coranique d'Azrou, ou plusieurs publications locales le presentent comme muqri, enseignant, cheikh de l'ecole et imam de la mosquee d'Azrou. Son activite a Azrou est encore attestee par des publications publiques en 2026.\n\nDes temoignages d'anciens eleves indiquent que des khatmat completes du Qur'an ont ete accomplies sous sa direction. Ces temoignages confirment une transmission personnelle et prolongee, tout en restant a distinguer d'un registre institutionnel ou d'une ijaza formelle documentee.",
    sources: [
      "Publications Facebook publiques autour de Sidi al-Hajj Mohammed Amgour al-Baamrani, notamment notices de Muhammad Shakir et pages locales.",
      "Notice fournie : fonctions documentees a la Madrassa coranique d'Azrou, enseignement du Qur'an, role d'imam et activite encore attestee en 2026.",
      "Notice fournie : reseau de maitres de Qur'an et de qiraat dans le Souss et le pays Ait Baamrane.",
      "Temoignage public d'Abd al-Sadiq al-Nasiri mentionnant une khatma accomplie sous sa direction."
    ],
    image: "/images/scholars/mohammed-amgour-hq.png",
    imageCredit: "Photo fournie : Sidi al-Hajj Mohammed Amgour al-Baamrani, version restauree et optimisee haute qualite.",
    status: "sourced",
    featured: true
  },
  {
    slug: "mouloud-al-sariri",
    nameFr: "Mouloud al-Sariri",
    nameAr: "مولود السريري",
    nisba: "Abu al-Tayyib Mouloud ibn al-Hasan al-Sariri al-Susi",
    period: "Ne en 1963 - actif",
    places: "Ta'lat, Chtouka Ait Baha, Tanger, Tinkert",
    specialties: ["fiqh malikite", "usul al-fiqh", "hermeneutique juridique", "hadith", "tafsir", "philosophie", "litterature", "poesie"],
    madrassas: ["madrassa-tinkert"],
    teachers: [
      "al-Hasan al-Sariri",
      "Hasan al-Shalhi",
      "Idris al-Tuzuwini",
      "Muhammad al-Kummathri",
      "al-Hajj Salih al-Salih al-Ilghi",
      "Abd Allah al-Talidi",
      "Abd Allah ibn al-Siddiq al-Ghumari",
      "Muhammad al-Zamzami"
    ],
    students: ["Etudiants, fuqaha et imams formes a la Madrassa Tinkert"],
    works: [
      "Tajdid ilm usul al-fiqh",
      "Mu'jam al-usuliyyin",
      "al-Qanun fi tafsir al-nusus",
      "al-Sina'a al-fiqhiyya",
      "Sharh Miftah al-Wusul",
      "Sharh Nayl al-Muna fi Nazm al-Muwafaqat",
      "Masadir al-tashri' al-islami wa-turuq istithmariha inda al-Imam Ibn Hazm al-Zahiri",
      "Naqd al-qawl al-almani fi al-ma'rifa al-diniyya"
    ],
    biography:
      "Abu al-Tayyib Mouloud ibn al-Hasan al-Sariri al-Susi est un faqih malikite et specialiste marocain des usul al-fiqh, ne en 1963 dans le Souss. Les notices biographiques le rattachent a la madrassa de Ta'lat, dans la province de Chtouka Ait Baha ; une date precise est egalement rapportee : 3 aout 1963 / 12 Rabi' al-Awwal 1383 H.\n\nSa premiere formation se deroule aupres de son pere, al-Hasan al-Sariri, avec la memorisation du Coran et l'acquisition des premiers elements des sciences religieuses, linguistiques et litteraires. Il poursuit ensuite son apprentissage dans plusieurs madrassas du Souss, notamment aupres de Hasan al-Shalhi, Idris al-Tuzuwini, Muhammad al-Kummathri et al-Hajj Salih al-Salih al-Ilghi.\n\nIl effectue ensuite une seconde phase de formation dans le nord du Maroc, principalement a Tanger, aupres de savants tels que Abd Allah al-Talidi, Abd Allah ibn al-Siddiq al-Ghumari et Muhammad al-Zamzami. Cette circulation entre le Souss et le nord marocain donne a son parcours une place importante dans la cartographie des reseaux de transmission.\n\nAl-Sariri rejoint ensuite la Madrassa traditionnelle de Tinkert, ou il devient enseignant puis responsable scientifique. Les sources divergent legerement sur la date de son arrivee : le site officiel indique 1994, tandis que certaines notices donnent 1411 H / 1991. La fiche conserve donc l'indication prudente d'une arrivee vers 1991-1994.\n\nSon enseignement a Tinkert est associe au fiqh malikite, au Mukhtasar Khalil, aux usul al-fiqh, a la theorie de l'interpretation des textes, au hadith, a la theologie et a des questions contemporaines de methodologie juridique. Sa production ecrite est particulierement riche pour un savant rattache a une madrassa rurale : elle porte notamment sur le renouvellement des usul, la signification linguistique, l'hermeneutique juridique, la relation entre fiqh et usul, ainsi que la critique de certaines approches modernes de la connaissance religieuse.\n\nPour Al-Maghrib al-ʿĀlim, Mouloud al-Sariri constitue un noeud documentaire majeur : sa trajectoire relie formation familiale, madrassas du Souss, rihla vers Tanger, retour a Tinkert, enseignement prolonge et production intellectuelle contemporaine.",
    sources: [
      "Notice fournie : biographie de Mouloud al-Sariri et synthese des sources publiques.",
      "Site officiel assariry.com / Nafais Ulama al-Maghrib : naissance, formation, maitres, bibliographie et fonction a Tinkert.",
      "IslamOnline : elements sur la formation initiale et la memorisation du Coran.",
      "Aima Maroc : maitres du Souss et periode de formation a Tanger.",
      "Sources publiques de la Madrassa Tinkert : enseignement, direction scientifique et activite contemporaine."
    ],
    image: "/images/scholars/mouloud-al-sariri-hq.png",
    imageCredit: "Photo fournie : Mouloud al-Sariri, version restauree et optimisee haute qualite.",
    status: "sourced",
    featured: true
  },
  {
    slug: "abdallah-rais-al-rasmuki",
    nameFr: "Sidi al-Hajj Abd Allah Rais al-Rasmuki",
    nameAr: "سيدي الحاج عبد الله بن إبراهيم ريس الرسموكي السوسي",
    nisba: "Abd Allah ibn Ibrahim Rais al-Rasmuki al-Susi",
    period: "Ne en 1968 - actif",
    places: "Akrad Ouabdi, Anzi, Ikdi, Fes, Chinguetti",
    specialties: ["fiqh malikite", "usul al-fiqh", "Qur'an", "Warsh", "rasm", "tafsir", "enseignement traditionnel", "litterature", "poesie"],
    madrassas: ["madrassa-ikdi"],
    teachers: [
      "al-Hajj Ibrahim Rais",
      "Abd al-Karim al-Dawudi",
      "Muhammad al-Tawil",
      "Abd al-Hayy al-Imrawi",
      "Muhammad al-Imrani"
    ],
    students: ["Etudiants de la Madrassa scientifique traditionnelle d'Ikdi"],
    works: [
      "Min tarikh Madrasat Ikdi",
      "Nazm Asbab al-Ikhtilaf al-Fiqhi ma'a sharhihi",
      "Ida'at wa-Imla'at fi Sharh al-Waraqat",
      "Sharh Mabniyyat al-Burji"
    ],
    biography:
      "Sidi al-Hajj Abd Allah ibn Ibrahim Rais al-Rasmuki al-Susi est un faqih malikite, enseignant, homme de lettres et poete du Souss, ne en 1968 a Akrad Ouabdi, dans la commune d'Anzi, province de Tiznit.\n\nSa formation commence a la Madrassa scientifique traditionnelle d'Ikdi, aupres de son pere, Sidi al-Hajj Ibrahim Rais, longtemps connu comme le grand faqih de l'etablissement. Il y memorise le Coran selon la riwaya de Warsh, avec apprentissage du rasm uthmani, puis etudie un cursus traditionnel large : nahw, fiqh, balagha, usul al-fiqh, mustalah al-hadith, tafsir, arud et mantiq.\n\nEn 1992, il rejoint Jami' al-Qarawiyyin a Fes, ou il frequente pendant environ deux annees les cercles de plusieurs enseignants marocains, notamment Abd al-Karim al-Dawudi, Muhammad al-Tawil, Abd al-Hayy al-Imrawi et Muhammad al-Imrani. Son parcours dessine ainsi une circulation Ikdi - Qarawiyyin - Ikdi, importante pour comprendre la continuite savante contemporaine du Souss.\n\nApres son retour, il participe a partir de 1994 a la gestion scientifique de l'ecole d'Ikdi. Les sources indiquent une transmission progressive avec son pere : en 2021, la madrassa est encore presentee sous la supervision d'Ibrahim Rais et de son fils Abd Allah ; les publications recentes presentent Abd Allah Rais comme faqih, directeur ou amid actuel de l'ecole.\n\nIl est egalement rattache a la Rabita Mohammedia des Oulemas et intervient dans des rencontres scientifiques au Maroc et a l'etranger. En 2022, il obtient un master a l'Universite de Chinguetti en Mauritanie, autour d'un travail consacre au patrimoine savant du Souss : Sharh Mabniyyat al-Burji du savant Iburk al-Ya'qubi al-Samlali.\n\nParmi ses travaux figurent notamment Min tarikh Madrasat Ikdi, un ouvrage essentiel a rechercher pour documenter l'histoire interne d'Ikdi, ainsi que des textes consacres aux causes de la divergence juridique et aux usul al-fiqh. Le 27 mars 2025, lors de Laylat al-Qadr, il recoit le Prix Mohammed VI des ecoles coraniques dans la categorie du rendement pedagogique. Cet evenement constitue un marqueur institutionnel fort de son role actuel.",
    sources: [
      "Notice fournie : biographie de Sidi al-Hajj Abd Allah Rais al-Rasmuki et synthese des sources publiques.",
      "Publications recentes de la Madrassa Ikdi : direction actuelle et succession avec Sidi al-Hajj Ibrahim Rais.",
      "Tiznit 24 : formation, passage a al-Qarawiyyin, master a Chinguetti et travaux attribues.",
      "Ministere des Habous : Prix Mohammed VI des ecoles coraniques, categorie rendement, 1446 H / 2025.",
      "Fondation Faail Khair : inauguration de la bibliotheque d'Ikdi en mai 2024 et mention du directeur de l'ecole.",
      "Sources publiques liees a la Rabita Mohammedia des Oulemas et aux activites scientifiques contemporaines."
    ],
    image: "/images/scholars/abdallah-rais-hq.png",
    imageCredit: "Photo fournie : Sidi al-Hajj Abd Allah Rais al-Rasmuki, version restauree et optimisee haute qualite.",
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
