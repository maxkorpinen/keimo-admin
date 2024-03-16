import mongoose from "mongoose";
import { Civ } from "./civModel.js";

const unitSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        building: {
            type: String,
            required: true
        },
        isGoldUnit: {
            type: Boolean,
            required: true
        },
        isMeta: {
            type: Boolean,
            required: true
        },
        isUnique: {
            type: Boolean,
            required: true
        },
        counterOf: [],
        counteredBy: [],
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

// Keep as a pre middleware for the 'deleteOne' method
unitSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const unitId = this.getQuery()._id;
    // Remove the unit from all Civ documents
    await Civ.updateMany(
        {},
        { 
            $pull: { 
                'units.feudal': unitId,
                'units.castle': unitId,
                'units.imperial': unitId
            } 
        }
    );
    // Remove the unit from the counterOf and counteredBy arrays of all Unit documents
    await Unit.updateMany(
        {},
        { $pull: { counterOf: unitId, counteredBy: unitId } }
    );
    next();
});

export const Unit = mongoose.model('Unit', unitSchema);