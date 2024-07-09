
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    sold: Boolean,
});

const Product = mongoose.model('Product', productSchema);

app.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Product.deleteMany({});
        await Product.insertMany(response.data);
        res.status(200).send('Database initialized');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/transactions', async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    const regex = new RegExp(search, 'i');

    try {
        const transactions = await Product.find({
            dateOfSale: { $regex: `-${month}-` },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex },
            ],
        })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const totalSaleAmount = await Product.aggregate([
            { $match: { dateOfSale: { $regex: `-${month}-` } } },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } },
        ]);

        const totalSoldItems = await Product.countDocuments({
            dateOfSale: { $regex: `-${month}-` },
            sold: true,
        });

        const totalNotSoldItems = await Product.countDocuments({
            dateOfSale: { $regex: `-${month}-` },
            sold: false,
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity },
    ];

    try {
        const data = await Promise.all(priceRanges.map(async (range) => {
            const count = await Product.countDocuments({
                dateOfSale: { $regex: `-${month}-` },
                price: { $gte: range.min, $lte: range.max },
            });
            return { range: range.range, count };
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    try {
        const data = await Product.aggregate([
            { $match: { dateOfSale: { $regex: `-${month}-` } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/combined', async (req, res) => {
    const { month } = req.query;

    try {
        const transactions = await Product.find({ dateOfSale: { $regex: `-${month}-` } });
        const totalSaleAmount = await Product.aggregate([
            { $match: { dateOfSale: { $regex: `-${month}-` } } },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } },
        ]);

        const totalSoldItems = await Product.countDocuments({
            dateOfSale: { $regex: `-${month}-` },
            sold: true,
        });

        const totalNotSoldItems = await Product.countDocuments({
            dateOfSale: { $regex: `-${month}-` },
            sold: false,
        });

        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity },
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Product.countDocuments({
                dateOfSale: { $regex: `-${month}-` },
                price: { $gte: range.min, $lte: range.max },
            });
            return { range: range.range, count };
        }));

        const pieChartData = await Product.aggregate([
            { $match: { dateOfSale: { $regex: `-${month}-` } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            transactions,
            statistics: {
                totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
                totalSoldItems,
                totalNotSoldItems,
            },
            barChart: barChartData,
            pieChart: pieChartData,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
