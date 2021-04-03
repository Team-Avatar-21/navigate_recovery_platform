// bring in chai library
const { expect } = require('chai');

// bring in mock library
const { mockRequest, mockResponse} = require('mock-req-res');

// mock firebase admin
jest.mock("firebase-admin", () => {
    return {
        apps: 1,
        auth: jest.fn(createUser => jest.fn(uid)),
    };
});
jest.mock("../navigate-recovery-platfom-firebase-adminsdk-r5iv4-ea3204fe8f.json", () => ({
    settings: 'this is a test'
}), {virtual: true});


// bring in super user file to test
const superuser = require('../pages/api/user/add_superuser');

const req = mockRequest({body: {email:'test.gmail.com', password:'test1', displayName:'test account'}});
const res = mockResponse();

beforeEach(() => {
    superuser.createSuperUser(req, res);
});

afterEach(() => {
   
    // need to delete (test.gmail.com) super user to clean up after testing 
});

describe('api/user', () => {
    describe('add super user', () => {
        it ('should create new user', () => {
            console.info(res.json);
            // expect(res.json);
        });
    });
})