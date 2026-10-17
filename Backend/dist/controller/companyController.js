"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRound = exports.updateRound = exports.createInterViewRou = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createCompany = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const createCompany = async (req, res, next) => {
    try {
        const { name, establishedYear, type, industry, description, website, logo, slug } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }
        const baseSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        let finalSlug = baseSlug;
        // Check if slug exists
        const existingSlug = await prisma_1.default.company.findUnique({
            where: { slug: finalSlug }
        });
        if (existingSlug) {
            finalSlug = `${baseSlug}-${Date.now()}`;
        }
        const company = await prisma_1.default.company.create({
            data: {
                name,
                slug: finalSlug,
                establishedYear: establishedYear ? Number(establishedYear) : null,
                type: type || null,
                industry: industry || null,
                description: description || req.body.discription || null,
                website: website || null,
                logo: logo || null
            }
        });
        return res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: company
        });
    }
    catch (error) {
        console.error('createCompany error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.createCompany = createCompany;
const getAllCompanies = async (req, res, next) => {
    try {
        const { search, industry, type } = req.query;
        const whereClause = {};
        if (industry && typeof industry === 'string' && industry !== 'All') {
            whereClause.industry = {
                contains: industry,
                mode: 'insensitive'
            };
        }
        if (type && typeof type === 'string' && type !== 'All') {
            whereClause.type = {
                contains: type,
                mode: 'insensitive'
            };
        }
        if (search && typeof search === 'string') {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { industry: { contains: search, mode: 'insensitive' } },
            ];
        }
        const companies = await prisma_1.default.company.findMany({
            where: whereClause,
            orderBy: {
                name: "asc"
            },
            include: {
                product: {
                    select: { id: true, name: true }
                },
                interviewRounds: {
                    orderBy: { roundNumber: 'asc' }
                },
                _count: {
                    select: {
                        product: true,
                        interviewRounds: true,
                    }
                }
            }
        });
        return res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,
        });
    }
    catch (error) {
        console.error('getAllCompanies error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getAllCompanies = getAllCompanies;
const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = Number(id);
        let company = null;
        if (!Number.isNaN(companyId)) {
            company = await prisma_1.default.company.findUnique({
                where: { id: companyId },
                include: {
                    product: {
                        orderBy: { name: "asc" },
                    },
                    interviewRounds: {
                        orderBy: { roundNumber: "asc" },
                    },
                },
            });
        }
        const idParam = Array.isArray(id) ? id[0] : id;
        if (!company && idParam) {
            // Try lookup by slug
            company = await prisma_1.default.company.findUnique({
                where: { slug: idParam },
                include: {
                    product: {
                        orderBy: { name: "asc" },
                    },
                    interviewRounds: {
                        orderBy: { roundNumber: "asc" },
                    },
                },
            });
        }
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: company,
        });
    }
    catch (error) {
        console.error('getCompanyById error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.getCompanyById = getCompanyById;
const updateCompany = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = Number(id);
        if (Number.isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company Id"
            });
        }
        const existingCompany = await prisma_1.default.company.findUnique({
            where: { id: companyId }
        });
        if (!existingCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        const { name, establishedYear, type, industry, description, website, logo } = req.body;
        const updatedCompany = await prisma_1.default.company.update({
            where: { id: companyId },
            data: {
                name: name ?? existingCompany.name,
                establishedYear: establishedYear !== undefined ? Number(establishedYear) : existingCompany.establishedYear,
                type: type ?? existingCompany.type,
                industry: industry ?? existingCompany.industry,
                description: description !== undefined ? description : req.body.discription ?? existingCompany.description,
                website: website ?? existingCompany.website,
                logo: logo ?? existingCompany.logo
            }
        });
        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: updatedCompany
        });
    }
    catch (error) {
        console.error('updateCompany error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.updateCompany = updateCompany;
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = Number(id);
        if (Number.isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company Id"
            });
        }
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId }
        });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        await prisma_1.default.company.delete({
            where: { id: companyId }
        });
        return res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    }
    catch (error) {
        console.error('deleteCompany error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.deleteCompany = deleteCompany;
const createProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = Number(id);
        if (Number.isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company Id",
            });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            });
        }
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }
        const product = await prisma_1.default.product.create({
            data: {
                name,
                companyId,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        console.error('createProduct error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const pId = Number(productId || id);
        if (Number.isNaN(pId)) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required"
            });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id: pId }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const updatedProduct = await prisma_1.default.product.update({
            where: { id: pId },
            data: { name }
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('updateProduct error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id, productId } = req.params;
        const pId = Number(productId || id);
        if (Number.isNaN(pId)) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required"
            });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id: pId }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        await prisma_1.default.product.delete({
            where: { id: pId }
        });
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
    catch (error) {
        console.error('deleteProduct error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.deleteProduct = deleteProduct;
const createInterViewRou = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = Number(id || req.body.companyId);
        if (Number.isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Company ID is required"
            });
        }
        const { roundNumber, title, description } = req.body;
        const roundNum = Number(roundNumber);
        if (!title || Number.isNaN(roundNum)) {
            return res.status(400).json({
                success: false,
                message: "roundNumber (number) and title are required"
            });
        }
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId }
        });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        const existingRound = await prisma_1.default.interviewRound.findUnique({
            where: {
                companyId_roundNumber: {
                    companyId,
                    roundNumber: roundNum
                }
            }
        });
        if (existingRound) {
            return res.status(409).json({
                success: false,
                message: `Interview round #${roundNum} already exists for this company`
            });
        }
        const round = await prisma_1.default.interviewRound.create({
            data: {
                title,
                description: description || '',
                roundNumber: roundNum,
                companyId
            }
        });
        return res.status(201).json({
            success: true,
            message: "Interview round created successfully",
            data: round
        });
    }
    catch (error) {
        console.error('createInterviewRound error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.createInterViewRou = createInterViewRou;
const updateRound = async (req, res) => {
    try {
        const { id, roundId } = req.params;
        const companyId = Number(id || req.body.companyId || req.body.id);
        const roundNum = Number(roundId || req.body.roundNumber);
        if (Number.isNaN(companyId) || Number.isNaN(roundNum)) {
            return res.status(400).json({
                success: false,
                message: "Company ID and roundNumber are required"
            });
        }
        const existingRound = await prisma_1.default.interviewRound.findUnique({
            where: {
                companyId_roundNumber: {
                    companyId,
                    roundNumber: roundNum
                }
            }
        });
        if (!existingRound) {
            return res.status(404).json({
                success: false,
                message: "Interview round not found"
            });
        }
        const { title, description } = req.body;
        const updated = await prisma_1.default.interviewRound.update({
            where: {
                companyId_roundNumber: {
                    companyId,
                    roundNumber: roundNum
                }
            },
            data: {
                title: title ?? existingRound.title,
                description: description ?? existingRound.description
            }
        });
        return res.status(200).json({
            success: true,
            message: "Interview round updated successfully",
            data: updated
        });
    }
    catch (error) {
        console.error('updateRound error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.updateRound = updateRound;
const deleteRound = async (req, res) => {
    try {
        const { id, roundId } = req.params;
        const companyId = Number(id || req.body.companyId || req.body.id);
        const roundNum = Number(roundId || req.body.roundNumber);
        if (Number.isNaN(companyId) || Number.isNaN(roundNum)) {
            return res.status(400).json({
                success: false,
                message: "Company ID and roundNumber are required"
            });
        }
        const existing = await prisma_1.default.interviewRound.findUnique({
            where: {
                companyId_roundNumber: {
                    companyId,
                    roundNumber: roundNum
                }
            }
        });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Interview round not found"
            });
        }
        await prisma_1.default.interviewRound.delete({
            where: {
                companyId_roundNumber: {
                    companyId,
                    roundNumber: roundNum
                }
            }
        });
        return res.status(200).json({
            success: true,
            message: "Interview round deleted successfully"
        });
    }
    catch (error) {
        console.error('deleteRound error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.deleteRound = deleteRound;
