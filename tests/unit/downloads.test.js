const { describe, test, expect } = require('@jest/globals');
const {is_search_query_in_file} = require("../../static/js/downloads_utils");

describe('test is_search_query_in_file', () => {
    test('test search query is empty', () => {
        expect(is_search_query_in_file({}, "")).toBe(true);
    })
    test('test search query is not empty and match', () => {
        expect(is_search_query_in_file({name: 'PyRun'}, "PyRun")).toBe(true);
    })
    test('test search query is not empty and no match', () => {
        expect(is_search_query_in_file({name: 'PyRun'}, "PyRun2")).toBe(false);
    })
});
describe('test sort_data', () => {
    test('test sort data search query with matching case', () => {

    })
    test('test sort data search query with non-matching case', () => {

    })
    test('test sort data by version', () => {

    })
});

