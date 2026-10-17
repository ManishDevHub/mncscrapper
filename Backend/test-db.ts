import prisma from "./db/prisma";

async function main() {
  try {
    const updated = await prisma.user.updateMany({
      data: { role: "admin" },
    });
    console.log("Updated users to admin:", updated);
    const users = await prisma.user.findMany();
    console.log("Current users in DB:", users);
  } catch (error) {
    console.error("DB error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
