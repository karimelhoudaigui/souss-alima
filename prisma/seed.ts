import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contribution.deleteMany();
  await prisma.glossaryTerm.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.articleWork.deleteMany();
  await prisma.articleMadrassa.deleteMany();
  await prisma.articleScholar.deleteMany();
  await prisma.articleSource.deleteMany();
  await prisma.articleTheme.deleteMany();
  await prisma.article.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.scholarMadrassa.deleteMany();
  await prisma.work.deleteMany();
  await prisma.scholarSource.deleteMany();
  await prisma.source.deleteMany();
  await prisma.travel.deleteMany();
  await prisma.madrassa.deleteMany();
  await prisma.scholarRelation.deleteMany();
  await prisma.scholar.deleteMany();

  await prisma.scholar.create({
    data: {
      slug: "savant-exemple-tiznit",
      nameFr: "Savant exemple de Tiznit",
      nameAr: "عالم نموذجي من تزنيت",
      nisba: "Exemple a remplacer",
      biography: "Fiche exemple destinee a etre remplacee par une biographie sourcee.",
      verification: "EXAMPLE"
    }
  });

  const theme = await prisma.theme.create({
    data: { slug: "qiraat", label: "Qiraat" }
  });

  const article = await prisma.article.create({
    data: {
      slug: "qiraat-transmission-souss",
      title: "La transmission des qiraat dans le Souss",
      titleAr: "نقل القراءات في سوس",
      summary: "Article exemple destine a montrer la logique editoriale par themes.",
      body: "Contenu exemple a remplacer par une version sourcee.",
      author: "Equipe editoriale",
      verification: "EXAMPLE"
    }
  });

  await prisma.articleTheme.create({
    data: {
      articleId: article.id,
      themeId: theme.id
    }
  });

  await prisma.madrassa.create({
    data: {
      slug: "madrassa-exemple-anti-atlas",
      nameFr: "Madrassa exemple de l'Anti-Atlas",
      nameAr: "مدرسة نموذجية بالأطلس الصغير",
      province: "Tiznit",
      latitude: 29.697,
      longitude: -9.731,
      history: "Notice exemple a verifier.",
      verification: "EXAMPLE"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
