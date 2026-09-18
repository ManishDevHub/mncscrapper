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

export const getJobById = async ( req: Request , res: Response , next: NextFunction ) => {

    try {

        const id = req.params
        const jobId = Number(id)

        if(Number.isNaN(jobId)){

            return res.status(400).json({
                success: false,
                message: 'Invalid job Id'
            })
        }

        const job = await prisma.job.findFirst({
            where:{
                id: jobId,
                isActive: true
            }
        })

        if(!job){
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "job fetched successfully",
            data: job

        })


    } catch ( error) {
        return res.status(500).json({
            success: false , 
            message: ' Intrnal server error'
        })
    }
}

export const UpdateJob = async ( req: Request , res: Response , next: NextFunction) => {

    try {
const id = req.params;
const jobId = Number(id);

if(Number.isNaN(jobId)){
    return res.status(400).json({
        success: false,
        message: 'Invalid job id '

    })
}

const exitstingJob  = await prisma.job.findUnique({

    where:{
        id: jobId
    }
})

if(!exitstingJob){
    return res.status(404).json({
        success: false,
        message: 'Job not found',

    })
}

 const { title, company, location,jobType, experience, description, skills, salary, applyUrl,isActive, } = req.body;


 const updatedJob = await prisma.job.update({
    where:{
        id: jobId
    },
    data:{
         title,
        company,
        location,
        jobType,
        experience,
        description,
        skills,
        salary,
        applyUrl,
        isActive,

    }
 })

 return res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: updatedJob,

 })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'Internal server error'
        })
    }
}

export const deleteJob = async ( req: Request ,res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job  ID",
      });
    }

    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
        success:false,
        message: 'Internal server error'
    })
  }
};