'use strict';

import mongoose from 'mongoose';

// Function to connect to the database
export const dbConnection = async () => {
    try {
        // Event handlers
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Connected to MongoDB');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | Connected to database');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected');
        });

        // Try to connect to the database
        await mongoose.connect(process.env.MONGODB_CNN, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (error) {
        console.log('Database connection failed', error);
    }
};