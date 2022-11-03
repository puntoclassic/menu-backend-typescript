import { food, Prisma } from "@prisma/client";
import { Paginated, Sorted } from "../types/queryTypes";
import dataSource from "./dataSource";

const search = async (
  args:
    & {
      search: string;
    }
    & Paginated
    & Sorted,
): Promise<any> => {
  var orderByParams = {};

  switch (args.orderBy) {
    case "id":
      orderByParams = { id: args.ascend ? "asc" : "desc" };
      break;
    case "name":
      orderByParams = { name: args.ascend ? "asc" : "desc" };
      break;
    case "price":
      orderByParams = { price: args.ascend ? "asc" : "desc" };
      break;
    case "category":
      orderByParams = { category: { name: args.ascend ? "asc" : "desc" } };
      break;
  }

  var query = {
    OR: [
      {
        name: {
          contains: args.search,
        },
      },
      {
        ingredients: {
          contains: args.search,
        },
      },
      {
        category: {
          name: {
            contains: args.search,
          },
        },
      },
    ],
  };

  return {
    "foods": await dataSource.food.findMany({
      skip: args.perPage * (args.page - 1),
      take: args.perPage,
      orderBy: orderByParams,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      where: query,
    }),
    "count": await dataSource.food.count({
      where: query,
    }),
  };
};

const getByCategory = async (categoryId: number): Promise<food[]> => {
  return await dataSource.food.findMany({
    where: {
      categoryId: categoryId,
    },
  });
};

type GetFoodsByCategoryBySlugParams = {
  categorySlug: string;
} & Paginated;

const getByCategorySlug = async (
  args: GetFoodsByCategoryBySlugParams,
): Promise<food[]> => {
  if (args.paginated) {
    return await dataSource.food.findMany({
      where: {
        category: {
          slug: args.categorySlug,
        },
      },
      skip: args.perPage * (args.page - 1),
      take: args.perPage,
    });
  } else {
    return await dataSource.food.findMany({
      where: {
        category: {
          slug: args.categorySlug,
        },
      },
    });
  }
};

type GetFoodsParams = {
  paginate: boolean;
  page: number;
  perPage: number;
};

const getAll = async (
  args: GetFoodsParams,
): Promise<food[]> => {
  if (args.paginate) {
    return await dataSource.food.findMany({
      skip: args.perPage * (args.page - 1),
      take: args.perPage,
    });
  } else {
    return await dataSource.food.findMany();
  }
};

const create = async (
  args: Prisma.foodCreateInput,
) => {
  return await dataSource.food.create({
    data: args,
    include: {
      category: true,
    },
  });
};

const update = async (
  id: number,
  args: Prisma.foodUpdateInput,
) => {
  return await dataSource.food.update({
    where: {
      id: id,
    },
    data: args,
  });
};

const deleteSingle = async (id: number) => {
  return await dataSource.food.delete({
    where: {
      id: id,
    },
  });
};

const getById = async (id: number) => {
  return await dataSource.food.findFirst({
    where: {
      id: id,
    },
  });
};

export default {
  getByCategory,
  getByCategorySlug,
  getAll,
  getById,
  search,
  create,
  update,
  deleteSingle,
};
