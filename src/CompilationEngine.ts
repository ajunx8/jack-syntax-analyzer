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
    outContent: string;
    indent: number = 0;

    constructor(tokenizer: JackTokenizer) {
        this.tokenizer = tokenizer
        this.outContent = ""
    }

    // print xml tag
    processToken(tokenType: string, token: string | undefined) {
        if (token === undefined) {
            throw new SyntaxError("token undefined")
        }

        const curtokenType = this.tokenizer.tokenType
        const curToken = this.tokenizer.curToken

        if (curtokenType === tokenType) {
            if (curToken === token) {
                let xmlEntity;
                switch (curToken) {
                    case "<": xmlEntity = "&lt;"; break
                    case ">": xmlEntity = "&gt;"; break
                    case "\"": xmlEntity = "&quot;"; break
                    case "&": xmlEntity = "&amp;"; break
                    default: xmlEntity = curToken
                }
                this.outContent += `\r\n${"  ".repeat(this.indent)}<${curtokenType}> ${xmlEntity} </${curtokenType}>`
            } else {
                throw new SyntaxError(`expected token: ${token}, recieved: ${curToken}`)
            }
        } else {
            throw new SyntaxError(`expected TokenType: ${tokenType}, recieved: ${curtokenType}`)
        }

        if (this.tokenizer.hasMoreTokens()) {
            this.tokenizer.advance()
        }
    }
    addNonTerminalStart(nonTerminal: string) {
        this.outContent += `\r\n${"  ".repeat(this.indent)}<${nonTerminal}>`
        this.indent++
    }
    addNonTerminalEnd(nonTerminal: string) {
        this.indent--
        this.outContent += `\r\n${"  ".repeat(this.indent)}</${nonTerminal}>`
    }
    // class: "'class' className '{' classVarDec* subroutineDec* '}'",
    compileClass() {
        if (this.tokenizer.hasMoreTokens()) this.tokenizer.advance();
        this.outContent += "<class>"
        this.indent++

        this.processToken("keyword", "class")
        this.processToken("identifier", this.tokenizer.curToken)
        this.processToken("symbol", "{")
        this.compileClassVarDec()
        this.compileSubroutine()
        this.processToken("symbol", "}")

        this.addNonTerminalEnd("class")
        return
    }
    // classVarDec: "('static' | 'field') type varName (',' varName)* ';'"
    compileClassVarDec() {
        const curToken = this.tokenizer.curToken
        if (curToken === 'static' || curToken === 'field') {
            this.addNonTerminalStart("classVarDec")

            this.processToken("keyword", curToken)
            this.processType()
            this.processToken("identifier", this.tokenizer.curToken)
            this.compileOptionalVarNames()
            this.processToken("symbol", ";")

            this.addNonTerminalEnd("classVarDec")
            this.compileClassVarDec()
        } else {
            return
        }
    }
    // type: "'int' | 'char' | 'boolean' | className"
    processType() {
        switch (this.tokenizer.tokenType) {
            case "identifier": this.processToken("identifier", this.tokenizer.curToken); break
            case "keyword":
                switch (this.tokenizer.curToken) {
                    case "int": this.processToken("keyword", "int"); break
                    case "char": this.processToken("keyword", "char"); break
                    case "boolean": this.processToken("keyword", "boolean"); break
                }
                break
            default: throw new SyntaxError("missing type")
        }
    }
    // (',' varName)*
    compileOptionalVarNames() {
        const curToken = this.tokenizer.curToken
        if (curToken === ',') {
            this.processToken("symbol", ",")
            this.processToken("identifier", this.tokenizer.curToken)
            this.compileOptionalVarNames()
        } else {
            return
        }
    }
    // subroutineDec: "('constructor' | 'function' | 'method') ('void' | type) subroutineName '('parameterList')' subroutineBody"
    compileSubroutine() {
        this.addNonTerminalStart("subroutineDec")

        switch (this.tokenizer.curToken) {
            case "constructor": this.processToken("keyword", "constructor"); break
            case "function": this.processToken("keyword", "function"); break
            case "method": this.processToken("keyword", "method"); break
            default: return
        }
        switch (this.tokenizer.tokenType) {
            case "keyword": this.processToken("keyword", 'void'); break
            case "identifier": this.processType(); break
            default: throw new SyntaxError("missing void or type")
        }
        this.processToken("identifier", this.tokenizer.curToken)
        this.processToken("symbol", "(")
        this.compileParameterList()
        this.processToken("symbol", ")")
        this.compileSubroutineBody()

        this.addNonTerminalEnd("subroutineDec")
        this.compileSubroutine()
    }
    // parameterList: "((type varName) (',' type varName)*)?"
    compileParameterList() {
        const curToken = this.tokenizer.curToken
        this.addNonTerminalStart("parameterList")
        if (this.tokenizer.tokenType === "identifier" || curToken === "int" || curToken === "char" || curToken === "boolean") {
            this.processType()
            this.processToken("identifier", this.tokenizer.curToken)
            this.compileOptionalVarNames()
        }
        this.addNonTerminalEnd("parameterList")
    }
    // subroutineBody: "'{' varDec* statements '}'"
    compileSubroutineBody() {
        this.addNonTerminalStart("subroutineBody")
        this.processToken("symbol", "{")
        while (this.tokenizer.curToken === "var") {
            this.compileVarDec()
        }
        this.compileStatements()
        this.processToken("symbol", "}")
        this.addNonTerminalEnd("subroutineBody")
    }
    // varDec: "'var' type varName (',' varName)* ';'"
    compileVarDec() {
        this.addNonTerminalStart("varDec")

        this.processToken("keyword", "var")
        this.processType()
        this.processToken("identifier", this.tokenizer.curToken)
        this.compileOptionalVarNames()
        this.processToken("symbol", ";")

        this.addNonTerminalEnd("varDec")
    }
    // statements: {
    //     statements: "statement*",
    //     statement: "letStatement | ifStatement | whileStatement | doStatement | returnStatement",
    //     letStatement: "'let' varName ('[' expression ']')? '=' expression ';'",
    //     ifStatement: "'if' '(' expression ')' '{' statements '}' ('else' '{' statements '}')?",
    //     whileStatement: "'while' '(' expression ')' '{' statements '}'",
    // },
    compileStatements() {
        this.addNonTerminalStart("statements")

        while (["let", "if", "while", "do", "return"].includes(this.tokenizer.curToken || "")) {
            switch (this.tokenizer.curToken) {
                case "let": this.compileLet(); break
                case "if": this.compileIf(); break
                case "while": this.compileWhile(); break
                case "do": this.compileDo(); break
                case "return": this.compileReturn(); break
            }
        }

        this.addNonTerminalEnd("statements")
    }
    compileLet() {
        this.addNonTerminalStart("letStatement")

        this.processToken("keyword", "let")
        this.processToken("identifier", this.tokenizer.curToken)
        if (this.tokenizer.curToken === "[") {
            this.processToken("symbol", "[")
            this.compileExpression()
            this.processToken("symbol", "]")
        }
        this.processToken("symbol", "=")
        this.compileExpression()
        this.processToken("symbol", ";")

        this.addNonTerminalEnd("letStatement")
    }
    compileIf() { }
    compileWhile() { }
    compileDo() { }
    compileReturn() { }
    // expression: "term (op term)*"
    compileExpression() {
        this.addNonTerminalStart("expression")

        this.compileTerm()
        let op = ["+", "-", "*", "/", "&", "|", "<", ">", "="].find(op => op === this.tokenizer.curToken)
        while (op) {
            this.processToken("symbol", op)
            this.compileTerm()
            op = ["+", "-", "*", "/", "&", "|", "<", ">", "="].find(op => op === this.tokenizer.curToken)
        }
        
        this.addNonTerminalEnd("expression")
    }

    /*
    Compiles a term. If the current token is an identifier, the routine must distinguish between a variable,
    an array entry, or a subroutine call. A single look-ahead token, which may be one of
    "[", "(", or ".", suffices to distinguish between the possibilities. Any other token is not part of this term and
    should not be advanced over.
    */
    // "integerConstant | stringConstant | keywordConstant | varName | varName'['expression']' | '('expression')' | (unaryOP term) | subroutineCall"
    compileTerm() {
        this.addNonTerminalStart("term")
        this.addNonTerminalEnd("term")
    }

    /*
    Compiles a (possibly empty) comma-separated list of expressions.
    */
    compileExpressionList() { }
}

/* meta-language translation:
    'xxx' : (bold) represent language tokens that appear verbatim (terminals)
    xxx   : (italic) represents names of terminal and nonterminal elements
    ()    : used for grouping
    x | y : Either x or y
    x y   : x is followed by y
    x?    : x appears 0 or 1 times
    x*    : x appears 0 or more times

    The grammar consists of rules
    Each rule consists of a left side and a right side
    Left side specifies the rules name
    Right side describes the rule, a pattern
    The pattern is a left-to-right sequence consisting of terminals, nonterminals and qualifiers
    terminals: tokens,
    nonterminals: names of other rules
    qualifiers: ["|", "*", "?", "(", ")"]

    how can I encode LL(1)
 */