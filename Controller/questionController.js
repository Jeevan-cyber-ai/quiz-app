const Question=require('../Models/Questions');
const User=require('../Models/User');

const getGeneralAptiQuestions=async(req,res)=>{
     try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
   
   
    const questions = await Question.find({ category: "General Aptitude" })
     if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    return res.status(200).json({questions});
    }
    catch(err){
        console.log("Error fetching questions",err);
        res.status(500).json({message:"Error fetching questions"}); 

    }


}
const getTechnicalAptiQuestions=async(req,res)=>{
     try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId).select("dept year");   
   console.log("User details:", user);
    if (!user) {
        
      return res.status(404).json({ message: "User not found" });
    }
    const { dept, year } = user;
    const QUESTION_COUNT = 20;
   if (!dept || !year) {
    console.log(req.body.dept);
    console.log(req.body.year); 
    return res.status(400).json({ message: "dept and year required" });
  }
    const questions = await Question.aggregate([
      {
        $match: {
          category: "Technical Aptitude",
          dept: dept,
          year: Number(year)
        }
      },
      { $sample: { size: QUESTION_COUNT } },
      {
        $project: {
          questionText: 1,
          options: 1
         
        }
      }
    ]);
     if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    return res.status(200).json({questions});
    }
    catch(err){
        console.log("Error fetching questions",err);
        res.status(500).json({message:"Error fetching questions"}); 

    }


}

const calculateScore = async (answers) => {
    let score = 0;
    for (const item of answers) {
        const question = await Question.findById(item.qId);
        if (question && question.correctAnswer === item.selected) {
            score++;
        }
    }
    return score;
};

const submitGeneral = async (req, res) => {
    const score = await calculateScore(req.body.answers);
    await User.findByIdAndUpdate(req.user.id, { 
        $inc: { marks: score, q_attended: req.body.answers.length },
        $set: { marks_general: score } 
    });
    res.json({ message: "General section submitted", score });
};

const submitTechnical = async (req, res) => {
    const score = await calculateScore(req.body.answers);
   
    await User.findByIdAndUpdate(req.user.id, { 
        $inc: { marks: score, q_attended: req.body.answers.length },
        $set: { marks_technical: score, attempt: 1 } 
    });
    res.json({ message: "Technical section submitted. Quiz complete.", score });
};

const getFinalResults = async (req, res) => {
    const user = await User.findById(req.user.id).select("marks marks_general marks_technical q_attended");
    res.json(user);
};

module.exports={getGeneralAptiQuestions,getTechnicalAptiQuestions,submitGeneral,submitTechnical,getFinalResults};   