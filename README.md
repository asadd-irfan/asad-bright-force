1) npm install -g migrate-mongo

2) npm i migrate-mongo


Checking the status of the migrations

At any time, you can check which migrations are applied (or not)


$ migrate-mongo status


│    Filename                          │    Applied At    │

├─────────────────────────────────────────┼────────────┤

│ 20160608155948-blacklist_the_beatles.js │ PENDING    │


 
Migrate up

This command will apply all pending migrations


$ migrate-mongo up

MIGRATED UP: 20160608155948-blacklist_the_beatles.js


If an an error occurred, it will stop and won't continue with the rest of the pending migrations


If we check the status again, we can see the last migration was successfully applied:


$ migrate-mongo status


│    Filename                          │    Applied At    │

├─────────────────────────────────────────┼──────────────────────────┤

│ 20160608155948-blacklist_the_beatles.js │ 2020-04-08T20:13:30.415Z │



Migrate down

With this command, migrate-mongo will revert (only) the last applied migration



$ migrate-mongo down

MIGRATED DOWN: 20160608155948-blacklist_the_beatles.js

PLEASE MAKE SURE THAT YOU HAVE WRITE CORRECT URL OF MIGRATION DB IN MIGRATION_DB_URI VARIABLE IN .ENV FILE 

for example: " MIGRATION_DB_URI = "mongodb://localhost:27017/brightforce" "


admin email: admin@brightforce.com,

admin password: 123456

company email: user@gmail.com,

company password: 123456

talent email: talent1@gmail.com, talent2@gmail.com,

talent password: 123456
