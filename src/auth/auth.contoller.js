import User from "../modules/users/user.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";

// Register
export const register = async (req, res) => {
  const { email, username, password } = req.body;
  
  try {
    const role = "USER_ROLE";
    const user = new User({ username, email, password, role });
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Login 

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the email exists:
    const user = await User.findOne({ email: email.toLowerCase() });

    if(user && (await bcryptjs.compare(password, user.password))){
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

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email'); // Buscar por ID y seleccionar solo los campos necesarios
    
    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error retrieving user data",
      error: error.message
    });
  }
};