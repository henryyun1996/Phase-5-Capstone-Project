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
    <div className="form" style={{ padding: '50px', maxWidth: '70%', margin: '0 auto' }}>
        <div id="login" style={{ fontFamily: 'Alfa Slab One', fontSize: '54px' }}>
          <img src="https://i.ibb.co/tMJGKSr/Untitled-800-550-px.png" alt="Title-Logo" style={{ margin: '0 auto', alignItems: 'center', maxWidth: '30%' }}/>
        </div>
        <br />
      <Segment secondary>
      <Grid columns={2} divided style={{ display: 'flex', alignItems: 'center', backgroundColor: '#9CA6C9', border: '6px solid #9CA6D9' }}>
        <Grid.Column width={8}>
        <div className="ui inverted segment" style={{ backgroundColor: '#47759E', border: '4px solid black' }}>
            <div className="two fields">
              <div style={{ width: '100%' }}>
                <Form onSubmit={formik.handleSubmit}>
                  <br />
                  <Form.Field>
                    <div className="field">
                      <label style={{ color: 'navy', fontFamily: 'Oswald', fontSize: '18px' }}>Username:</label>
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
                      <label style={{ color: 'navy', fontFamily: 'Oswald', fontSize: '18px' }}>Password:</label>
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
                  <Button className="ui button" type="submit" style={{ backgroundColor: 'grey', border: '2px solid black' }}>
                    Log In
                  </Button>
                  <br />
                </Form>
              </div>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <div style={{position: 'relative', paddingBottom: '100%', height: '0'}}>
            <iframe src="https://giphy.com/embed/XbJYBCi69nyVOffLIU" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} className="giphy-embed" allowFullScreen title="Lo-fi music video from Wegow"></iframe>
          </div>
        </Grid.Column>
      </Grid>
      </Segment>
      <h4 style={{ textAlign: 'center' }}>
        No account? Sign up <a href="/signup" style={{ color: 'orange' }}>here.</a>
      </h4>
    </div>
  );
};

export default Login;

