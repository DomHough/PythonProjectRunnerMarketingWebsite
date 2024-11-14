const { describe, test, expect } = require('@jest/globals');
const {is_search_query_in_file, capitalized_case, sort_data, compare_version_number} = require("../../static/js/downloads_utils");

describe('test is_search_query_in_file', () => {
    test('search query is empty', () => {
        expect(is_search_query_in_file({}, "")).toBe(true);
    })
    test('matching query', () => {
        expect(is_search_query_in_file({name: 'PyRun'}, "PyRun")).toBe(true);
    })
    test('non matching query ', () => {
        expect(is_search_query_in_file({name: 'PyRun'}, "PyRun2")).toBe(false);
    })
    test('matching query in different case', () => {
        expect(is_search_query_in_file({name: 'PyRun'}, "pyrun")).toBe(true);
    })
});

describe('test capitalized_case', () => {
    test('single word', () => {
        expect(capitalized_case('hello')).toBe('Hello');
    })
    test('multiple words', () => {
        expect(capitalized_case('hello world')).toBe('Hello World');
    })
    test('multiple words with special character', () => {
        expect(capitalized_case('hello world!')).toBe('Hello World!');
    });
    test('word that starts with special character', () => {
        expect(capitalized_case('!hello world')).toBe('!hello World');
    });
});

describe('test sort_data', () => {
    test('no data', () => {
        expect(sort_data([], "", "", "", "", "")).toEqual([]);
    })
    test('data with empty filters, sort by and query', () => {
        const data = [
            {name: 'PyRun-v1.0.0-linux-x64'},
            {name: 'PyRun-v1.0.0-windows-x64'},
            {name: 'PyRun-v1.0.0-macos-x64'},
        ]
        const actual = sort_data(data, "", "", "", "", "");
        expect(actual).toEqual(data);
    })
    test('data with sort by with no direction', () => {
        const data = [
            {version: '1'},
            {version: '2'},
            {version: '3'},
        ]
        const actual = sort_data(data, "", "", "", "version", "");
        expect(actual).toEqual(data);
    })

    test('data with sort by version ascending', () => {
        const data = [
            {name: 'test2', version: '1.0.1'},
            {name: 'test3', version: '1.0.2'},
            {name: 'test1', version: '1.0.0'},
        ]
        const expected = [
            {name: 'test1', version: '1.0.0'},
            {name: 'test2', version: '1.0.1'},
            {name: 'test3', version: '1.0.2'},
        ]
        const actual = sort_data(data, "", "", "", "version", "asc");
        expect(actual).toEqual(data);
    })

    test('data with sort by version descending', () => {
        const data = [
            {name: 'test2', version: '1.0.1'},
            {name: 'test3', version: '1.0.2'},
            {name: 'test1', version: '1.0.0'},
        ]
        const expected = [
            {name: 'test3', version: '1.0.2'},
            {name: 'test2', version: '1.0.1'},
            {name: 'test1', version: '1.0.0'},
        ]
        const actual = sort_data(data, "", "", "", "version", "desc");
        expect(actual).toEqual(expected);
    })

        test('data with sort by version ascending with bigger version numbers', () => {
        const data = [
            {name: 'test2', version: '1.0.2'},
            {name: 'test3', version: '1.0.11'},
            {name: 'test1', version: '1.0.01'},
        ]
        const expected = [
            {name: 'test1', version: '1.0.01'},
            {name: 'test2', version: '1.0.2'},
            {name: 'test3', version: '1.0.11'},
        ]
        const actual = sort_data(data, "", "", "", "version", "asc", "");
        expect(actual).toEqual(expected);
    })

    test('data with same version', () => {
        const data = [
            {name: 'test2', version: '1.0.0'},
            {name: 'test3', version: '1.0.0'},
            {name: 'test1', version: '1.0.0'},
        ]
        const expected = [
            {name: 'test1', version: '1.0.0'},
            {name: 'test2', version: '1.0.0'},
            {name: 'test3', version: '1.0.0'},
        ]
        const actual = sort_data(data, "", "", "", "version", "asc", "");
        expect(actual).toEqual(expected);
    })

    test('data filter by os_filter', () => {
        const data = [
            {name: 'PyRun-v1.0.0-linux-x64', os: 'linux'},
            {name: 'PyRun-v1.0.0-windows-x64', os: 'windows'},
            {name: 'PyRun-v1.0.0-macos-x64', os: 'macos'},
        ]
        const expected = [
            {name: 'PyRun-v1.0.0-windows-x64', os: 'windows'}
        ]
        const actual = sort_data(data, "", "windows", "", "", "", "");
        expect(actual).toEqual(expected);
    })

    test('data filter by arch_filter', () => {
        const data = [
            {name: 'PyRun-v1.0.0-linux-x64', arch: 'x64'},
            {name: 'PyRun-v1.0.0-windows-x64', arch: 'x64'},
            {name: 'PyRun-v1.0.0-macos-arm64', arch: 'arm64'},
        ]
        const expected = [
            {name: 'PyRun-v1.0.0-macos-arm64', arch: 'arm64'},
        ]
        const actual = sort_data(data, "", "", "arm64", "", "", "");
        expect(actual).toEqual(expected);
    })

    test('data filter by query', () => {
        const data = [
            {name: 'PyRun-v1.0.0-linux-x64'},
            {name: 'PyRun-v1.0.0-windows-x64'},
            {name: 'PyRun-v1.0.0-macos-arm64'},
        ]
        const expected = [
            {name: 'PyRun-v1.0.0-macos-arm64'},
        ]
        const actual = sort_data(data, "macos", "", "", "", "", "");
        expect(actual).toEqual(expected);
    })
})

describe('test compare_version_number', () => {
    test('with equal version numbers', () => {
        expect(compare_version_number('1.0.0', '1.0.0')).toBe(0);
    });
    test('with different version numbers, a < b', () => {
        expect(compare_version_number('1.0.0', '1.0.1')).toBe(1);
    });
    test('with different version numbers, a > b', () => {
        expect(compare_version_number('1.0.1', '1.0.0')).toBe(-1);
    });
});