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



