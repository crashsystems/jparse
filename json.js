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
  return function( val ){
    /* @todo implement */
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
