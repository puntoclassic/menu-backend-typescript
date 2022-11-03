import { Prisma } from "@prisma/client";
import { Paginated, Sorted } from "../types/queryTypes";
import dataSource from "./dataSource";

//list orders paginated or not
const getAll = async (
  params:
    & {
      user?: any;
    }
    & Sorted
    & Paginated,
) => {
  var orderByParams = {};
  switch (params.orderBy) {
    case "id":
      orderByParams = { id: params.ascend ? "asc" : "desc" };
      break;
  }

  var filter: Prisma.orderFindManyArgs = {};
  var query: Prisma.orderWhereInput = {};

  if (params.user != null) {
    query = {
      user: {
        id: params.user.id,
      },
    };

    filter.where = {
      user: {
        id: params.user.id,
      },
    };
  }

  if (params.paginated) {
    filter.skip = params.perPage * (params.page - 1);
    filter.take = params.perPage;
  }

  return {
    "orders": await dataSource.category.findMany({
      where: query,
      take: filter.take,
      skip: filter.skip,
      orderBy: orderByParams,
    }),
    "count": await dataSource.category.count({ where: query }),
  };
};

//search orders (by user optional)
const search = async (
  params:
    & {
      searchKey: string;
      user?: any;
    }
    & Sorted
    & Paginated,
) => {
  var orderByParams = {};

  switch (params.orderBy) {
    case "id":
      orderByParams = { id: params.ascend ? "asc" : "desc" };
      break;
  }

  var filter: Prisma.orderFindManyArgs = {};
  var query: Prisma.orderWhereInput = {};

  if (params.searchKey) {
    query.details = {
      some: {
        name: params.searchKey,
      },
    };
  }

  if (params.user) {
    query.user_id = params.user.id;
  }
  filter.where = query;

  if (params.paginated) {
    filter.skip = params.perPage * (params.page - 1);
    filter.take = params.perPage;
  }

  return {
    "orders": await dataSource.category.findMany({
      where: query,
      take: filter.take,
      skip: filter.skip,
      orderBy: orderByParams,
    }),
    "count": await dataSource.category.count({ where: query }),
  };
};

//create order

//update order

//get order detail

//delete order

export default {
  getAll,
  search,
};
