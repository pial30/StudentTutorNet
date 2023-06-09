import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getall = async (req, res) => {
  try {
    const user = await User.find();
    const users=user.map(({_id,firstName,lastName})=>{
      const name=firstName+" "+lastName;
      return {_id, name};
    })
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */


export const updateInfo = async (req, res) => {
  try {
   const {id} = req.params;
   const user = await User.findById(id);
   const {
     firstName,
     lastName,
     email,
     password,
     school,
     company,
     about,
     location,
     occupation,
     picturePath,
   } = req.body;

       user.firstName=firstName;
       user.lastName=lastName;
        user.email=email,
        user.password=password;
        if(req.body.picturePath){
          user.picturePath=req.file.path;
        }
       user.location=location;
       user.occupation=occupation;
       user.school=school;
       user.company=company;
       user.about=about;
   const updated=await user.save();
   const updateduser = await User.findById(id);
   res.status(200).json(updateduser);
  } catch (err) {
   res.status(409).json({ message: err.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
   const {id} = req.params;
   const user = await User.findById(id);
   user.notification=[];
   const updated=await user.save();
   const updateduser = await User.findById(id);
   res.status(200).json(updateduser);
  } catch (err) {
   res.status(409).json({ message: err.message });
  }
};
