import { Prisma } from "@prisma/client";
import { Paginated, Sorted } from "../types/queryTypes";
import dataSource from "./dataSource";

const getAll = async (
  args: Sorted & Paginated,
) => {
  var orderStates = [];
  var orderByParams = {};

  switch (args.orderBy) {
    case "id":
      orderByParams = { id: args.ascend ? "asc" : "desc" };
      break;
    case "name":
      orderByParams = { name: args.ascend ? "asc" : "desc" };
      break;
  }

  if (args.paginated) {
    orderStates = await dataSource.orderState.findMany({
      skip: args.perPage * (args.page - 1),
      take: args.perPage,
      orderBy: orderByParams,
    });
  } else {
    orderStates = await dataSource.orderState.findMany({
      orderBy: orderByParams,
    });
  }
  return orderStates;
};

const search = async (
  args: { search: string } & Sorted & Paginated,
): Promise<any> => {
  var orderByParams = {};

  switch (args.orderBy) {
    case "id":
      orderByParams = { id: args.ascend ? "asc" : "desc" };
      break;
    case "name":
      orderByParams = { name: args.ascend ? "asc" : "desc" };
      break;
  }

  return {
    "orderStates": await dataSource.orderState.findMany({
      skip: args.perPage * (args.page - 1),
      take: args.perPage,
      orderBy: orderByParams,
      where: {
        name: {
          contains: args.search,
        },
      },
    }),
    "count": await dataSource.orderState.count({
      where: {
        name: {
          contains: args.search,
        },
      },
    }),
  };
};

const create = async (item: Prisma.orderStateCreateInput) => {
  return await dataSource.orderState.create({
    data: {
      name: item.name,
      cssBadgeClass: item.cssBadgeClass,
    },
  });
};

const update = async (id: number, item: Prisma.orderStateUpdateInput) => {
  return await dataSource.orderState.update({
    data: {
      name: item.name,
      cssBadgeClass: item.cssBadgeClass,
    },
    where: {
      id: id,
    },
  });
};

const deleteOrderState = async (id: number) => {
  return await dataSource.orderState.delete({
    where: {
      id: id,
    },
  });
};

const getSingle = async (id: number) => {
  return await dataSource.orderState.findFirst({
    where: {
      id: id,
    },
  });
};

export default {
  getAll,
  create,
  update,
  deleteOrderState,
  search,
  getSingle,
};
