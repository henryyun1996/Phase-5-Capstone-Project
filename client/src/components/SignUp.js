import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { currentlyLoggedInState } from "../atoms/index";

const Signup = () => {
    const [, setLoggedInUser] = useRecoilState(currentlyLoggedInState);
    const history = useHistory();

    const formSchema = yup.object().shape({
        username: yup.string()
            .min(5, 'Username needs to be at least 5 characters long.')
            .max(25, 'Username can be at most 25 characters long.')
            .required('Required'),
        password: yup.string()
            .min(5, 'Password is too short - should be 5 characters minimum.')
            .matches(/[\d\w]/, 'Password can only contain letters and numbers.')
            .required('No password provided.'), 
        confirmPassword: yup.string()
            .oneOf([yup.ref("password")], "Passwords do not match")
            .required("Password Confirm is required"),
        first_name: yup.string()
            .required('Please provide your first name here'),
        last_name: yup.string()
            .required("Please provide your last name here"),
        phone_number: yup.string()
            .matches(/^\+?[1-9]\d{2}-\d{3}-\d{4}$/, 'Please enter a valid phone number in the format xxx-xxx-xxxx')
            .required("Please provide your phone number here"),
          
        
      })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            phone_number: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("Creating a user...")
            if (formik.isValid) {
                fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok) {
                        res.json().then( new_user => setLoggedInUser(new_user))
                        console.log("User successfully created!")
                        history.push('/')
                    } else {
                        res.json().then( err => {
                            console.log(err)
                            alert('Oops, username is already taken. Please choose another one.')
                        })
                    }
                }).catch(err => {
                    console.error('Error during fetch:', err);
                });
            }
        }
    })

  return (
    <div style={{ padding: '50px', maxWidth: '50%', margin: '0 auto' }}>
        <h1 id="signup">Sign Up</h1>
        <Form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
            <div className="ui inverted segment" style={{ backgroundColor: '#47759E', border: '4px solid black' }}>
                <div className="one field">
            <Form.Field>
                <label style={{ color: 'navy' }}>Username</label>
                <input 
                    type="text"
                    name="username"
                    placeholder='Username' 
                    value={formik.values.username}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.username }</p>

            </Form.Field>
            <Form.Field>
                <label style={{ color: 'navy' }}>Password</label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder='Password' 
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.password }</p>
            </Form.Field>
            <Form.Field>
                <label style={{ color: 'navy' }}>Confirm Password</label>
                <input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder='Confirm password' 
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.confirmPassword }</p>
            </Form.Field>
            <Form.Field>
                <label style={{ color: 'navy' }}>First Name</label>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange} 
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.first_name }</p>
            </Form.Field>
            <Form.Field>
                <label style={{ color: 'navy' }}>Last Name</label>
                <input 
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.last_name }</p>
            </Form.Field>
            <Form.Field>
                <label style={{ color: 'navy' }}>Phone Number</label>
                <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}>{ formik.errors.phone_number }</p>
            </Form.Field>
            <Button
              className='ui button' 
              type='submit'
              style={{ backgroundColor: 'grey', border: '2px solid black' }}
              >Sign Up
            </Button>
                </div>
            </div>
        </Form>
    </div>
  )
}

export default Signup;