import path from "node:path";
import {
  AccountCodeSchema,
  AccountTagSchema,
  type Database,
  JournalEntryLineSchema,
  JournalEntrySchema,
} from "@yuuka/db";
import type { Kysely } from "kysely";
import * as R from "remeda";
import { db } from "../src/db.js";
import { JournalEntryLoader } from "../src/loaders/JournalEntryLoader.js";
import { AccountCodeLoader } from "../src/loaders/AccountCodeLoader.js";
import { settings } from "../src/settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

// TODO: journal은 가변데이터가 가까운데 어디에서 취급하지?
const journalPath = path.join(financialReportsPath, "journals");
const journalContext = R.pipe(
  await JournalEntryLoader.read(journalPath, "journal_2024_03.csv"),
  (x) => JournalEntryLoader.convert(x),
);

const sheetPath = path.join(financialReportsPath, "sheets");
const masterdata_account = R.pipe(
  await AccountCodeLoader.read(sheetPath),
  (x) => AccountCodeLoader.convert(x),
);

/**
 * 마스터데이터는 한번만 불러오면 불변
 * ...인데 배포 이후에는 마스터데이터 전략을 바꿔야한다
 */
const MasterData = Object.freeze({
  accountCodes: masterdata_account.accountCodes,
  accountTags: masterdata_account.accountTags,
});

const rootUserId = 1;

// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountTag = async (db: Kysely<Database>) => {
  const items = MasterData.accountTags.map((x): AccountTagSchema.NewRow => {
    return {
      userId: rootUserId,
      code: x.code,
      major: x.major,
      minor: x.minor,
      name: x.name,
      description: x.description,
    };
  });

  await db.insertInto(AccountTagSchema.name).values(items).execute();
};

const insertBulk_accountCode = async (db: Kysely<Database>) => {
  const items = MasterData.accountCodes.map((x): AccountCodeSchema.NewRow => {
    return {
      userId: rootUserId,
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });

  await db.insertInto(AccountCodeSchema.name).values(items).execute();
};

const insertBulk_journalEntry = async (db: Kysely<Database>) => {
  const items = journalContext.entries.map(
    (journal): JournalEntrySchema.NewRow => {
      return {
        userId: rootUserId,
        entryId: journal.id,
        date: journal.date,
        brief: journal.brief,
      };
    },
  );
  await db.insertInto(JournalEntrySchema.name).values(items).execute();
};

const insertBulk_journalEntryLine = async (db: Kysely<Database>) => {
  const items = journalContext.entries.flatMap((journal) => {
    const lines = journal.lines.map((line): JournalEntryLineSchema.NewRow => {
      const skel = {
        userId: rootUserId,
        entryId: journal.id,
        code: line.code,
      };

      if (line._tag === "debit") {
        return {
          ...skel,
          tag: JournalEntryLineSchema.debitTag,
          amount: line.debit,
        };
      }

      if (line._tag === "credit") {
        return {
          ...skel,
          tag: JournalEntryLineSchema.creditTag,
          amount: line.credit,
        };
      }

      throw new Error("unreachable");
    });
    return lines;
  });

  await db.insertInto(JournalEntryLineSchema.name).values(items).execute();
};

export const insertBulk = async (db: Kysely<Database>) => {
  // 첫행이 존재하면 테이블이 비어있지 않은거로 해석
  {
    const found = await db
      .selectFrom(AccountTagSchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_accountTag(db);
    }
  }

  {
    const found = await db
      .selectFrom(AccountCodeSchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_accountCode(db);
    }
  }

  {
    const found = await db
      .selectFrom(JournalEntrySchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_journalEntry(db);
    }
  }

  {
    const found = await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_journalEntryLine(db);
    }
  }
};

await insertBulk(db);
