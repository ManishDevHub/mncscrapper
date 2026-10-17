import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            company,
            Company,
            location,
            jobType,
            experience,
            exprerience,
            exprience,
            description,
            skills,
            salary,
            applyLink,
            applyUrl
        } = req.body;

        const companyName = Company || company;
        const jobExperience = exprience || experience || exprerience;
        const jobApply = applyLink || applyUrl;
        const jobSkills = Array.isArray(skills)
            ? skills
            : typeof skills === 'string'
            ? skills.split(',').map((s: string) => s.trim())
            : [];

        if (!title || !companyName || !location || !jobType || !jobExperience || !salary || !jobApply) {
            return res.status(400).json({
                success: false,
                message: 'All required fields (title, company, location, jobType, experience, salary, applyLink) must be provided'
            });
        }

        const job = await prisma.job.create({
            data: {
                title,
                Company: companyName,
                location,
                jobType,
                exprience: jobExperience,
                description: description || '',
                skills: jobSkills,
                salary,
                applyLink: jobApply,
                isActive: true
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job
        });

    } catch (error) {
        console.error('createJob error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, jobType, experience, location } = req.query;

        const whereClause: any = {
            isActive: true
        };

        if (jobType && typeof jobType === 'string' && jobType !== 'All') {
            whereClause.jobType = {
                contains: jobType,
                mode: 'insensitive'
            };
        }

        if (location && typeof location === 'string') {
            whereClause.location = {
                contains: location,
                mode: 'insensitive'
            };
        }

        if (search && typeof search === 'string') {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { Company: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const jobs = await prisma.job.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Jobs fetched successfully',
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        console.error('getAllJobs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const jobId = Number(id);

        if (Number.isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job Id'
            });
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                isActive: true
            }
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job fetched successfully',
            data: job
        });

    } catch (error) {
        console.error('getJobById error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const UpdateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const jobId = Number(id);

        if (Number.isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        const existingJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const {
            title,
            company,
            Company,
            location,
            jobType,
            experience,
            exprience,
            description,
            skills,
            salary,
            applyLink,
            applyUrl,
            isActive
        } = req.body;

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                title: title ?? existingJob.title,
                Company: Company || company || existingJob.Company,
                location: location ?? existingJob.location,
                jobType: jobType ?? existingJob.jobType,
                exprience: exprience || experience || existingJob.exprience,
                description: description ?? existingJob.description,
                skills: Array.isArray(skills) ? skills : existingJob.skills,
                salary: salary ?? existingJob.salary,
                applyLink: applyLink || applyUrl || existingJob.applyLink,
                isActive: isActive ?? existingJob.isActive,
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: updatedJob
        });

    } catch (error) {
        console.error('UpdateJob error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const jobId = Number(id);

        if (Number.isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        const existingJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await prisma.job.delete({
            where: { id: jobId }
        });

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });

    } catch (error) {
        console.error('deleteJob error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};