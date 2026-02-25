const { productsDB } = require('../db');
const { sendNotification } = require('./pushController');

const getProducts = async (req, res) => {
    try {
        const products = await productsDB.find({});
        res.json(products);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProductById = async (req, res) => {
    try {
        const product = await productsDB.findOne({ _id: req.params.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const addProduct = async (req, res) => {
    try {
        const newProduct = {
            name: req.body.name,
            price: Number(req.body.price),
            description: req.body.description,
            category: req.body.category,
            watts: req.body.watts || '',
            recipes: req.body.recipes || '',
            image: req.files?.image ? req.files.image[0].path : '',
            video: req.files?.video ? req.files.video[0].path : '',
            rating: 0,
            numReviews: 0,
            reviews: [],
            createdAt: new Date()
        };
        const product = await productsDB.insert(newProduct);
        res.status(201).json(product);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProduct = async (req, res) => {
    try {
        await productsDB.remove({ _id: req.params.id }, {});
        res.json({ message: 'Product deleted' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const addReview = async (req, res) => {
    const { rating, comment, userName } = req.body;
    const productId = req.params.id;
    try {
        const product = await productDB.findOne({ _id: productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const review = { name: userName, rating: Number(rating), comment, createdAt: new Date() };
        const reviews = product.reviews || [];
        reviews.push(review);

        const numReviews = reviews.length;
        const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
        const avgRating = totalRating / numReviews;

        await productsDB.update({ _id: productId }, { $set: { reviews, rating: avgRating, numReviews } });
        
        // Send push notification to admin
        const stars = '⭐'.repeat(Math.round(rating));
        sendNotification({
            body: {
                title: `${stars} New Review on ${product.name}`,
                body: `${userName}: ${comment.substring(0, 60)}...`,
                icon: '/logo.png',
                data: { productId, rating, type: 'new_review' }
            }
        }, { json: () => {} });
        
        res.status(201).json({ message: 'Review Added' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};


const askQuestion = async (req, res) => {
    const { question, userName } = req.body;
    const productId = req.params.id;
    try {
        const product = await productsDB.findOne({ _id: productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const questions = product.questions || [];
        questions.push({
            question,
            askedBy: userName,
            answer: '',
            answeredAt: null,
            createdAt: new Date()
        });

        await productsDB.update({ _id: productId }, { $set: { questions } });
        res.status(201).json({ message: 'Question submitted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const answerQuestion = async (req, res) => {
    const { answer, questionIndex } = req.body;
    const productId = req.params.id;
    try {
        const product = await productsDB.findOne({ _id: productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const questions = product.questions || [];
        if (questions[questionIndex] === undefined) return res.status(404).json({ message: 'Question not found' });

        questions[questionIndex].answer = answer;
        questions[questionIndex].answeredAt = new Date();

        await productsDB.update({ _id: productId }, { $set: { questions } });
        res.status(200).json({ message: 'Answer submitted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, addProduct, deleteProduct, addReview, askQuestion, answerQuestion };
