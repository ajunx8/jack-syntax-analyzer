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

test('it successfully creates tokenFile test-file-MainT.xml', async () => {
    const inputFile = 'test/project10-jack-test-files/test-file-Main.jack'
    const inputFileStat = await fs.stat(inputFile)
    expect(inputFileStat).toBeDefined()

    const main = new Main(inputFile)
    await main.handleInput()
    await main.createTokenFiles()

    console.log(process.cwd())

    const cwdStat = await fs.stat(process.cwd()) 
    expect(cwdStat).toBeDefined()

    const tokenFilePath = inputFile.replace(".jack", "T.xml")
    const tokenFileStat = await fs.stat(tokenFilePath)
    expect(tokenFileStat).toBeDefined()

    const tokenFileContents = await fs.readFile(tokenFilePath, 'utf8')
    expect(tokenFileContents).toContain("<tokens>")
})