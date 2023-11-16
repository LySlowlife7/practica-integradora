import "../config/db.js";
import { ProductosModel } from "../modules/productos.modules.js";

export class ProductoDao {
    ID_FIELD = "_id";

    static async exists(id) {
        try {
            return await ProductosModel.findById(id);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(options = {}) {
        try {
            const { limit = 10, page = 1, sort, query } = options;
            const skip = (page - 1) * limit;
            const sortOptions = {};

            if (sort) {
                sortOptions.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0;
            }

            const products = await ProductosModel.find(query)
                .limit(limit)
                .skip(skip)
                .sort(sortOptions);

            return products;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async count(query = {}) {
        try {
            const totalProducts = await ProductosModel.countDocuments(query);
            return totalProducts;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async getProductById(objectId) {
        try {
            const product = await ProductosModel.findOne({
                [this.ID_FIELD]: objectId,
            });
            console.log(product);
            return product;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async createProduct(object) {
        try {
            return await ProductosModel.create(object);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateProductById(id, object) {
        try {
            await ProductosModel.findByIdAndUpdate(
                {
                    [this.ID_FIELD]: id,
                },
                object,
                {
                    runValidators: true,
                }
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteProductById(id) {
        try {
            return await ProductosModel.findByIdAndDelete({ [this.ID_FIELD]: id });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}