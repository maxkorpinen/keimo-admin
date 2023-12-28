import mongoose from "mongoose";

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
        counterOf: [],
        counteredBy: []
    },
    {
        timestamps: true,
    }
);

export const Unit = mongoose.model('Unit', unitSchema);