import { test, expect } from "vitest";
import { Main } from "../src/Main.js";
import * as fs from "node:fs/promises"

// End-to-end testing of the business logic
test('it successfully handles a valid file', async () => {
    const inputFile = 'test/project10-jack-test-files/test-file-Main.jack'
    const main = new Main(inputFile)
    await main.handleInput()

    const expectedJackFiles = [
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/jack-syntax-analyzer/test/project10-jack-test-files/test-file-Main.jack"
    ]

    expect(main.jackFiles).toEqual(expectedJackFiles)
})

test('it successfully handles a valid directory', async () => {
    const inputDir = 'test/project10-jack-test-files/Square'
    const main = new Main(inputDir)
    await main.handleInput()

    const expectedJackFiles = [
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/jack-syntax-analyzer/test/project10-jack-test-files/Square/Main.jack",
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/jack-syntax-analyzer/test/project10-jack-test-files/Square/Square.jack",
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/jack-syntax-analyzer/test/project10-jack-test-files/Square/SquareGame.jack"
    ]
    expect(main.jackFiles).toEqual(expectedJackFiles)
})

test('it successfully creates tokenFile ArrayTest/MainT.xml', async () => {
    const input = 'test/project10-jack-test-files/ArrayTest'
    const main = new Main(input)
    await main.handleInput()
    await main.createTokenFiles()
    
    const tokenFilePath = "test/project10-jack-test-files/ArrayTest/MainT.xml"
    const tokenFileContents = await fs.readFile(tokenFilePath, 'utf8')

    const correctTokenFileContents = await fs.readFile("test/project10-jack-test-files-copy/ArrayTest/MainT.xml", 'utf8')
    expect(tokenFileContents).toBe(correctTokenFileContents)
})