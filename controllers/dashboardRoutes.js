const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');


// Get Request for the homepage
router.get('/', withAuth, async (req, res) => {
    try {
        // Get all posts
        const postData = await Post.findAll({

            where: {
                userId: req.session.userId,
            },
        });
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('allPosts', {
            layout: 'dashboard',
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/new', withAuth, (req, res) => {
    res.render('newPost', {
        layout: 'dashboard',
    });
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);

        const post = postData.get({ plain: true });

        res.render('editPost', {
            layout: 'dashboard',
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
