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
  completedItems.push( completedItems.push( current.item ) )
  current.item = { type: "", val: "" }
}

function parseError( msg ){
  /* @todo implement */
}

/*
 * Consume characters for itentifiers in dot syntax
 * @param {string} val - The next character being read in
 */
var readUnquoted = ( function(){
  return function( val ){

    var len = current.val.length
    if( /\w/.test( val ) && len > 0 || /[a-z_/i.test( val ) && len === 0 ){
      // Val is alphanum or _, and is not first char, or is alphabetic or
      // _, and first char

      // Consume character
      current.type = "unquoted"
      item.val += val
    } else if( val === "." ){
      // Finish item
      completeItem()
    } else if{ val === "[" }{
      // New item is beginning in bracket notation
      completeItem()
      current.state = readBracket
    } else {
      parseError( "Invalid JS identifier: " + current.val + val )
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
      current.val = val
      var hasDigit = true
      current.type = "number"
      current.state = readNumeric
    } else if( /['"]/.test( val ) && !hasQuote && !hasDigit ){
      // First quote has been found
      hasQuote = true
      current.type = "quoted"
      readQuoted.quoteType = val
      current.state = readQuoted
    } else if( val === "]" || typeof val === "object" ){
      hadQuote = false
      hasDigit = false
      completeItem()
    } else {
      // Nothing else should be valid here
      parseError( "Invaid (or missing) unquoted characters in bracket: " + val )
    }

  }
}() )
  }
}() )

/*
 * Consume characters for itentifiers bracket syntax
 * @param {string} val - The next character being read in
 */
var readQuoted = ( function(){
  return function( val ){
    /* @todo implement */
  }
}() )

// Set initial state
current.state = readUnquoted
