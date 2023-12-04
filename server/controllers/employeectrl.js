const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const employee = require('../models/employee')
const Team = require('../models/teams')
const secret = 'theValueIsInYouNotWithout'
// exports.login = async(req,res)=>{
//     const {email,password} = req.body
//     const token = JWT.sign(email,secret)
//     try {
//         const employee = await employee.findOne({email})
//         if(employee){
//             const validPassword = await bcrypt.compare(password,employee.password)
//             if(validPassword){
//                 employee.jwt = token
//                 await employee.save() 
//                 res.json({token})
//             }else res.json({error:'access denied'})
    
//         }else res.json({error:'access denied'})
             
//     } catch (error) {
//         console.log(error)
//         res.json({error:'access denied'})
//     }

// }


function findSmallestArray(arrays) {
   
  
    let smallestArray = arrays[0];
  
    for (let i = 1; i < arrays.length; i++) {
      if (arrays[i].members.length < smallestArray.members.length) {
        smallestArray = arrays[i];
      }
    }
  
    return smallestArray;
  }
  


exports.register = async(req,res) =>{
    
    let {name,email, password} = req.body 
    let teams = await Team.find({})

    try {
        let currentEmployee = await employee.findOne({email})
        if(currentEmployee){
         return res.status(400).json({message:"You already have an account please go to login page"})
        }else{
            password = await bcrypt.hash(password,12)
            const newEmployee = new employee({email, password,employeeName:name})
            let Employee = await newEmployee.save()
            let assignedTeam = findSmallestArray(teams)
            assignedTeam.members.push(Employee._id)
            await assignedTeam.save()
            Employee.team = assignedTeam._id
            await Employee.save()
            res.json({token:Employee._id, admin:false}) 
        }
    } catch (error) {
      res.status(400).end()
    } 

}

exports.employeeData = async(req,res) =>{

  try{
    const token = req.headers.authorization.split(' ')[1]
    console.log('tokennnn============>>>>',token)
    let currentEmployee = await employee.findOne({_id:token})
    .populate('sales')
    .populate({
      path:'team',
      populate:[{
        path:'members'
      },
      {
        path:'transactions'
      }]
 
    })
    let total = 0
    let team = currentEmployee.team
    let teamName = team.teamName
    let sales = currentEmployee.sales
    if(sales[0] !== undefined){
      total = sales.reduce((acc,curr)=>acc+=curr.total,0)
    }
    team = team.members.map(members =>{
      
      return members.employeeName
    })
    console.log("Team==>", team)
    console.log("Sales==>", sales)
   return res.json({name:currentEmployee.employeeName,team, employeeId:currentEmployee._id, teamName, total})
  }catch(e){
    console.log(e)
    res.status(200).end()
  }
    


}



