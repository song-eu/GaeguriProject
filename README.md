### gaeguri

#### Project Seed 추가 방법
 1. npm i 
 2. .env configuration 추가
  DB_USERNAME='DB USER ID'
  DB_PASSWORD='DB USER PWD'
  TYPEORM_SEEDING_FACTORIES=src/seed/factory/*.factory.ts
  TYPEORM_SEEDING_SEEDS=src/seed/seed/*.seed.ts
 4. mysql 에서 'create schema gaeguri;' 실행 
 3. npm run seed:run
