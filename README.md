# IDX-PropertySearch

A Zillow/Redfin-style property search experience backed by real MLS data.

<img width="1117" height="823" alt="Screenshot 2026-09-01 at 8 14 16 AM" src="https://github.com/user-attachments/assets/01e84b9f-4fba-4983-b38c-4ff7fd5288e6" />

## Tech Stack

### Frontend
- **[React](https://reactjs.org/)** (19.2.7)
- **[React Router](https://reactrouter.com/)** (6.30.0)

### Backend
- **[Node.js](https://nodejs.org/)** (22.20.0)
- **[Express](https://expressjs.com/)** (5.2.1)
- **[MySQL](https://www.mysql.com/)** (v8.0)
- **[mysql2](https://github.com/sidorares/node-mysql2)** (3.22.5)

### Testing
- **[Jest](https://jestjs.io/)** (30.5.0)
- **[React Testing Library](https://testing-library.com/react)** (7.2.2)

### Development
-  **[ESLint](https://eslint.org/)** (v8.57.1)

---

## Environment setup and Database import

Create MySQL 8 container:
```bash
docker run --name idx-mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<password> -e MYSQL_DATABASE=rets -d mysql:8
```

Import SQL files:
```bash
docker exec -i idx-mysql-local mysql -u root -p<password> rets < /filepath.sql

```
### Check container is running and tables populated correctly
```bash
docker ps
docker exec -it idx-mysql-local mysql -u root -p
USE rets;
SHOW TABLES;
```
This should list rets_openhouse and rets_property.
```
SELECT COUNT(*) FROM rets_property
SELECT COUNT(*) FROM rets_openhouse
```

These should both return non-zero numbers.

### Indexing
Check which indexes the database may already have with command `SHOW INDEX FROM rets_property;`.
For columns without an index, add an index through `CREATE INDEX [index name] ON rets_property ([column name]);` There may be an error at this point with the message "ERROR 1067 (42000): Invalid default value for 'active_check'". This is because MySQL8 strict mode may reject some default value the sql file holds. Fix this by temporarily disabling strict mode with command `SET sql_mode = '';`.

Running EXPLAIN on the table before and after adding indexes should show that the number of rows it checks decreases, and that your new indexes are being used. The following is an example of an EXPLAIN you can run.
```
EXPLAIN SELECT * FROM rets_property WHERE L_SystemPrice >= 300000;
```

---


## Set up Backend

Install the necessary dependencies:
```
cd backend
npm install express, mysql2, dotenv, cors
npm install --save-dev nodemon
```
Create the env files following this template (this should never be committed, make sure it is in .gitignore!)
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
PORT=
```

### Health Check
Run the project with 
```
npm run dev
```

And check the health endpoint:
```
curl http://localhost:5001/api/health
```

This should return the connection status to the database.

---

## Set up Frontend

```
cd ../frontend
npm install
npm start
```
And add the google maps API to the env with this shape:
```
REACT_APP_GOOGLE_MAPS_API_KEY
```

You should now be able to access the app on `http://localhost:3000/`

---
## APIs

### GET /api/properties
When queried with the following parameters:
```
GET
/api/properties?city=Portland&minPrice=300000&beds=3&limit=20&offset=0
```

Should return something with the following shape:
```
{ "total": 87, "limit": 20, "offset": 0, "results": [...] }
```

Filter supports city, zipcode, minPrice, maxPrice, beds, baths; these are listed as L_City, L_Zip, L_SystemPrice, L_Keyword2, LM_Dec_3 in the property sql file respectively. Invalid inputs should return 400. This can be tested by the following bash command:
```
curl "http://localhost:5001/api/properties?city=Acton&limit=20&offset=0"
```
Where parameters can be exchanged for other values, and separated by &.

### GET /api/properties/:id

Example:
```
curl http://localhost:5001/api/properties/1077426281
```

Where id is between 9 to 10 digits, should return the full property object for this single property, or 404 if it doesn't exist.

### GET /api/properties/:id/openhouses

Example:
```
curl "http://localhost:5001/api/properties/[id]/openhouses"
```

Which returns open house events for this property in the form of an array. This may return an empty array. To check using an id that has openhouses, can use the following command to check in the sql files.

```
SELECT p.L_ListingID 
    -> FROM rets_property p
    -> INNER JOIN rets_openhouse o ON p.L_ListingID = o.L_ListingID
    -> LIMIT 5;
```
This will return ids that appear in both properties and openhouses.

---
## Database Schema

### rets_property

| Field | Description |
| --- | --- |
| L_ListingID   | A unique listing id for each property |
| L_Address | Address of the property |
| L_Zip | Zip code of the property |
| LM_Int2_3 | Square Feet of the property |
| L_Keyword2| Number of beds |
| LM_Dec_3 | Number of baths |
| L_SystemPrice | The price of the property |
| ListingContractDate | Date the property was listed |

### rets_openhouse
| Field | Description |
| --- | --- |
| L_ListingID | A unique listing id for each property, same as for rets_property|
| OH_StartDate | The start date of the openhouse |
| OH_StartTime | Starting time of the openhouse |

---
## Testing
For frontend, run `npm run test` in the frontend directory for all the unit tests, which include tests for PropertyCard, Pagination, Filters, and the client. To check coverage, run `npm test:coverage`.

For backend, run `npm test` in the backend directory for all the unit tests, which includes unit tests for properties.js and checks all the property routes. To check coverage, run `npm test:coverage`.





