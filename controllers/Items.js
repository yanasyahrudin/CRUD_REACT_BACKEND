import { Op } from "sequelize";
import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";

export const getItems = async (req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Item.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        } else {
            response = await Item.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId,
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getItemById = async (req, res) => {
    try {
        const item = await Item.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!item) return res.status(404).json({ msg: 'Data not found' })
        let response;
        if (req.role === 'admin') {
            response = await Item.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: item.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        } else {
            response = await Item.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: item.id },
                    { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createItem = async (req, res) => {
    const { name, price } = req.body
    try {
        await Item.create({
            name: name,
            price: price,
            userId: req.userId
        })
        res.status(201).json({ msg: 'Item created successfully' })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const updateItem = async(req, res) => {
    try {
        const item = await Item.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!item) return res.status(404).json({ msg: 'Data not found' })
        const { name, price } = req.body
        if (req.role === 'admin') {
            await Item.update({name, price}, {
                where: {
                    id: item.id
                }
            })
        } else {
            if (req.userId !== item.userId) return res.status(403).json({msg: 'Forbidden access'})
            await Item.update({name, price}, {
                where: {
                    [Op.and]: [{ id: item.id },
                    { userId: req.userId }]
                },
            })
        }
        res.status(200).json({msg: 'Item updated successfuly'})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const deleteItem = async(req, res) => {
    try {
        const item = await Item.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!item) return res.status(404).json({ msg: 'Data not found' })
        const { name, price } = req.body
        if (req.role === 'admin') {
            await Item.destroy({
                where: {
                    id: item.id
                }
            })
        } else {
            if (req.userId !== item.userId) return res.status(403).json({msg: 'Forbidden access'})
            await Item.destroy({
                where: {
                    [Op.and]: [{ id: item.id },
                    { userId: req.userId }]
                },
            })
        }
        res.status(200).json({msg: 'Item deleted successfuly'})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}