
import { Request , Response , NextFunction } from 'express'
import prisma from '../db/prisma'




export const createCompany = async ( req: Request , res: Response , next: NextFunction) => {

    try{

        const {  name, establishedYear, type, industry, description, website, logo,} = req.body;

        if(!name) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            })
        }

        const company = await prisma.company.create({
            data:{

                name,
                establishedYear,
                type,
                industry,
                description,
                website,
                logo
            }
        })

        return res.status(200).json({
            success: true,
            message: "Company created successfully",
            data: company

        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Internal server error"

        })
    }
}

export const getAllCompanies = async ( req: Request , res: Response , next: NextFunction) {

    try {

        const companies = await prisma.company.findMany({

            orderBy: {
                name: "asc"

            },
            include:{
                _count: {
                    select:{
                        products: true,
                        interviewRounds: true,
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,

        })

    } catch (error){
        return res.status(500).json({
            success:false,
            message: "Internal server error",
        })
    }
}