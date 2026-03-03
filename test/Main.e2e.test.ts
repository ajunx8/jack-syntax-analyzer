import { test, expect } from "vitest";
import { Main } from "../src/Main.js";

// End-to-end testing of the business logic
test('it successfully handles a valid file', async () => {
    const inputFile = 'test/project10-jack-test-files/test-file-Main.jack'
    const main = new Main(inputFile)
    await main.run()
    expect(main.jackFiles).toContain("/Users/adriangreksa/Projects/03-home/nand2tetris-resources/syntax-analyzer/test/project10-jack-test-files/test-file-Main.jack")
})

test('it successfully handles a valid directory', async () => {
    const inputDir = 'test/project10-jack-test-files/Square'
    const main = new Main(inputDir)
    await main.run()

    const expectedJackFiles = [
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/syntax-analyzer/test/project10-jack-test-files/Square/Main.jack",
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/syntax-analyzer/test/project10-jack-test-files/Square/Square.jack",
        "/Users/adriangreksa/Projects/03-home/nand2tetris-resources/syntax-analyzer/test/project10-jack-test-files/Square/SquareGame.jack"
    ]
    expect(main.jackFiles).toEqual(expectedJackFiles)
})