import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedObject = [
  {
    label: 'Article Size',
    name: 'articleSize',
    type: 'Dropdown',
    data: [
      {
        label: 'Long',
        value: 'long',
      },
      {
        label: 'Short',
        value: 'short',
      },
      {
        label: 'Medium',
        value: 'Medium',
      },
    ],
  },
  {
    label: 'Domain',
    name: 'articleDomain',
    type: 'Dropdown',
    data: [
      {
        label: 'Software',
        value: 'software',
      },
      {
        label: 'Marketing/Sales',
        value: 'sales',
      },
    ],
  },
  {
    label: 'Tone',
    name: 'articleTone',
    type: 'Dropdown',
    data: [
      {
        label: 'Friendly',
        value: 'friendly',
      },
      {
        label: 'Informative',
        value: 'informative',
      },
      {
        label: 'Formal',
        value: 'formal',
      },
    ],
  },
];

async function main() {
  //   const deleteOptionalField = await prisma.optionalFields.deleteMany({});
  await prisma.$queryRaw`TRUNCATE TABLE "optionalFields" RESTART IDENTITY CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE "optional" RESTART IDENTITY CASCADE`;
  //   const deleteOptional = await prisma.optional.deleteMany({});

  seedObject.map(async (optional) => {
    const { data, ...restdata } = optional;
    const { id } = await prisma.optional.create({ data: restdata });
    data.map(async (optionalFields) => {
      await prisma.optionalFields.create({
        data: { ...optionalFields, optionalId: id },
      });
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
