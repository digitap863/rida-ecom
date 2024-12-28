import { manufacturer as manufacturerModel } from "../model/manufacturer.mjs";



export const addManufacturer = async (req, res) => {
    try {
        const { name, description, subcategory } = req.body;
        const manufacturer = new manufacturerModel({ name, description, subcategory });
        await manufacturer.save();  
        res.status(201).send({ message: "Manufacturer added successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}

export const getManufacturer = async (req, res) => {
    try {
        const manufacturers = await manufacturerModel.find({});
        res.status(200).send({ manufacturers, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}