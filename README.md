# IDX-PropertySearch

A Zillow/Redfin-style property search experience backed by real MLS data.

---

## Week 1
Environment setup and Database import. MySQL running in Docker with both tables populated and queryable.

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


---

## Week 2
Node/Express server and health checkpoint.

### Node.js project setup
Initialize Node.js project in a backend folder.
```
mkdir backend
cd backend
npm init
```
Then, install the necessary dependencies:
```
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

## Week 3
Property search endpoint with filters and indexing.

### Search Endpoint
Make sure the docker container is running with `docker ps`, and run the server with `npm run dev`.

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

### Indexing
Check which indexes the database may already have with command `SHOW INDEX FROM rets_property;`.
For columns without an index, add an index through `CREATE INDEX [index name] ON rets_property ([column name]);` There may be an error at this point with the message "ERROR 1067 (42000): Invalid default value for 'active_check'". This is because MySQL8 strict mode may reject some default value the sql file holds. Fix this by temporarily disabling strict mode with command `SET sql_mode = '';`.

Running EXPLAIN on the table before and after adding indexes should show that the number of rows it checks decreases, and that your new indexes are being used. The following is an example of an EXPLAIN you can run.
```
EXPLAIN SELECT * FROM rets_property WHERE L_SystemPrice >= 300000;
```

