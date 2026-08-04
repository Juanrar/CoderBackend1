import { Router } from 'express';

const router = Router();

router.get('/', async(req, res) => {
    res.render('home', { 
        code: '200 papa'
    });
})

router.get('/products', async (req, res) => {
    
    const testProducts = [
        { 
            _id: "123", 
            title: "Grand Theft Auto: San Andreas", 
            price: 19.99, 
            stock: 15, 
            thumbnails: ["https://images.launchbox-app.com/56b5479a-bba5-43d6-b458-0fcd00bf10ba.png"] 
        },
        { 
            _id: "456", 
            title: "Resident Evil 4", 
            price: 17.99, 
            stock: 10, 
            thumbnails: ["https://images.launchbox-app.com/r2_acc0564e-f465-405b-bf84-0ee721b1714d.png"] 
        }
    ];

    res.render('products', { 
        payload: testProducts,  
        code: '200 papa',
    });
});

export default router;