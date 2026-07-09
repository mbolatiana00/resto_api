import { request, Request, response, Response } from "express";

import {
    checkAndGrantLoyaltyCoupon,
    applyCoupon,
    getUserCoupons,
    grantLoyaltyCouponsForAllRestaurants,
    
} from '../services/coupon.service'

export const getMyCoupon = async (request:Request,response:Response):Promise <void> =>{
    try {
        const userId = (request as any).user.id;
        const coupon = await getUserCoupons(userId);

        response.status(200).json({
            success:true,
            count: coupon.length,
            coupon,
        });
    } catch (err: any) {
        response.status(500).json({success:false, message:err.message})
    }
}

export const checkLoyality = async (request: Request, response:Response): Promise<void>=>{
    try {
        const userId : (request as any).user.id
    } catch (err:any) {
        
    }
}