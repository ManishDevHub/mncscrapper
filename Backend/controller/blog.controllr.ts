 import { NextFunction, Request, Response } from "express";
 import prisma from "../db/prisma";
import { error } from "console";

 export const createBlog  =  async ( req:Request , res:Response , next: NextFunction ) => {

    try{

        const { title , content , excerpt , thumnail , published} = req.body
;
if( !title  || !content){
    return  res.status(400).json({
        succes: false,
        message: " Title and content are required"
    })
}
const slug  = title.toLowerCase().trim().replace(/[^a-z0-9]+/g , "-").replace(/^-+|-+$/g , "");
const exitingBlog = await prisma.blog.findUnique({
    where:{
        slug
    }
})
if(exitingBlog){
    return res.status(409).json({
        succes: false,
        message: " A blog with this title already exists"
    })
}

const blog = await prisma.blog.create({

    data:{
        title , 
        slug,
        content,
        excerpt,
        thumnail,
        published: published ?? false,
    }
})

return res.status(201).json({
    succes: true,
    message: " Blog created successfully",
    data: blog
})
    }catch( error ){
        res.status(500).json({
            succes: false,
            message: " Internal server error "
        })

    }
 }
    

 // GEt all blogs

 export const getAllBlogs = async ( req: Request  , res: Response ,next: NextFunction ) => {

    try{

        const blogs = await prisma.blog.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            success: true,
            message: " Blogs fetched successfully ",
            count : blogs.length,
            data: blogs,
        })


    } catch( error){
        return res.status(500).json({
            success:false,
            message: " Internal server error",
        })
    }
 }