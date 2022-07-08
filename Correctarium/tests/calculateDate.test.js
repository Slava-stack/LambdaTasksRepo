const {calculateDate} = require('../app.js');


describe('Should return expected deadlines (weekdays (from 1 to 5)* and time)', () => {
    // * - from 1 to 5 means weekdays from Monday to Friday
    // 6 and 0 are Saturday and Sunday
    for(let i=1; i<169; i++) {
        test(`Checking for receiving not working days with ${i} hour(s)`, () => {
            expect(calculateDate(i)).not.toMatch(/^0,|6,/);
        });
        test(`Checking for working days with ${i} hour(s)`, () => {
            expect(calculateDate(i)).toMatch(/^[1-5],/);
        });
        test(`Checking for receiving not working hours with ${i} hour(s)`, () => {
            expect(calculateDate(i)).not.toMatch(/((0\d)|(2[0-3])):\d\d$/);
        });
        test(`Checking for receiving not working 19:01-19:XX with ${i} hour(s)`, () => {
            expect(calculateDate(i)).not.toMatch(/19:[1-5]\d$/);
        });
        test(`Checking for appropriate values with ${i} hour(s)`, () => {
            expect(calculateDate(i)).toMatch(/1\d:\d\d$/);
        });
    }
    // struggling to write test for checking the appropriate time.
});