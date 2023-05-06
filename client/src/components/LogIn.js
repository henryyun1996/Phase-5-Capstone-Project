import React from 'react';
import { Segment, Grid, Form, Button, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentlyLoggedInState, showPasswordState } from '../atoms/index';

const Login = () => {
  const [, setLoggedInUser] = useRecoilState(currentlyLoggedInState);
  const history = useHistory();

  const formSchema = yup.object({
    username: yup.string().required('Field required'),
    password: yup.string().required('Field required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((user) => {
              setLoggedInUser(user);
              history.push('/home');
            });
          } else {
            alert("Username and Password don't match! Please try again.");
          }
        })
        .catch((error) => {
          console.error('Error during fetch:', error);
        });
    },
  });

  const [showPassword, setShowPassword] = useRecoilState(showPasswordState);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form">
              <h1 id="login">Welcome to Noes Goes</h1>
      <Segment secondary>
      <Grid columns={2} divided style={{ display: 'flex', alignItems: 'center', backgroundColor: '#88796E' }}>
        <Grid.Column width={8}>
          <div className="ui inverted segment" style={{ backgroundColor: '#7D886E' }}>
            <div className="two fields">
              <div style={{ width: '100%' }}>
                <Form onSubmit={formik.handleSubmit}>
                  <br />
                  <Form.Field>
                    <div className="field">
                      <label style={{ color: 'white' }}>Username:</label>
                      <Form.Input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                      <p style={{ color: '#FF0000' }}> {formik.errors.username}</p>
                    </div>
                  </Form.Field>
                  <br />
                  <Form.Field>
                    <div className="field">
                      <label style={{ color: 'white' }}>Password:</label>
                      <Form.Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        icon={
                          <Icon
                            name={showPassword ? 'eye slash' : 'eye'}
                            link
                            onClick={handleTogglePasswordVisibility}
                          />
                        }
                      />
                      <p style={{ color: '#FF0000' }}> {formik.errors.password}</p>
                    </div>
                  </Form.Field>
                  <br />
                  <Button className="ui button" type="submit">
                    Log In
                  </Button>
                  <br />
                </Form>
              </div>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <iframe src="https://giphy.com/embed/XbJYBCi69nyVOffLIU" width="480" height="480" className="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/Wegow-lofi-wegow-XbJYBCi69nyVOffLIU">via GIPHY</a></p>
        </Grid.Column>
      </Grid>
      </Segment>
      <h4 style={{ textAlign: 'center' }}>
        No account? Sign up <a href="/signup">here.</a>
      </h4>
    </div>
  );
};

export default Login;

