const express = require('express');
const path = require('path');
const ejsmate = require('ejs-mate'); // Ensure this is required
const app = express();
const port = 8080;

// Set up view engine with ejs-mate
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON body data
app.use(express.json());

// Middleware to set current path for active sidebar link
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const products = [
    { id: 1, name: 'Apple iPhone 14', price: 799, stock: 25, description: 'Latest Apple iPhone model', category: 'Smartphones' },
    { id: 2, name: 'Samsung Galaxy S22', price: 699, stock: 30, description: 'Flagship Samsung phone', category: 'Smartphones' },
    { id: 3, name: 'Google Pixel 7', price: 599, stock: 15, description: 'Google\'s latest Pixel phone', category: 'Smartphones' },
    { id: 4, name: 'OnePlus 10 Pro', price: 899, stock: 10, description: 'High performance OnePlus phone', category: 'Smartphones' }
];

const dashboardSummary = {
    totalProducts: 150,
    totalOrders: 320,
    activeCustomers: 85,
    revenue: 12500
};

const recentActivities = [
    { id: 1, activity: 'Order #1001 placed', date: '2024-06-01' },
    { id: 2, activity: 'Product "Apple iPhone 14" added', date: '2024-06-02' },
    { id: 3, activity: 'Customer "Jane Smith" registered', date: '2024-06-03' }
];

const orders = [
    { id: 1001, customer: 'John Doe', date: '2024-06-01', status: 'Processing', total: 150.00 },
    { id: 1002, customer: 'Jane Smith', date: '2024-06-02', status: 'Shipped', total: 200.00 }
];

const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' }
];

app.get('/orders', (req, res) => {
    res.render('orders/index', { orders });
});

app.get('/customers', (req, res) => {
    res.render('customers/index', { customers });
});

const logistics = [
    { id: 1, carrier: 'FedEx', trackingNumber: '123456789', status: 'In Transit' },
    { id: 2, carrier: 'UPS', trackingNumber: '987654321', status: 'Delivered' }
];

app.get('/logistics', (req, res) => {
    res.render('logistics/index', { logistics });
});

const analytics = [
    { id: 1, metric: 'Sales', value: 10000 },
    { id: 2, metric: 'Visitors', value: 5000 }
];

app.get('/analytics', (req, res) => {
    res.render('analytics/index', { analytics });
});

const finances = [
    { id: 1, account: 'Sales Revenue', amount: 50000 },
    { id: 2, account: 'Operating Expenses', amount: 20000 }
];

app.get('/finances', (req, res) => {
    res.render('finances/index', { finances });
});

const branches = [
    { id: 1, name: 'Main Branch', location: 'New York' },
    { id: 2, name: 'West Branch', location: 'Los Angeles' }
];

app.get('/branches', (req, res) => {
    res.render('branches/index', { branches });
});

const staff = [
    { id: 1, name: 'Alice Johnson', position: 'Manager', email: 'alice@example.com' },
    { id: 2, name: 'Bob Williams', position: 'Sales', email: 'bob@example.com' }
];

app.get('/staff', (req, res) => {
    res.render('staff/index', { staff });
});

const settings = {
    siteName: 'SuperStore Admin Dashboard',
    adminEmail: 'admin@superstore.com',
    itemsPerPage: 10
};

app.get('/settings', (req, res) => {
    if (!settings) {
        return res.status(500).send('Settings not found');
    }
    res.render('settings/index', { settings });
});

app.post('/settings', (req, res) => {
    const { siteName, adminEmail, itemsPerPage } = req.body;
    settings.siteName = siteName;
    settings.adminEmail = adminEmail;
    settings.itemsPerPage = Number(itemsPerPage);
    res.redirect('/settings');
});

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// List products
app.get('/products', (req, res) => {
    res.render('products/index', { products });
});

// Show add product form
app.get('/products/add', (req, res) => {
    res.render('products/add');
});

// Handle add product
app.post('/products/add', (req, res) => {
    const { name, price, stock } = req.body;
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push({ id, name, price: Number(price), stock: Number(stock) });
    res.redirect('/products');
});

// Show edit product form
app.get('/products/edit/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === Number(id));
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('products/edit', { product });
});

// Handle edit product
app.post('/products/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const product = products.find(p => p.id === Number(id));
    if (!product) {
        return res.status(404).send('Product not found');
    }
    product.name = name;
    product.price = Number(price);
    product.stock = Number(stock);
    res.redirect('/products');
});

// Handle delete product
app.post('/products/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) {
        return res.status(404).send('Product not found');
    }
    products.splice(index, 1);
    res.redirect('/products');
});



app.get('/dashboard', (req, res) => {
    // Calculate dashboard summary dynamically
    const dashboardSummary = {
        totalProducts: products.length,
        totalOrders: orders.length,
        activeCustomers: customers.length,
        revenue: orders.reduce((sum, order) => sum + order.total, 0)
    };

    // Generate recent activities from orders and products (simple example)
    const recentActivities = [];

    orders.slice(-3).forEach(order => {
        recentActivities.push({
            id: order.id,
            activity: `Order #${order.id} placed by ${order.customer}`,
            date: order.date
        });
    });

    products.slice(-3).forEach(product => {
        recentActivities.push({
            id: product.id + 1000, // offset id to avoid collision
            activity: `Product "${product.name}" added`,
            date: '2024-06-02' // static date for example
        });
    });

    // Sort recent activities by date descending (assuming date format YYYY-MM-DD)
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render('dashboard/index', { dashboardSummary, recentActivities });
});

// Search route
app.get('/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const results = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    res.render('search', { query: req.query.q, results });
});

// Profile route
app.get('/profile', (req, res) => {
    // For demo, use a static user profile
    const userProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        avatar: 'https://placehold.co/100x100'
    };
    res.render('profile/index', { user: userProfile });
});

// Notifications route
app.get('/notifications', (req, res) => {
    // Sample notifications data
    const notifications = [
        { id: 1, message: 'Order #1001 has been shipped', date: '2024-06-04' },
        { id: 2, message: 'New product "Samsung Galaxy S22" added', date: '2024-06-03' },
        { id: 3, message: 'Customer "Jane Smith" registered', date: '2024-06-02' }
    ];
    res.render('notifications/index', { notifications });
});

app.get('/logout', (req, res) => {
    // Render logout confirmation page
    res.render('logout/index');
});
