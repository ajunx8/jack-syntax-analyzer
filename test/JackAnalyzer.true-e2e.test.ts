/*
task: create test to verify cli usage is correct. i.e node JackAnalyzer.js <file|folder>
create test with vitest test syntax
invoke the JackAnalyzer.js file with node
should I invoke the one in dist/ after I build it?
expectations:
    1. expects 1 argument to node
    2. should be a valid file or directory
*/

import { expect, test } from 'vitest'
import { execSync } from 'node:child_process'

test('runs the file dist/JackAnalyzer.js with an argument', () => {
    const stdout = execSync('node dist/JackAnalyzer.js test/project10-jack-test-files/ArrayTest')
    expect(stdout.toString()).toEqual("Successfully created xml file\n")
})