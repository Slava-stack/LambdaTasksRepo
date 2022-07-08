const {getPriceAndHours} = require('../app.js');

describe('Should return expected amount of hours and price', () => {
    test('Price checking for ru with .doc with 1333 chars', () => {
        expect(getPriceAndHours('ru', 'docx', 1333))
            .toEqual({timeInHours: 1, price: '50.00'});
    });
    test('Price checking for ua with inappropriate extension with 1333 chars', () => {
        expect(getPriceAndHours('ua', 'fs', 1333))
            .toEqual({timeInHours: 1, price: '60.00'});
    });
    test('Price checking for en with inappropriate extension with 1333 chars', () => {
        expect(getPriceAndHours('en', 'pdf', 1333))
            .toEqual({timeInHours: 5, price: '288.00'});
    });
    test('Price checking for en with extension with 1333 chars', () => {
        expect(getPriceAndHours('en', 'rtf', 1333))
            .toEqual({timeInHours: 5, price: '240.00'});
    });
    test('Price checking for en with .doc with 333 chars', () => {
        expect(getPriceAndHours('en', 'doc', 333))
            .toEqual({timeInHours: 1, price: '120.00'});
    });
    test('Price checking for en without extension with 334 chars', () => {
        expect(getPriceAndHours('en', 'none', 334))
            .toEqual({timeInHours: 2, price: '120.12'});
    });
    test('Price checking for en without extension with 333 chars', () => {
        expect(getPriceAndHours('en', 'none', 333))
            .toEqual({timeInHours: 1, price: '120.00'});
    });
    test('Price checking for ua with inappropriate extension with 2667 chars', () => {
        expect(getPriceAndHours('ua', 'pdf', 2667))
            .toEqual({timeInHours: 3, price: '140.04'});
    });
    test('Price checking for ua without extension with 2666 chars', () => {
        expect(getPriceAndHours('ua', 'none', 2666))
            .toEqual({timeInHours: 2, price: '116.65'});
    });
    test('Price checking for ru with extension with 2666 chars', () => {
        expect(getPriceAndHours('ru', 'doc', 2666))
            .toEqual({timeInHours: 2, price: '116.65'});
    });
});