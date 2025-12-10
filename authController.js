const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user');

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

exports.signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, password: passwordHash, name });
    res.send ({message: "Welcome!!"});
  } catch (error) {
    res.status(500).send({ message: 'Sorry something happened try again' });
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Missing email or password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Sorry something happened try again' });
  }
};