// Default imports test
import greet from './demo';

describe("demo hello", function () {

    it("Just a demo test", function () {
        expect(greet()).toBe('Hello');
    });

});
