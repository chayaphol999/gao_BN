"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash('1234', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: hashedPassword,
            name: 'Admin',
            phone: '0812345678',
            role: 'ADMIN',
        },
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '0812345678',
            role: 'ADMIN',
        },
    });
    console.log('Admin user created/updated successfully:', adminUser.email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-admin.js.map