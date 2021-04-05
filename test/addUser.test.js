// bring in chai library
const { expect } = require('chai');

// bring in mock library
const httpMocks = require('node-mocks-http');

// bring in super user file to test
const user = require('../pages/api/user/add_user');

// mock empty file that the createSuperUser module imports
jest.mock("../navigate-recovery-platfom-firebase-adminsdk-r5iv4-ea3204fe8f.json", () => ({ 
    settings: 'this is a test'
}), {virtual: true});

// mock firebase admin and stub the necessary functions that the createSuperUser module calls
jest.mock("firebase-admin", () => {
    return {
        apps: 1,
        auth: function() {
            return {
                createUser: function() {
                    return Promise.resolve({ uid: 'fake_user_id', this: 'is_as_test' });
                },
                setCustomUserClaims: async function(uid, customClaims) {
                    return null;
                },
                getUserByEmail: function(email) {
                    return { uid: 'fake_user_id', this: 'is_as_test' }
                },
                verifyIdToken: function(token) {
                    return Promise.resolve({admin: true})
                }
            }
        },
    };
});

// create the mock request and and response for the test
const req = httpMocks.createRequest({
    body: {
        email:'user_test.gmail.com',
        password: 'test1',
        displayName: 'user test account',
    }
});

const res = httpMocks.createResponse();

// set test conditions
beforeEach(() => {
    // call the create super user with the mocked params
    user.createUser(req,res);
});

afterEach(() => {

});

describe('api/user', () => {
    describe('add user', () => {
        it('should create new user', () => {
            // expect the response to have uid which means the user was created in firebase
            expect(res._getData()).to.have.property("uid")
        });
    });
});
