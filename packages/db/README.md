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

```bash
# -p, --pretty 옵션 넣어야 한줄짜리 쿼리 아닌게 나온다.
# 다른 옵션은 선택적으로 써도 될거같은데 pretty는 사실상 필수
pnpm typeorm migration:generate -p migrations/{name}
```
