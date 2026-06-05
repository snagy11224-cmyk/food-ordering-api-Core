import {Router} from "express";

import {pingDB} from "../../common/knex/knex.js";

export const healthRoutes = Router();

healthRoutes.get('/',async (req, res) => {
    try {
        await pingDB();     
        res.status(200).json({status: 'ok'});
    } catch (error) {           
        res.status(500).json({status: 'error', message: 'DB down'});
    }   
});