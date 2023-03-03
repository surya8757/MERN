import React,{Fragment,useState} from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import {login} from '../../actions/auth';
import PropTypes from 'prop-types';
const Login = ({login}) => {
  const [formData,setFromData]=useState({
    email:'',
    password:''
  });
  const {email,password}=formData;
  console.log(email);
  console.log(password);
  const onChange=e=>setFromData({...formData,[e.target.name]:e.target.value});
  const onSubmit=async e=>{
    e.preventDefault();
      login(email,password);
    }


  return (
    <Fragment>
         <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into  Your Account</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input type="email"
           placeholder="Email Address"
           value={email}
           onChange={e=>onChange(e)}
           name="email" required/>
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e=>onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}
Login.propTypes={
  login:PropTypes.func.isRequired
}

export default connect(null,{login})(Login);