'use server'

import { auth } from '@clerk/nextjs/server';
import Stripe  from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! , {
    apiVersion: '2025-09-30.clover'
})

export async function createCheckoutSession(credits: number){
    const {userId} = await auth();

    if(!userId) throw new Error('User not authenticated');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card' ],
        line_items:[
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${credits} `
                    }
                }
            }
        ]
    })




}
