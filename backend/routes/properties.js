import express from 'express';
const router = express.Router();
import db from '../db.js';

const VALID_SORT = [
    'L_SystemPrice',
    'ListingContractDate', //date listed
    'LM_Int2_3', //sqft 
    'L_Keyword2' //beds
];

const SORT_COLUMN_MAP = {
    'price': 'L_SystemPrice',
    'date': 'ListingContractDate',
    'sqft': 'LM_Int2_3',
    'beds': 'L_Keyword2'
};

//property search w/ filters
router.get('/', async (req, res) => {
    try{
        const { city, zipcode, minPrice, maxPrice, beds, baths, sortBy, sortOrder = 'asc'} = req.query;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = parseInt(req.query.offset, 10) || 0;


        const errors = [];
        //Validation
        if(Number.isNaN(Number(limit)) || limit <= 0 || limit > 100){
            errors.push('limit must be a positive integer between 0 and 100');
        }

        if(Number.isNaN(Number(offset)) || offset < 0){
            errors.push('offset must be a non-negative integer');
        }

        let sortColumn = null;
        if(sortBy){
            if(VALID_SORT.includes(sortBy)){
                sortColumn = sortBy;
            }else if(SORT_COLUMN_MAP[sortBy]){
                sortColumn = SORT_COLUMN_MAP[sortBy];
            }else{
                errors.push(`Invalid sortBy value. Must be one of: ${Object.keys(SORT_COLUMN_MAP).join(', ')}`);
            }
        }

        if(sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())){
            errors.push('sortOrder must be either "asc" or "desc"');
        }

        if(minPrice!==undefined && (isNaN(Number(minPrice)) || Number(minPrice) < 0)){
            errors.push('minPrice must be a non-negative number');
        }

        if(maxPrice!==undefined && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)){
            errors.push('maxPrice must be a non-negative number');
        }

        if(beds!==undefined && (!Number.isInteger(Number(beds)) || Number(beds)<0)){
            errors.push('beds must be a non-negative integer');
        }

        if(baths!==undefined && (isNaN(Number(baths)) || Number(baths)<0)){
            errors.push('baths must be a non-negative number');
        }

        if(errors.length>0){
            return res.status(400).json({ error: 'Invalid query parameters', details: errors});
        }

        

        const conditions = [];
        const params = [];

        if(city){
            conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
            params.push(city);
        }
        if(zipcode){
            conditions.push('L_Zip = ?');
            params.push(zipcode);
        }
        if(minPrice !== undefined){
            conditions.push('L_SystemPrice >= ?');
            params.push(parseFloat(minPrice));
        }
        if(maxPrice !== undefined){
            conditions.push('L_SystemPrice <= ?');
            params.push(parseFloat(maxPrice));
        }
        if(beds !== undefined){
            conditions.push('L_Keyword2 = ?');
            params.push(parseInt(beds,10));
        }
        if(baths !== undefined){
            conditions.push('LM_Dec_3 = ?');
            params.push(parseFloat(baths, 10));
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        let orderByClause = '';
        if(sortColumn){
            const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
            orderByClause = `ORDER BY ${sortColumn} ${order}`;
        }

        //pagination
        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`, params
        );
        const total = countRows[0].total;

        const [rows] = await db.query(
            `SELECT * FROM rets_property ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        res.json({
            total,
            limit,
            offset,
            sortBy: sortColumn || 'default',
            sortOrder: sortOrder || 'asc',
            result: rows,
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//openhouses by id
router.get('/:id/openhouses', async (req, res) => {
    try{
        const { id } = req.params;

        //validation: id of numbers between 9 to 10 digits
        if(!/^\d{9,10}$/.test(id)){
            return res.status(400).json({error: 'id has to be a string of integers'});
        }

        //Check whether property exists
        const [rows] = await db.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?',
            [id]
        );

        if(rows.length===0){
            return res.status(404).json({error: 'Property not found'});
        }

        //If property exists, return all matching openhouse events
        const [openHouseRows] = await db.query(
            `SELECT * FROM rets_openhouse WHERE L_ListingID = ?
            ORDER BY OH_StartDate ASC, OH_StartTime ASC`,
            [id]
        );

        res.json(openHouseRows);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

//return property by id
router.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;

        //validation: id of numbers between 9 to 10 digits
        if(!/^\d{9,10}$/.test(id)){
            return res.status(400).json({error: 'id has to be a string of integers'});
        }

        const [rows] = await db.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?',
            [id]
        );

        if(rows.length===0){
            return res.status(404).json({error: 'Property not found'});
        }

        res.json(rows[0]);
    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
    
});



export default router;

