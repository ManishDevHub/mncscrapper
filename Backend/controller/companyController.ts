
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


export const deleteCompany = async ( req:Request , res:Response) => {
    const id = req.params
    const companyId = Number(id);

    if(Number.isNaN(companyId)){
        return res.status(400).json({

            success: false,
            message: "Invalid company Id"
        })



    }

    const company = await prisma.company.findUnique({
        where: {
            id: companyId,
        }
    })

    if(!company){
        return res.status(404).json({
            success: false,
            message: "company not found"
        })
    }

    await prisma.company.delete({
        where:{
            id: companyId
        }
    })

    return res.status(200).json({
        success: true,
        message: "company deleted successfully"
    })


}

export const createProduct = async (req:Request , res: Response) =>{

    try{

        const { id } = req.params
        const companyId = Number(id)

        if(Number.isNaN(companyId)){
            return res.status(400).json({
                success:false,
                message: "Invalid company Id",
            })
        }

        const { name } = req.body
         if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const product = await prisma.product.create({
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


    } catch (error){

        return res.status(500).json({
            success: false,
            message: "intenal server error" 
        })
    }
}


export const updateProduct = async (req:Request , res:Response) => {

    try{

        const { id , productId } = req.params;
        const companyId = Number(id)
        const productIdNumber = Number(companyId)

        if(Number.isNaN(companyId) || Number.isNaN(productIdNumber)){
            return res.status(400).json({

                success: false ,
                message: " Product id or company id not found "
            })
        }

        const { name } = req.body

        if(!name){
            return res.status(404).json({

                success: false,
                message:"Product name required"
            })
        }

        const product = await prisma.product.findFirst({
            where:{
                id: productIdNumber,
                companyId
            }
        })

        if( !product){
            return res.status(404).json({

                success: false,
                message: " Product not found",
            })
        }

        const updatedProduct = await prisma.product.update({
            where:{
                id: productIdNumber
            },
            data:{
                name
            }
        })

        return res.status(200).json({
            success:true,
            message:"Product updated successfully",
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const deleteProduct = async( req:Request , res: Response) => {

    try{

        const { id , productId} = req.params;
        const companyId = Number(productId)
        const companyIdProduct  = Number(id)

        if(Number.isNaN(companyId) || Number.isNaN(companyIdProduct)){
            return res.status(400).json({
                success: false,
                message: "product or company id required"
            })
        }

        const product = await prisma.product.findFirst({
            where:{
                id:companyIdProduct
            }
        })

        if(!product){
            return res.status(404).json({
                success: false,
                message: " Product not found"
            })
        }

        const deletedProduct = await prisma.product.delete({
            Where:{
                id: companyIdProduct,
                companyId
            }
        })

        return res.status(200).json({

            success: false,
            message: " Product deleted successfully"

        })


    } catch( error) {

        return res.status(500).json({
            success: false,
             message: " Internal server error",
             data: "your data"
        })
    }
}


const createInterViewRou = async ( req: Request , res:Response) => {


    try{

        const id = req.params
        const companyId = Number(id)

        if(Number.isNaN(companyId)){
            return res.status(400).json({
                success: false,
                message: " Company Id is required"
            })
        }

        const { roundNumber , title , discription } = req.body;


        const company = await prisma.company.findUnique({

            where:{
                id: companyId
            }
        })

        if(!company){
            return res.status(404).json({

                success: false, 
                message: " company  not found"
            })
        }

        const exitstingRound = await prisma.interviewRound.FindFirst({
            where:{
                id: companyId,
                roundNumber,
                
            }
        })

        if(exitstingRound){
            return res.status(409).json({
                success: false,
                message: " Round all ready exist"
            })
        }

        const round = await prisma.interviewRound.create({
            data:{

                title,
                discription,
                roundNumber,
                companyId
            }
        })
        
        return res.status(201).json({
            sucess: true,
            message: " round created successfully",
            data:round
        })

    } catch ( error) {

        return res.status(500).json({
            success: false,
            message: " INternal server error"
            
        })
    }
}