import { CarritosModel } from "../modules/carritos.modules.js";

export class CarritoDao {
    ID_FIELD = "_id";
    
    async createCart() {
        try {
            return await CarritosModel.create({});
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async deleteCartById(id) {
        try {
            return await CarritosModel.findByIdAndDelete({[this.ID_FIELD]: id})
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async saveProductToCart(id, productId) {
        try {
            const cart = await CarritosModel.findByIdAndUpdate(
                id,
                { $push: { products: productId } },
                { new: true }
            );
            return cart ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteProductFromCart(id, productId) {
        try {
            const cart = await CarritosModel.findByIdAndUpdate(
                id,
                { $pull: { products: productId } },
                { new: true }
            );
            return cart ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateCart(id, products) {
        try {
            const cart = await CarritosModel.findByIdAndUpdate(
                id,
                { products },
                { new: true }
            );
            return cart ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateProductQuantity(id, productId, quantity) {
        try {
            const cart = await CarritosModel.findOneAndUpdate(
                { _id: id, "products._id": productId },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );
            return cart ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async clearCart(id) {
        try {
            const cart = await CarritosModel.findByIdAndUpdate(
                id,
                { products: [] },
                { new: true }
            );
            return cart ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAllProductsFromCart(id) {
        try {
            return await CarritosModel.findById(id).populate('products').select({products: 1, _id:0});
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}