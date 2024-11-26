// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Category } = require('../../db/models/index');

export const createCategory = async (payload: any) => {
  try {
    return await Category.create(payload);
  } catch (error) {
    throw new error('Category was not created', error);
  }
};

export const getAllCategories = async () => {
  return await Category.findAll();
};

export const updateCategory = async (where: object, payload: object) => {
  return await Category.update(payload, { where });
};


export const deleteCategory = async (id: string) => {
  try {
    return await Category.destroy({ where: { id } });
  } catch (error) {
    throw new Error(error);
  }
};
