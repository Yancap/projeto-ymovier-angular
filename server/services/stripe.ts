import Stripe from 'stripe';
import { configDotenv, DotenvParseOutput } from 'dotenv';

const config: Stripe.StripeConfig = {
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'yMovier',
    version: '0.1.0',
  },
};

let dotenv = configDotenv().parsed as DotenvParseOutput;

const __KEY = dotenv['STRIPE_API_KEY'] as string;

export const stripe = new Stripe(__KEY, config);
