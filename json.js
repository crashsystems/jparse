var syntaxHighlight = require( "pygments" ).colorize

/* === State Management Functions === */

// Hold current state
var current = {
  item: { type: "", val: "" },
  state: function(){}
}

// List of already constructed items
var completedItems = []

/*
 * Complete the current item
 */
function completeItem(){
  completedItems.push( current.item )
  current.item = { type: "", val: "" }
}

/* Print out an error and exit
 * @param {string} msg - Error message to print
 */
function parseError( msg ){
  console.log( msg )
  process.exit( 1 )
}

/*
 * Consume characters for itentifiers in dot syntax
 * @param {string} val - The next character being read in
 */
var readUnquoted = ( function(){
  return function( val ){

    var len = current.item.val.length
    if( /\w/.test( val ) && len > 0 || /[a-z_]/i.test( val ) && len === 0 ){
      // Val is alphanum or _, and is not first char, or is alphabetic or
      // _, and first char

      // Consume character
      current.item.type = "unquoted"
      current.item.val += val
    } else if( val === "." ){
      // Finish item
      completeItem()
    } else if( val === "[" ){
      // New item is beginning in bracket notation
      completeItem()
      current.state = readBracket
    } else {
      parseError( "Invalid JS identifier: " + current.item.val + val )
    }

  }
}() )

/*
 * Consume characters that are valid before & after quote state
 * @param {string} val - The next character being read in
 */
var readBracket = ( function(){
  var hasQuote = false
  var hasDigit = false

  return function( val ){

    if( /\s/.test( val ) ){
      // Ignore white space
    } else if( /\d/.test( val ) && !hasQuote ){
      // Digit encountered, and no quotes found
      current.item.val = val
      hasDigit = true
      current.item.type = "number"
      current.state = readNumeric
    } else if( /['"]/.test( val ) && !hasQuote && !hasDigit ){
      // First quote has been found
      hasQuote = true
      current.item.type = "quoted"
      readQuoted.quoteType = val
      current.state = readQuoted
    } else if( val === "]" || typeof val === "object" ){
      hasQuote = false
      hasDigit = false
      current.state = readUnquoted
      completeItem()
    } else {
      // Nothing else should be valid here
      parseError( "Invaid (or missing) unquoted characters in bracket: " + val )
    }

  }
}() )

/*
 * Consume numeric characters inside brackets
 * @param {string} val - The next character being read in
 */
var readNumeric = ( function(){
  var numEnded = false
  return function( val ){

    if( /\d/.test( val ) && !numEnded ){
      // Read another digit
      current.item.val += val
    } else if( /\s/.test( val ) ){
      // Allow white space after digits
      numEnded = true
    } else if( val === "]" ){
      // End reading of digits
      numEnded = false
      readBracket( { reset: true } )
      current.state = readUnquoted
      completeItem()
    } else {
      parseError( "Invalid array index:" + current.item.val + val )
    }

  }
}() )

/*
 * Consume characters for itentifiers bracket syntax
 * @param {string} val - The next character being read in
 */
var readQuoted = ( function(){
  var lastVal = ""

  return function( val ){

    if( val !== readQuoted.quoteType || readQuoted.quoteType === "\x5c" ){
      // Non-string ending char, or quote/tick escaped by backslash
      current.item.val += val
      lastVal = val
    } else {
      // End of string has been reached
      lastVal = ""
      readQuoted.quoteType = ""
      current.state = readBracket
    }
  }
}() )

// Set initial state
current.state = readUnquoted

/* === JSON parsing code === */

/*
 * Read input from stdin, until it closes
 */
function readInput(){
  var rawInput = ""

  // Read data as it comes in
  process.stdin.on( "data", function( data ){
    rawInput += data.toString()
  } )

  process.stdin.on( "close", function(){
    var selectors = parseSelectors()
    var selection = filterData( selectors, rawInput )
    printOutput( selection )
  } )
}

/*
 * Parse object selectors out of the parameters
 * @returns {array} A list of selectors
 */
function parseSelectors(){
  // Loop through argments, grabbing raw selectos
  var input = ""
  var length = process.argv.length
  for( var i = 2; i < length; i += 1 ){
    input += process.argv[i]
  }

  // Loop through input, constructing selectors
  var inputLength = input.length
  for( var i = 0; i < inputLength; i += 1 ){
    current.state( input[i] )
  }
  completeItem()

  // Filter out null selectors
  var selectors = []
  var completed = completedItems.length
  for( var i = 0; i < completed; i += 1 ){
    if( completedItems[i].val.length > 0 ){
      selectors.push( completedItems[i] )
    }
  }

  return selectors
}

/*
 * Given a list of object selectors, get the referenced child
 * @param {array} selectors - List of object selectors
 * @param {string} data - Input read from stdin
 * @returns {object} - Child object referenced by user
 */
function filterData( selectors, data ){
  var input = {}

  // Parse JSON input
  ;( function(){
    try{
      input = JSON.parse( data, null, 2 )
    } catch( e ) {
      parseError( "Invalid JSON" )
    }
  }() )

  // Grab selected item
  var selection = input
  var done = false
  var selectorCount = selectors.length

  for( var i = 0; i < selectorCount && !done; i += 1 ){
    var selected = selection[ selectors[i].val ]
    if( selected !== undefined ){
      selection = selected
    } else {
      done = true
    }
  }

  return selection
}

/*
 * Pretty print output, with indentation & syntax highlighting
 * @param {object} output - Object to print
 */
function printOutput( output ){
  // Detect what type of data is being printed
  var type = typeof output
  if( type === "object" ){
    if( output.sort ){
      type = "array"
    }
  }

  // Print output with different formats for each type
  if( type === "number" || type === "string" ){
    console.log( output )
  } else if( type === "array" ){
    // print out one item per line
    console.log( output.join( "\n" ) )
  } else if( type === "object" ){
    // Pretty print, with syntax highlighting
    var stringified = JSON.stringify( output, null, 2)
    syntaxHighlight( stringified, "json", "console", function( data ){
      console.log( data )
    } )
  } else {
    // Unrecognized type, so error out
    console.log( "Unrecognized output type" )
  }
}

readInput()
