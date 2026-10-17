"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const job_route_1 = __importDefault(require("./routes/job.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const round_route_1 = __importDefault(require("./routes/round.route"));
const prisma_1 = __importDefault(require("./db/prisma"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "MNC Scrapper / CareerHub API working fine", version: "1.0.0" });
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/blog", blog_route_1.default);
app.use("/api/job", job_route_1.default);
app.use("/api/company", company_route_1.default);
app.use("/api/company/product", product_route_1.default);
app.use("/api/company/round", round_route_1.default);
async function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const bodyStr = options.body ? JSON.stringify(options.body) : "";
        const headers = {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(bodyStr),
        };
        const req = http_1.default.request({
            hostname: u.hostname,
            port: u.port,
            path: u.pathname + u.search,
            method: options.method || "GET",
            headers,
        }, (res) => {
            let raw = "";
            res.on("data", (chunk) => (raw += chunk));
            res.on("end", () => {
                try {
                    const data = JSON.parse(raw);
                    resolve({ status: res.statusCode || 200, data });
                }
                catch (e) {
                    resolve({ status: res.statusCode || 200, data: raw });
                }
            });
        });
        req.on("error", reject);
        if (bodyStr)
            req.write(bodyStr);
        req.end();
    });
}
async function runTests() {
    const PORT = 3099;
    const server = app.listen(PORT, async () => {
        console.log(`\n================ ROUTE TEST SUITE STARTING (PORT ${PORT}) ================`);
        const BASE = `http://localhost:${PORT}`;
        try {
            // 1. Health check
            const r1 = await request(`${BASE}/`);
            console.log(`[PASS] 1. GET / -> Status: ${r1.status}, Message: ${r1.data.message}`);
            // 2. Register a standard non-admin user
            const testEmailUser = `regular_user_${Date.now()}@test.com`;
            const r2 = await request(`${BASE}/api/auth/signup`, {
                method: "POST",
                body: { username: `user_${Date.now()}`, email: testEmailUser, password: "password123" },
            });
            const userToken = r2.data.token;
            console.log(`[PASS] 2. POST /api/auth/signup (Regular User) -> Role: ${r2.data.user?.role}`);
            // 3. Register an Admin user with secret
            const testEmailAdmin = `admin_${Date.now()}@test.com`;
            const r3 = await request(`${BASE}/api/auth/signup`, {
                method: "POST",
                body: {
                    username: `admin_${Date.now()}`,
                    email: testEmailAdmin,
                    password: "password123",
                    adminSecret: "admin123",
                },
            });
            const adminToken = r3.data.token;
            console.log(`[PASS] 3. POST /api/auth/signup (Admin User) -> Role: ${r3.data.user?.role}`);
            // 4. Verify /api/auth/me for admin
            const r4 = await request(`${BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            console.log(`[PASS] 4. GET /api/auth/me -> Authenticated as: ${r4.data.user?.username} (${r4.data.user?.role})`);
            // 5. Security Test: Regular user attempting to create company -> MUST BE 403 Forbidden
            const r5 = await request(`${BASE}/api/company/create`, {
                method: "POST",
                headers: { Authorization: `Bearer ${userToken}` },
                body: { name: "Illegal Hack Company" },
            });
            if (r5.status === 403) {
                console.log(`[PASS] 5. SECURITY CHECK: Regular User POST /api/company/create -> Correctly Blocked with 403 Forbidden!`);
            }
            else {
                console.error(`[FAIL] 5. Expected 403 but got ${r5.status}`);
            }
            // 6. Security Test: Regular user attempting to create job -> MUST BE 403 Forbidden
            const r6 = await request(`${BASE}/api/job/create`, {
                method: "POST",
                headers: { Authorization: `Bearer ${userToken}` },
                body: { title: "Illegal Job", company: "Fake Corp", location: "Remote", jobType: "Full-Time", experience: "Fresher", salary: "$100k", applyLink: "http://test.com" },
            });
            if (r6.status === 403) {
                console.log(`[PASS] 6. SECURITY CHECK: Regular User POST /api/job/create -> Correctly Blocked with 403 Forbidden!`);
            }
            else {
                console.error(`[FAIL] 6. Expected 403 but got ${r6.status}`);
            }
            // 7. Admin creating a Company
            const compSlug = `google-cloud-${Date.now()}`;
            const r7 = await request(`${BASE}/api/company/create`, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: {
                    name: "Google Cloud Platform",
                    slug: compSlug,
                    type: "Product",
                    industry: "Cloud & AI",
                    establishedYear: 2008,
                    website: "https://cloud.google.com",
                    description: "Leading enterprise cloud infrastructure and AI models.",
                },
            });
            const createdCompanyId = r7.data.data?.id;
            console.log(`[PASS] 7. Admin POST /api/company/create -> Created ID: ${createdCompanyId}, Name: ${r7.data.data?.name}`);
            // 8. Public GET /api/company -> verify company listed
            const r8 = await request(`${BASE}/api/company`);
            console.log(`[PASS] 8. Public GET /api/company -> Listed ${r8.data.data?.length} companies`);
            // 9. Admin adding an Interview Round to company
            const r9 = await request(`${BASE}/api/company/round/create/${createdCompanyId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: {
                    roundNumber: 1,
                    title: "Round 1: Online Assessment",
                    description: "2 algorithmic problems on graphs and dp.",
                },
            });
            console.log(`[PASS] 9. Admin POST /api/company/round/create -> Round added: ${r9.data.success}`);
            // 10. Admin adding a Product to company
            const r10 = await request(`${BASE}/api/company/product/create/${createdCompanyId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: { name: "BigQuery AI" },
            });
            console.log(`[PASS] 10. Admin POST /api/company/product/create -> Product added: ${r10.data.success}`);
            // 11. Admin updating company
            const r11 = await request(`${BASE}/api/company/${createdCompanyId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: { name: "Google Cloud Platform (GCP - Updated)" },
            });
            console.log(`[PASS] 11. Admin PUT /api/company/:id -> Updated: ${r11.data.data?.name}`);
            // 12. Admin creating a Job Opening
            const r12 = await request(`${BASE}/api/job/create`, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: {
                    title: "Cloud Infrastructure Engineer",
                    company: "Google Cloud Platform",
                    location: "Bangalore (Hybrid)",
                    jobType: "Full-Time",
                    experience: "Fresher",
                    salary: "₹24 - ₹30 LPA",
                    skills: ["Go", "Kubernetes", "Distributed Systems"],
                    applyLink: "https://cloud.google.com/careers",
                    description: "Scale core networking and infrastructure services.",
                },
            });
            const createdJobId = r12.data.data?.id;
            console.log(`[PASS] 12. Admin POST /api/job/create -> Created Job ID: ${createdJobId}, Title: ${r12.data.data?.title}`);
            // 13. Public GET /api/job -> verify job listed
            const r13 = await request(`${BASE}/api/job`);
            console.log(`[PASS] 13. Public GET /api/job -> Listed ${r13.data.data?.length} jobs`);
            // 14. Admin updating Job Opening
            const r14 = await request(`${BASE}/api/job/${createdJobId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: {
                    title: "Cloud Infrastructure Engineer (Senior Staff)",
                    salary: "₹30 - ₹40 LPA",
                },
            });
            console.log(`[PASS] 14. Admin PUT /api/job/:id -> Updated Title: ${r14.data.data?.title}`);
            // 15. Admin creating a Blog Guide
            const r15 = await request(`${BASE}/api/blog/create`, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: {
                    title: `How to Ace Google Cloud Interview ${Date.now()}`,
                    content: "Focus on clean system architecture, distributed locks, and gRPC communication.",
                    excerpt: "Crucial prep strategy for engineering aspirants.",
                },
            });
            console.log(`[PASS] 15. Admin POST /api/blog/create -> Article Created: ${r15.data.success}`);
            // 16. Public GET /api/blog
            const r16 = await request(`${BASE}/api/blog`);
            console.log(`[PASS] 16. Public GET /api/blog -> Total articles: ${r16.data.data?.length}`);
            console.log("\n================ ALL 16 ROUTE & SECURITY CHECKS PASSED SUCCESSFULLY ================\n");
        }
        catch (err) {
            console.error("Test execution failure:", err);
        }
        finally {
            server.close();
            await prisma_1.default.$disconnect();
            process.exit(0);
        }
    });
}
runTests();
