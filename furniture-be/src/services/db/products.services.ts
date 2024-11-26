// eslint-disable-next-line @typescript-eslint/no-var-requires
import { surveyTextType } from '../../constants/global';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Product, Answer, Category } = require('../../db/models/index');
import { Op } from 'sequelize';

export const getPaginatedProducts = async (
  page: number,
  limit: number,
  category: string,
  query: string
) => {
  const where = {} as { title: object, category_id?: string };

  if (query) {
    where.title = {
      [Op.iLike]: `%${query}%`,
    };
  }

  if (category !== 'All' ) {
    where.category_id = category;
  }

  const { count, rows } = await Product.findAndCountAll({
    offset: page * limit,
    limit,
    include: [
      {
        model: Category,
      },
    ],
    order: [['created_at', 'DESC']],
    where,
  });

  if (!rows.length) {
    return {};
  }

  const totalPages = !count ? 1 : Math.ceil(count / limit);

  return {
    totalPages,
    page: page + 1,
    content: rows,
  };
};

export const getUserPaginatedProducts = async (
  page: number,
  limit: number,
  query: string,
) => {
  try {
    const offset = page * limit;
    const where = query ? { title: { [Op.iLike]: `%${query}%` } } : undefined;

    const { count, rows } = await Product.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: Category,
        },
      ],
      order: [['created_at', 'DESC']],
      where: {...where, status: { [Op.not]: 'created' }},
    });

    return {
      totalPages: Math.ceil(count / limit) || 1,
      page: page + 1,
      content: rows,
    };
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const createProduct = async (payload: object) => {
  try {
    return await Product.create(payload);
  } catch (error) {
    throw new error('Product was not created', error);
  }
};

export const getProduct = async (where: object) => {
  return await Product.findOne({
    where,
  });
};

function transformAnswers(
  answers: { id: string; value: string; option: [] }[][]
) {
  const result: any = {};

  for (const subArray of answers) {
    for (const item of subArray) {
      const { id, value, option } = item;
      if (!result[id]) {
        result[id] = { id, data: [] };
      }
      result[id].data.push(value || option);
    }
  }

  return Object.values(result);
}

type CountResult = { id: string; count: number }[];

function countStrings(arr: string[] | string[][]): CountResult {
  const counts: Record<string, number> = {};

  const flatArray = Array.isArray(arr[0])
    ? (arr as string[][]).flat()
    : (arr as string[]);

  for (const str of flatArray) {
    counts[str] = (counts[str] || 0) + 1;
  }

  return Object.entries(counts).map(([id, count]) => ({ id, count }));
}

export const getAnalytic = async (id: string) => {
  const product = await Product.findOne({ where: { id } });
  const answers = await Answer.findAll({ where: { survey_id: id } });

  const surveyData = JSON.parse(product.data);
  const answersData = answers.map((item: any) => JSON.parse(item.data));
  const convertedAnswers = transformAnswers(answersData);

  const analytic = surveyData.map((surveyItem: any) => {
    const { id: surveyId, type, options, title } = surveyItem;
    const surveyAnswers: any = convertedAnswers.find(
      (item: any) => item.id === surveyId
    );

    const data = surveyAnswers?.data || [];
    let resultOptions;
    let value;

    if (type === surveyTextType) {
      value = countStrings(data as string[]); // Подсчёт для текстовых ответов
    } else {
      const counts = countStrings(data as string[][]);
      resultOptions = options.map(
        ({ id, label }: { id: string; label: string }) => {
          const foundCount = counts.find(
            (item) => item.id.toString() === id.toString()
          );
          return { id, title: label, count: foundCount?.count || 0 };
        }
      );
    }

    return { id: surveyId, title, type, options: resultOptions, value };
  });

  return {
    analytic,
    title: product.title,
    id: product.id,
  };
};

export const getUserProduct = async (where: object, user_id: number) => {
  return await Product.findOne({
    where,
    include: [
      {
        model: Answer,
        where: { user_id },
        required: false,
      },
    ],
  });
};

export const updateProduct = async (where: object, payload: object) => {
  await Product.update(payload, { where });
};

export const deleteProduct = async (id: string) => {
  try {
    await Product.destroy({ where: { id } });
  } catch (error) {
    throw new Error(error);
  }
};
