import { category, Prisma } from "@prisma/client";
import { Paginated, Sorted } from "../types/queryTypes";
import dataSource from "./dataSource";
var cache = require("memory-cache");
var slugify = require("slugify");

const createCategory = async (args: Prisma.categoryCreateInput) => {
  return await dataSource.category.create({
    data: {
      name: args.name,
      slug: String(slugify(args.name)).toLowerCase(),
    },
  });
};

const updateCategory = async (id: number, args: Prisma.categoryUpdateInput) => {
  return await dataSource.category.update({
    data: {
      name: args.name,
      slug: String(slugify(args.name)).toLowerCase(),
    },
    where: {
      id: id,
    },
  });
};

const updateImageUrl = async (url: string, id: number) => {
  await dataSource.category.update({
    data: {
      image_url: url,
    },
    where: {
      id: id,
    },
  });
};

const deleteCategory = async (id: number) => {
  return await dataSource.category.delete({
    where: {
      id: id,
    },
  });
};

const getById = async (id: number): Promise<category | null> => {
  return await dataSource.category.findFirst({
    where: {
      id: id,
    },
  });
};

const getBySlug = async (slug: string): Promise<category | null> => {
  return await dataSource.category.findFirst({
    where: {
      slug: slug,
    },
  });
};

const getAll = async (
  params:
    & {
      cached?: boolean;
    }
    & Paginated
    & Sorted,
): Promise<category[]> => {
  var cacheKey = "categories|" + params.paginated + "|" + params.page + "|" +
    params.perPage;
  var cachedCategories = cache.get(
    cacheKey,
  );

  if (cachedCategories && params.cached) {
    return cachedCategories;
  } else {
    var categories = [];
    var orderByParams = {};

    switch (params.orderBy) {
      case "id":
        orderByParams = { id: params.ascend ? "asc" : "desc" };
        break;
      case "name":
        orderByParams = { name: params.ascend ? "asc" : "desc" };
        break;
    }

    if (params.paginated) {
      categories = await dataSource.category.findMany({
        skip: params.perPage * (params.page - 1),
        take: params.perPage,
        orderBy: orderByParams,
      });
    } else {
      categories = await dataSource.category.findMany({
        orderBy: orderByParams,
      });
    }
    cache.put(cacheKey, categories, 30 * 1000);
    return categories;
  }
};

const search = async (
  args:
    & {
      search: string;
    }
    & Sorted
    & Paginated,
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

  if (args.paginated) {
    return {
      "categories": await dataSource.category.findMany({
        skip: args.perPage * (args.page - 1),
        take: args.perPage,
        orderBy: orderByParams,
        where: {
          name: {
            contains: args.search,
          },
        },
      }),
      "count": await dataSource.category.count({
        where: {
          name: {
            contains: args.search,
          },
        },
      }),
    };
  } else {
    return {
      "categories": await dataSource.category.findMany({
        orderBy: orderByParams,
        where: {
          name: {
            contains: args.search,
          },
        },
      }),
      "count": await dataSource.category.count({
        where: {
          name: {
            contains: args.search,
          },
        },
      }),
    };
  }
};

const checkCategoryExists = async (category_id: number) => {
  return await dataSource.category.count({
    where: {
      id: category_id,
    },
  });
};

export default {
  getBySlug,
  getAll,
  getById,
  createCategory,
  updateImageUrl,
  updateCategory,
  deleteCategory,
  search,
  checkCategoryExists,
};
