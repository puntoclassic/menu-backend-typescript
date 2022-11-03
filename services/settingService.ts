import { prisma } from "@prisma/client";
import dataSource from "./dataSource";

const writeSetting = async (name: string, value: string) => {
  if (
    await dataSource.setting.count({
      where: {
        name: name,
      },
    }) > 0
  ) {
    return await dataSource.setting.updateMany({
      data: {
        value: value,
      },
      where: {
        name: name,
      },
    });
  } else {
    return await dataSource.setting.create({
      data: {
        name: name,
        value: value,
      },
    });
  }
};

const writeSettings = async (data: any) => {
  var operations = Object.entries(data).map((row: any) =>
    dataSource.setting.upsert({
      create: {
        name: row[0],
        value: row[1].toString(),
      },
      update: {
        value: row[1].toString(),
      },
      where: {
        name: row[0],
      },
    })
  );

  await dataSource.$transaction(operations);
};

const getSetting = async (name: string) => {
  return await dataSource.setting.findFirst({ where: { name: name } });
};

const fetchAll = async () => {
  return await dataSource.setting.findMany();
};

export default { writeSetting, getSetting, fetchAll, writeSettings };
