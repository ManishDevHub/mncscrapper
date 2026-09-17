import { Request , Response, , NextFunction } from 'express'
import prisma from '../db/prisma'


export const createJob = async ( req: Request , res: Response , next: NextFunction) => {



    try {
        const { title , company , location , jobType , exprerience , skills , 
            salary , applyLink 
        } = req.body

        if(!title || !company || !location || !jobType || !exprerience || !skills || !salary || !applyLink){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const job = await prisma.job.create({

            data: {
                title,
                company,
                location,
                jobType,
                exprerience,
                skills,
                salary,
                applyLink
            }
        })
        return res.status(201).json({
            success: true , 
            message: 'Job created successfully',
            data: job
            

        })


    } catch ( error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
} 

export const getAllJobs = async ( req: Request , res: Response , next: NextFunction) => {

    try{

        const jobs = await prisma.job.findMany({
            where: {
                isActive: true

            },
            orderBy : {
                createdAt: "desc"
            }
        })

        return res.status(201).json({

            success: true,
            message: "Jonsfetched successfully",
            count: jobs.length,
            data: jobs
        })


    } catch ( error ){

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}