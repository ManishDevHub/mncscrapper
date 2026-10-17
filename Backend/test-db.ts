import prisma from "./db/prisma";

async function main() {
  try {
    const userCount = await prisma.user.count();
    const companyCount = await prisma.company.count();
    const jobCount = await prisma.job.count();
    console.log("DB Connection successful!");
    console.log({ userCount, companyCount, jobCount });
    const users = await prisma.user.findMany({ take: 3 });
    console.log("Sample users:", users);
  } catch (error) {
    console.error("DB error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
