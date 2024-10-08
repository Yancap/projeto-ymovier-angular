import { Client } from 'faunadb';
import { config, DotenvParseOutput } from 'dotenv';

let dotenv = (config().parsed && process.env) as DotenvParseOutput;

export const fauna = new Client({
    secret: dotenv['FAUNADB_KEY']  as string
})
