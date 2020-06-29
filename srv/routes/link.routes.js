const { Router } = require('express');
const config = require('config');
const Link = require('../models/Link');
const auth = require('../../middleware/auth.middleware');
const shortid = require('shortid');
const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl');
    const { from } = req.body;
    const code = shortid.generate();
    const existing = await Link.findOne({ form });
    if (existing) {
      return res.json({ link: existing });
    }
    const to = baseUrl + '/t/' + code;
    const link = new Link({ code, to, owner: req.user.userId });
    await link.save();
    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({ message: 'internal server error, try again in several minutes' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'internal server error, try again in several minutes' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const links = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'internal server error, try again in several minutes' });
  }
});

module.exports = router;
