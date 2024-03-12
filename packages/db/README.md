# db

```bash
cd package/db
pnpm typeorm migration:run
```

```bash
# 테스트 db에 집어넣을 쿼리 생성
pnpm typeorm schema:log

# 테스트 db에 직접 밀어넣기
pnpm typeorm schema:sync
```
