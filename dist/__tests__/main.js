"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock @actions/core
const inputs = {};
const mockCore = jest.genMockFromModule('@actions/core');
mockCore.getInput = (name) => {
    return inputs[name];
};
inputs.INPUT_CONFLICT_LABEL_NAME = 'label';
inputs.CONFLICT_LABEL_NAME = 'label';
const spy = jest.spyOn(mockCore, 'getInput');
jest.setMock('@actions/core', mockCore);
const main_1 = require("../lib/main");
describe('Auto label merge conflicts', () => {
    afterAll(() => {
        jest.unmock('@actions/core');
    });
    describe('Parameters', () => {
        test('should require CONFLICT_LABEL_NAME', async () => {
            await main_1.run();
            expect(spy).toHaveBeenCalledWith('CONFLICT_LABEL_NAME', { "required": true });
        });
        test('should require GITHUB_TOKEN', async () => {
            await main_1.run();
            expect(spy).toHaveBeenCalledWith('GITHUB_TOKEN', { "required": true });
        });
    });
});
