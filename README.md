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
```
//TODO

---

## Week 2
Node/Express server and health checkpoint.

//TODO


