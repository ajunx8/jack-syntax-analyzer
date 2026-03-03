export class JackTokenizer {
    contents: string = "";
    cursor: number = 0;
    curToken: string = '';

    constructor(contents: string) {
        this.contents = contents
    }

    // moves cursor to the end of the comment
    skipIgnoredCharacters(): void {
        // check for largest number of characters first i.e comments
        if (this.contents.slice(this.cursor, this.cursor + 3) === "/**") {
            const endCommentIdx = this.contents.indexOf("*/", this.cursor)
            if (endCommentIdx >= this.cursor) {
                this.cursor += endCommentIdx + 5
            } else {
                throw new Error("syntaxError: end comment characters not found")
            }
            this.skipIgnoredCharacters()
        }

        if (this.contents.slice(this.cursor, this.cursor + 2) === "/*") {
            const endCommentIdx = this.contents.indexOf("*/", this.cursor)
            if (endCommentIdx >= this.cursor) {
                this.cursor += endCommentIdx + 4
            } else {
                throw new Error("syntaxError: end comment characters not found")
            }
            this.skipIgnoredCharacters()
        }

        if (this.contents.slice(this.cursor, this.cursor + 2) === "//") {
            const endLineIdx = this.contents.indexOf("\n", this.cursor)
            if (endLineIdx >= this.cursor) {
                this.cursor += endLineIdx + 4
            } else {
                throw new Error("syntaxError: end-line character not found")
            }
            this.skipIgnoredCharacters()
        }

        if (this.contents[this.cursor] === " ") {
            let isSpace = true
            while (isSpace) {
                this.cursor++
                isSpace = this.contents[this.cursor] === " "
            }
            this.skipIgnoredCharacters()
        }

        return
    }

    hasMoreTokens(): boolean {
        this.skipIgnoredCharacters()
        return this.cursor < this.contents.length
    }

    // gets next token from input, and makes it the current token.
    // should only be called if hasMoreTokens is true
    advance() {
        // lets say we move forward no matter what
        // how?
        // then we can analyze the token.

        // how do we move forward? 
        // 1. ignore all comments and white space
        // 2. go until it matches a keyword or one of the lexical elements?
        // sure

        // lexicalElements: {
        // keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
        // symbol: ['{', '}', '(', ')', '[', ']', '.', ',', ';', '+', '-', '*', '/', '&', '|', '<', '>', '=', '~'],
        // integerConstant: Array.from({ length: 32768 }).map((_, i) => i),
        // stringConstant: "", // '"' A Sequence of characters not including double quote or newline '"'
        // identifier: RegExp("/^[a-zA-Z_].*[a-zA-Z0-9_]/"), // Sequence of letters, digits, and underscore, not starting with a digit
        // },


        // catch the first character,
        // if its a keyword, stop 
        // if its a symbol, stop
        // if its a letter or underscore, keep going until we hit a symbol, double-quote, space, new-line(/n) or comment char(//, /**, /*) then stop
        // if its a double-quote, keep going until another double-quote, then stop
        // if its a number, keep going until we dont see a number then stop

        let curChar = this.contents[this.cursor]
        if (curChar === undefined) {
            throw new Error("curChar is undefined")
        }

        // if its a keyword
        const keywordMatch = jackGrammar.lexicalElements.keyword.find(keyword => {
            return this.contents.startsWith(keyword, this.cursor)
        })
        if (keywordMatch !== undefined) {
            this.curToken = keywordMatch
            this.cursor += keywordMatch.length
            return
        }

        // if its a symbol
        const symbolMatch = jackGrammar.lexicalElements.keyword.find(keyword => this.contents.startsWith(keyword, this.cursor))
        if (symbolMatch !== undefined) {
            this.curToken = curChar
            this.cursor += 1
            return
        }

        // if its an integer constant from cursor position
        const integerMatchRegex = /^[0-9]+/
        const integerMatch = this.contents.slice(this.cursor).match(integerMatchRegex)
        if (integerMatch !== null) {
            this.curToken = integerMatch[0]
            this.cursor += integerMatch[0].length
        }

        // if its an identifier
        if (/^[a-zA-Z_]/.test(curChar)) {
            let word: string = curChar
            let tempCursor = this.cursor + 1
            
            // if its a letter or underscore, keep going until we hit a space, symbol, double-quote or new-line then stop
            while (true) {
                const nextChar = this.contents[tempCursor]
                if (nextChar === undefined) break

                if (/[a-zA-Z0-9_]/.test(nextChar)) {
                    word += nextChar
                    tempCursor++
                } else {
                    break
                }
            }

            this.curToken = word
            this.cursor = tempCursor;
            return
        }
    }

    // returns type of current token; KEYWORD, SYMBOL, IDENTIFIER, INT_CONST, STRING_CONST
    tokenType() {
        // if (this.curToken)
    }

    /*
    Returns the keyword which is the current token, as a constant.
    Should only be called if tokenType is KEYWORD.

    types: CLASS, METHOD, FUNCTION, CONSTRUCTOR, INT, BOOLEAN, CHAR, VOID, VAR, 
    STATIC, FIELD, LET, DO, IF, ELSE, WHILE, RETURN, TRUE, FALSE, NULL, THIS
    */
    keyWord(): Keyword {
    }

    // returns character of the current token. called only if tokenType is SYMBOL
    symbol(): Char { }

    // returns identifier which is the current token. only if tokenType is IDENTIFIER
    identifier(): string {
        return ""
    }

    // returns integer value of the current token. called only if tokenType is INT_CONST
    intVal(): number {
        return 0
    }

    // Returns string value of the current token without the two enclosing double quotes.
    // Should be called only if tokenType is STRING_CONST
    stringVal(): string {
        return ""
    }
}

const jackGrammar = {
    lexicalElements: {
        keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
        symbol: ['{', '}', '(', ')', '[', ']', '.', ',', ';', '+', '-', '*', '/', '&', '|', '<', '>', '=', '~'],
        integerConstant: Array.from({ length: 32768 }).map((_, i) => i),
        stringConstant: "", // '"' A Sequence of characters not including double quote or newline '"'
        identifier: RegExp("/^[a-zA-Z_].*[a-zA-Z0-9_]/"), // Sequence of letters, digits, and underscore, not starting with a digit
    },
    programStructure: {
        class: "'class' className '{' classVarDec* subroutineDec* '}'",
        classVarDec: "('static' | 'field') type varName (',' varName)* ';'",
        type: "'int' | 'char' | 'boolean' | className",
        subroutineDec: "('constructor' | 'function' | 'method') ('void' | type) subroutineName '('parameterList')' subroutineBody",
        parameterList: "((type varName) (',' type varName)*)?",
        subroutineBody: "'{' varDec* statements '}'",
        varDec: "'var' type varName (',' varName)* ';'",
        className: "identifier",
        subroutineName: "identifier",
        varName: "identifier"
    },
    statements: {
        statements: "statement*",
        statement: "letStatement | ifStatement | whileStatement | doStatement | returnStatement",
        letStatement: "'let' varName ('[' expression ']')? '=' expression ';'",
        ifStatement: "'if' '(' expression ')' '{' statements '}' ('else' '{' statements '}')?",
        whileStatement: "'while' '(' expression ')' '{' statements '}'",
    },
    expressions: {
        expression: "term (op term)*",
        term: "integerConstant | stringConstant | keywordConstant | varName | varName'['expression']' | '('expression')' | (unaryOP term) | subroutineCall",
        subroutineCall: "subroutineName '('expressionList')' | (className | varName)'.'subroutineName '('expressionList')'",
        expressionList: "(expression(',' expression)*)?",
        op: "'+' | '-' | '*' | '/' | '&' | '|' | '<' | '>' | '='",
        unaryOp: "'-' | '~'",
        keywordConstant: "'true' | 'false' | 'null' | 'this'"
    }
}
