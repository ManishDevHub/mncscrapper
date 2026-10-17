"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const job_route_1 = __importDefault(require("./routes/job.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const round_route_1 = __importDefault(require("./routes/round.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        message: "MNC Scrapper / CareerHub API working fine",
        version: "1.0.0"
    });
});
// Primary API routes
app.use("/api/auth", auth_route_1.default);
app.use("/api/blog", blog_route_1.default);
app.use("/api/job", job_route_1.default);
app.use("/api/company", company_route_1.default);
app.use("/api/company/product", product_route_1.default);
app.use("/api/company/round", round_route_1.default);
// Backwards compatibility mounts
app.use("/company", company_route_1.default);
app.use("/company/product", product_route_1.default);
app.use("/company/round", round_route_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} running`);
});
