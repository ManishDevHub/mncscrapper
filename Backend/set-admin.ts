import bcrypt from "bcrypt";
import prisma from "./db/prisma";

async function setupAdmin() {
  const email = "ramuk13476@gmail.com";
  const password = "rudra123@1";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Updated admin account successfully:", {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role,
    });
  } else {
    const created = await prisma.user.create({
      data: {
        username: "Rudra Admin",
        email,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Created admin account successfully:", {
      id: created.id,
      email: created.email,
      username: created.username,
      role: created.role,
    });
  }

  await prisma.$disconnect();
}

setupAdmin().catch((e) => {
  console.error("Failed to setup admin:", e);
  process.exit(1);
});
