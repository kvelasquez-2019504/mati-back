import { validationResult } from "express-validator";
import User from "../models/User.js"; // Suponiendo que tienes un modelo User
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Crear usuario
    const user = new User({ username, email, password });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar usuario en la base de datos
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the email exists:
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcryptjs.compare(password, user.password))) {
      const token = await generarJWT(user.id, user.email)

      res.status(200).json({
        msg: "You have successfully logged in",
        userDetails: {
          username: user.username,
          role: user.role,
          token: token
        },
      });
    }

    if (!user) {
      return res
        .status(400)
        .send(`Wrong credentials, ${email} doesn't exists en database`);
    }

    // check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send("wrong password");
    }

  } catch (e) {
    res.status(500).send("Contact administrator");
  }
};