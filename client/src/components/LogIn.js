import React from 'react'
import { Segment, Grid, Form, Button } from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { currentlyLoggedInState } from "../atoms/index";

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(currentlyLoggedInState);
  const history = useHistory();

  const formSchema = yup.object({
    username: yup.string().required('Field required'),
    password: yup.string().required('Field required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(res => {
          if (res.ok) {
            res.json().then(user => {
              console.log(user)
              setLoggedInUser(user);
              history.push('/home');
            });
          } else {
            alert('Username and Password don\'t match! Please try again.');
          }
        })
        .catch(error => {
          console.error('Error during fetch:', error);
        });
    }
  });


  return (
    <div className="form">
      <Segment secondary>
        <Grid >
          <Grid.Column verticalAlign='middle' >
            <Form onSubmit={formik.handleSubmit}>
              <h1 id="login">Welcome to Noes Goes</h1>
              <br />
              <Form.Field >
                <label>Username:</label>
                <Form.Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}> {formik.errors.username}</p>
              </Form.Field>
              <br />
              <Form.Field>
                <label>Password:</label>
                <Form.Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <p style={{ color: "#FF0000" }}> {formik.errors.password}</p>
              </Form.Field>
              <br />
              <Button
                className='ui button'
                type='submit'>Log In</Button>
              <br />
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
      <h4 style={{ textAlign: 'center' }}>No account? Sign up <a href="/signup">here.</a></h4>
    </div>
  )
}

export default Login;
