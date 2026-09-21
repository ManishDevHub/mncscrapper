
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

export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const companyId = Number(id);

    if (Number.isNaN(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        products: {
          orderBy: {
            name: "asc",
          },
        },

        interviewRounds: {
          orderBy: {
            roundNumber: "asc",
          },
        },
      },
    });

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
  } catch (error) {
    next(error);
  }
}


export const updateCompany = async ( req: Request , res: Response , next: NextFunction ) => {

    try{

          const {id} = req.params
    const companyId = Number(id)

    if( Number.isNaN(companyId)){
        return res.status(400).json({
            success: false,
            message: "Invalid company Id "
        })
    }
const existingCompany = await prisma.company.findUnique({
    where:{
        id: companyId
    }
})

if(!existingCompany){
    return res.status(404).json({
        success: false,
        message: " Company not found"
    })
}

const { name ,  establishedYear, type,industry, description, website, logo,} = req.body;

const updatedCompany = await prisma.company.update({

    where: {
        id : companyId
    },
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
    success: true ,
    message: "Company updated successfully"
})

    } catch(error){
        next(error)
    }
  

}