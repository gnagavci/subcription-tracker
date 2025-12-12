import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [true, "Price must be greater than 0"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP"],
        default: "USD"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],

    },
    category: {
        type: String,
        enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"],
        required: [true, "Subscriptions must have a category"]
    },
    paymentMethod: {
        type: String,
        required: [true, "Subscriptions must have a payment method"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => {
               value <= new Date(); //the start date of the subscription must be in the past, can't be in the future   
            },
            message: "Start date must be in the past",

        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            // "this" keyword doesn't work this arrow functions
            validator: function (value){
                return value >= this.startDate; //renewal date can't be in the past, subjective to this subscription model
            }, 
        },
        message: "Renewal date must be in the future"

    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //accepting an ID that will be a reference to the User model
        ref: "User",
        required: true,
        index: true, //optimizes the queries by indexing the user field
    }



}, {timestamps: true});

//function to auto-calculate the renewal date if missing
subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        //calculate the renewal date based on the start date + the subscription frequency
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate + renewalPeriods[this.frequency]);

    }

    // auto-update the status if renewal date has already passed
    if(this.renewalDate < new Date()){
        this.status = "expired";
    }

    next(); //proceed with the creation of that document in the database
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;


