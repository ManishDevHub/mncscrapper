import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma";

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, excerpt, thumbnail, thumnail, published } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const baseSlug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        let slug = baseSlug;

        const existingBlog = await prisma.blog.findUnique({
            where: { slug }
        });

        if (existingBlog) {
            slug = `${baseSlug}-${Date.now()}`;
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                thumbnail: thumbnail || thumnail || null,
                published: published ?? true,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        console.error('createBlog error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;

        const whereClause: any = {};
        if (search && typeof search === 'string') {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        }

        const blogs = await prisma.blog.findMany({
            where: whereClause,
            orderBy: {
                createAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            count: blogs.length,
            data: blogs,
        });

    } catch (error) {
        console.error('getAllBlogs error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const blogId = Number(idParam);

        let blog = null;

        if (!Number.isNaN(blogId)) {
            blog = await prisma.blog.findUnique({
                where: { id: blogId }
            });
        }

        if (!blog && idParam) {
            blog = await prisma.blog.findUnique({
                where: { slug: idParam }
            });
        }

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });

    } catch (error) {
        console.error('getBlogById error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blogId = Number(id);

        if (Number.isNaN(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
        }

        const existingBlog = await prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const { title, content, excerpt, thumbnail, thumnail, published } = req.body;

        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: {
                title: title ?? existingBlog.title,
                content: content ?? existingBlog.content,
                excerpt: excerpt ?? existingBlog.excerpt,
                thumbnail: thumbnail ?? thumnail ?? existingBlog.thumbnail,
                published: published ?? existingBlog.published,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        console.error('updateBlog error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blogId = Number(id);

        if (Number.isNaN(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
        }

        const existingBlog = await prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        await prisma.blog.delete({
            where: { id: blogId }
        });

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error('deleteBlog error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};