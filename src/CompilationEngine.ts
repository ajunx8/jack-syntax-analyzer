import { type JackTokenizer } from "./JackTokenizer.js";

/*
The following rules in the Jack grammer have no corresponding compilexxx methods:
- type
- className
- subroutineName
- variableName
- statement
- subroutineCall
*/

export class CompilationEngine {
    tokenizer: JackTokenizer;
    outPath: string;

    // creates new compilation engine with given input and output
    // The next routine called (by JackAnalyzer module) must be compileClass
    // Args: input file/stream, output file/stream
    // #TODO: refactor this constructor
    constructor(tokenizer: JackTokenizer, outPath: string) {
        this.tokenizer = tokenizer
        this.outPath = outPath
    }

    // class: "'class' className '{' classVarDec* subroutineDec* '}'",
    compileClass() {
        if (this.tokenizer.hasMoreTokens()) {
            this.tokenizer.advance()

            if (this.tokenizer.tokenType() === 'KEYWORD') {
                const keyword = this.tokenizer.keyWord()
                if (keyword === 'class') {
                    this.addTag(keyword)
                } else {
                    throw new Error(`keyword should be 'class', recieved ${keyword}`)
                }
            } else {
                throw new Error("token should be type: 'KEYWORD'")
            }
        }

        if (this.tokenizer.hasMoreTokens()) {
            this.tokenizer.advance()
            const tokenType = this.tokenizer.tokenType()

            if (tokenType === 'IDENTIFIER') {
                const identifier = this.tokenizer.identifier()
                this.addTag(identifier)
            } else {
                throw new Error(`token should be type: 'IDENTIFIER', recieved ${tokenType}`)
            }
        }

        if (this.tokenizer.hasMoreTokens()) {
            this.tokenizer.advance()

            if (this.tokenizer.tokenType() === 'SYMBOL') {
                const symbol = this.tokenizer.symbol()
                if (symbol === '{') {
                    this.addTag(symbol)
                } else {
                    throw new Error(`symbol should be '{', recieved: ${symbol}`)
                }
            } else {
                throw new Error("token should be type: 'SYMBOL'")
            }
        }

        if (this.tokenizer.hasMoreTokens()) {
            this.tokenizer.advance()
            const tokenType = this.tokenizer.tokenType()

            if (tokenType === 'IDENTIFIER') {
                const identifier = this.tokenizer.identifier()
                this.addTag(identifier)
            } else {
                throw new Error(`token should be type: 'IDENTIFIER', recieved ${tokenType}`)
            }
        }

    }
    compileClassVarDec() { }
    compileSubroutine() { }
    compileParameterList() { }
    compileSubroutineBody() { }
    compileVarDec() { }
    compileStatements() { }

    compileLet() { }
    compileIf() { }
    compileWhile() { }
    compileDo() { }
    compileReturn() { }
    compileExpression() { }

    /*
    Compiles a term. If the current token is an identifier, the routine must distinguish between a variable,
    an array entry, or a subroutine call. A single look-ahead token, which may be one of
    "[", "(", or ".", suffices to distinguish between the possibilities. Any other token is not part of this term and
    should not be advanced over.
    */
    compileTerm() { }

    /*
    Compiles a (possibly empty) comma-separated list of expressions.
    */
    compileExpressionList() { }
}