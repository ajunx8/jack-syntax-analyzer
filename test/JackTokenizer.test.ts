import { beforeEach, describe, expect, it, vi, test} from "vitest";
import { JackTokenizer } from "../src/JackTokenizer.js";

// start of the simplest happy path. Each subsequent test should be a little harder
it('tokenizes "class"', () => {
    const contents = "class"
    const tokenizer = new JackTokenizer(contents)

    expect(tokenizer.hasMoreTokens()).toBe(true)
    tokenizer.advance()
    expect(tokenizer.curToken).toBe('class')
    expect(tokenizer.hasMoreTokens()).toBe(false)
})

it('tokenizes "class Main"', () => {
    const contents = "class Main"
    const tokenizer = new JackTokenizer(contents)

    let i = 0;
    while (i < 2) {
        expect(tokenizer.hasMoreTokens()).toBe(true)
        tokenizer.advance()
        i++
    }
    
    expect(tokenizer.curToken).toBe('Main')
    expect(tokenizer.hasMoreTokens()).toBe(false)
})

describe('handle ignored characters', () => {
    it.skip('handle single space', () => {
        const contents = " "
        const tokenizer = new JackTokenizer()
    })
})


const fileContents = "class Main() {} // comment to end of line\n/*This is a\nmulti-line\ncomment*/\n/** Comments for API\ndocs*/"