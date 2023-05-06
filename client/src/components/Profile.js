import React from 'react';
import { Segment, Grid, Form, Button } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';

function Profile({ currentlyLoggedIn, setCurrentlyLoggedIn }) {
    const history = useHistory();
    // console.log(currentlyLoggedIn)

    const initialValues = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    };

    const onSubmit = (values) => {
        fetch(`/users/${currentlyLoggedIn.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                _password_hash: values.password,
                first_name: values.firstName,
                last_name: values.lastName,
                phone_number: values.phoneNumber,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok');
            })
            .then ((data) => {
                setCurrentlyLoggedIn(data);
                history.push('/home');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = () => {
        fetch(`/users/${currentlyLoggedIn.id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response not ok');
            })
            .then(() => {
                window.alert('User deleted successfully! Sad to see you go!');
                setCurrentlyLoggedIn(undefined);
                history.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
    });

    return (
        <div id="edit profile">
            <Segment secondary>
                <Grid>
                    <Grid.Column verticalAlign='middle'>
                        <Form onSubmit={formik.handleSubmit}>
                            <h1>Edit Profile Information</h1>
                            <Form.Field>
                                <label>New Username:</label>
                            <Form.Input
                                name="username"
                                type="text"
                                placeholder="New Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                            />
                                {formik.touched.username && formik.errors.username ? (
                                    <p style={{ color: '#ff0000' }}>{formik.errors.username}</p>
                                    ) : null}
                            </Form.Field>
                            <br />
                            <Form.Field>
                                <label>New Password:</label>
                            <Form.Input
                                name="password"
                                type="password"
                                placeholder="New Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                                {formik.touched.password && formik.errors.password ? (
                                    <p style={{ color: '#ff0000' }}>{formik.errors.password}</p>
                                ) : null}
                            </Form.Field>
                            <br />
                            <Form.Field>
                                <label>Update First Name:</label>
                            <Form.Input
                                name="firstName"
                                type="text"
                                placeholder="Update First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            />
                                {formik.touched.firstName && formik.errors.firstName ? (
                                    <p style={{ color: '#ff0000' }}>{formik.errors.firstName}</p>
                                ) : null}
                            </Form.Field>
                            <br />
                            <Form.Field>
                                <label>Update Last Name:</label>
                            <Form.Input
                                name="lastName"
                                type="text"
                                placeholder="Update Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            />
                                {formik.touched.lastName && formik.errors.lastName ? (
                                    <p style={{ color: '#ff0000' }}>{formik.errors.lastName}</p>
                                ) : null}
                            </Form.Field>
                            <br />
                            <Form.Field>
                                <label>Update Phone Number:</label>
                            <Form.Input
                                name="phoneNumber"
                                type="text"
                                placeholder="Update Phone Number"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                            />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                    <p style={{ color: '#ff0000' }}>{formik.errors.phoneNumber}</p>
                                ) : null}
                            </Form.Field>
                            <br />
                            <Button className="ui button" type="submit">
                                Update Profile
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Segment>
            <div style={{ textAlign: "right" }}>
                <Button className="ui button" onClick={handleDelete}>
                    Delete Your Profile
                </Button>
            </div>
        </div>
    )
}

export default Profile;