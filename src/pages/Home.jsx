import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {

  //Get Existing User Data //
const getExistingUserData = async () => {
 try {
  const res = await axios.get('http://localhost:3070/get-existing-users')
  const data = res.data
  const usernames = []
  const emails = []
  data.map((user, key) => {
    usernames.push(user.username) 
    emails.push(user.email)
  })
  setExistingUserData({
    usernames,
    emails
  })
 } catch (err) {
  console.log(err)
 }
  
}

useEffect(()=> {
  getExistingUserData()
},[])

  const [existingUserData, setExistingUserData] = useState({

  })

  const [register, setRegister] = useState({
    username: '',
    name: '',
    email:'',
    password: '',
    confirm:'',
  })
  
  const [statusCode, setStatusCode] = useState('')

  const inputHandler = (val) => {
    setRegister(prev => ({...prev,[val.target.name]: val.target.value}))
  }
  ///Runs checks then submits user form ///
  const submitHandler = async (e) => {
   // Checks for Existing users error and length error //
   e.preventDefault()
   if (register.username.length < 6 || register.username.length > 15 ) {
    return statusCodeHandler(401)
  } else if (register.password.length < 8){
    return statusCodeHandler(402)
  } else if (register.password !== register.confirm){
    return statusCodeHandler(403)
  } else if (existingUserData.usernames.includes(register.username) ){
    return statusCodeHandler(501)
  } else if (existingUserData.emails.includes(register.email) ){
    return statusCodeHandler(502)
  }
  try {
    const { confirm, ...userData } = register;
   await axios.post("http://localhost:3070/create-user",
    userData)
    statusCodeHandler(201)
  } catch (err) {
    console.log(err)
  }
  }
  ///Check Password Is Valid
  const passwordChecker = () => {
    const password  = document.querySelector('input[name=password]')
    const confirm = document.querySelector('input[name=confirm]')
    if (password.value  === confirm.value ){
      confirm.setCustomValidity('')
    } else {
      confirm.setCustomValidity('Passwords do not match')
    }
  }

  const statusCodeHandler = (statusCode) => {
    switch (statusCode) {
      case 501:
        setStatusCode("Username Already Exists")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break
      case 502:
        setStatusCode("Email is Alreading in use")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break
      case 401:
        setStatusCode("Username must be between 6 and 15 characters long")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break
      case 402:
        setStatusCode("Password must contain at least 8 characters")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break;
      case 403:
        setStatusCode("Passwords Do Not Match")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break;
      case 201:
        setStatusCode("You have successfully registered!")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
      
        break;
      case 101:
        setStatusCode("Only Alphabetical Characters Aloud")
        setTimeout(()=> {
          setStatusCode(null)
        }, 3000)
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
    <div className="form-group">
      <label >Username</label>
      <input required type="text" name="username" value={register.username} onChange={inputHandler}/>
    </div>
    <div className="form-group">
      <label >Name</label>
      <input required type="text" name="name" value={register.name} onChange={inputHandler}/>
    </div>
    <div className="form-group">
      <label >Email</label>
      <input required type="email" name="email" value={register.email} onChange={inputHandler}/>
    </div>
    <div className="form-group">
      <label >Password</label>
      <input required type="password" name="password" value={register.password} onChange={inputHandler}/>
    </div>
    <div className="form-group">
      <label >Re-Type Password</label>
      <input required type="password" name="confirm" value={register.confirm}onChange={inputHandler}/>
    </div>
    {
      statusCode && 
      <div className="status-code-message">
        {statusCode}
      </div>
    }
    <button type="submit">Submit</button>
  </form>
    </div>
  )
}

export default Home