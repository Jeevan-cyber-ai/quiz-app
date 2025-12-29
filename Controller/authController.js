const User=require('../Models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register=async(req,res)=>{
    const {name,email,phone,dept,year}=req.body;
    if (!name||!email||!phone||!dept||!year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword=await bcrypt.hash(phone,10);

  

    try{
        const user=await User.create({name,email,phone:hashedPassword,dept,year});
        if(!user){
            return res.status(400).json({message:"User registration failed"});
        }

    else{
        res.status(200).json({
    message: "Registration successful",
    
  });
    }
    }
    catch(err){ 

        console.log("Error in user registration",err);
        return res.status(500).json({message:"Error in user registration"});
    }           


}

exports.login=async(req,res)=>{
    const{email,phone}=req.body;
    try{
        if(!email||!phone){
        return res.status(400).json({message:"Email and Phone are required"});
    }
    const user=await User.findOne({email:email});
       if(!user){
        return res.status(400).json({message:"Invalid email or phone"});
    }       

    const isMatch = await bcrypt.compare(phone, user.phone);
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or phone" });
        }
    else{
          const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

        return res.status(200).json({message:"Login successful",token,role:user.role});
    }

    }
    catch(err){ 
        console.log("Error in user login",err);
        return res.status(500).json({message:"Error in user login"});
    }     


}


exports.canEnterQuiz = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select("attempt");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        if (user.attempt < 1) {
            return res.status(200).json({ 
                canEnter: true, 
                message: "You are eligible to start the quiz." 
            });
        } else {
            return res.status(403).json({ 
                canEnter: false, 
                message: "Access Denied: You have already completed your attempt." 
            });
        }

    } catch (err) {
        console.error("Error checking quiz eligibility:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

