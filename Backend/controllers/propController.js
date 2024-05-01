import usermodel from "../models/usermodel.js";
import propertymodel from "../models/propertymodel.js";
import { decode } from "jsonwebtoken";

export const addpropertyController = async(req,res) => {
    try {
        const {address, description, price, bought} = req.body;
        const {id} = decode(req.headers.authorization);
        if(!address){
            return res.status(400).send({
                success:false,
                message:"Address is required",
            })
        }
        if(!description){
            return res.status(400).send({
                success:false,
                message:"Description is required",
            })
        }
        if(!price){
            return res.status(400).send({
                success:false,
                message:"Price is required",
            })
        }
        if(bought === undefined || bought === null){
            return res.status(400).send({
                success:false,
                message:"Bought Status is required",
            })
        }
        try {
            const property = await new propertymodel({
                Address: address,
                Description: description,
                Price: price,
                Bought: bought,
                owner: id,
            }).save();
            return res.status(201).send({
                success: true,
                message: "Property added successfully",
                property
            })
        } catch (error) {
            return res.status(500).send({
                success:false,
                message: "Couldn't add property",
                error
            })
        }
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"Error in adding property",
            error
        })
    }
}

export const getallpropertiesController = async (req,res)=>{
    try {
        const properties = await propertymodel.find();
        return res.status(200).send({
            success: true,
            message: "Properties fetched successfully",
            properties,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in get all properties api",
            error
        })
    }
}

export const getpropertyController = async(req,res) => {
    try {
        const property = await propertymodel.findOne({_id:req.params.id});
        if(!property){
            return res.status(404).send({
                success: false,
                message: "No such property",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Property fetched successfully",
            property
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in get properties api"
        })
    }
}

export const updatepropertyController = async(req,res) => {
    try {
        const {address, description, price, bought} = req.body;
        const {id} = req.params;
        const property = await propertymodel.findOne({_id:id});
        if (address){
            property.address=address;
        }
        if (description){
            property.description=description;
        }
        if (price){
            property.price=price;
        }
        if (bought){
            property.Bought=bought;
        }
        await property.save();
        return res.status(200).send({
            success: true,
            message: "Updated successfully",
            property
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in update property api"
        })
    }
}

export const buypropertyController = async(req,res) => {
    try {
        const {id} = req.params;
        const buyer = decode(req.headers.authorization).id;
        const property = await propertymodel.findOne({_id:id});
        const oldOwner = property.owner;
        property.Bought = true;
        property.owner = buyer;
        await property.save();
        const user = await usermodel.findOne({_id:buyer});
        user.properties.push(property._id);
        await user.save();
        const oldUser = await usermodel.findOne({_id:oldOwner});
        oldUser.properties.pull(property._id);
        await oldUser.save();
        return res.status(200).send({
            success: true,
            message: "Property bought",
            property
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in buy api",
            error
        })
    }
}

export const deletepropertyController = async(req,res) => {
    try {
        const {id} = req.params;
        const user = decode(req.headers.authorization).id;
        const property = await propertymodel.findOne({_id:id});
        if ((property.owner.toString()) != user){
            return res.status(403).send({
                success: false,
                message: "You are not the owner!!!"
            })
        }
        await propertymodel.deleteOne({_id:id});
        const owner = await usermodel.findOne({_id:user});
        owner.properties.pull(id);
        await owner.save();
        return res.status(200).send({
            success: true,
            message: "Deleted successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in delete property api",
            error
        })
    }
}

export const boughtpropertyController = async(req,res) => {
    try {
        const {id} = decode(req.headers.authorization);
        const properties = await usermodel.findOne({_id:id});
        return res.status(200).send({
            success:true,
            message:"properties fetched",
            properties: properties.properties,
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"Error in bought property api",
            error
        })
    }
}