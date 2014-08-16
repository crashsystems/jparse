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
  /* @todo implement */
}

/*
 * Consume characters for itentifiers in dot syntax
 * @param {string} val - The next character being read in
 */
var readUnquoted = ( function(){
  return function( val ){
    /* @todo implement */
  }
}() )

/*
 * Consume characters that are valid before & after quote state
 * @param {string} val - The next character being read in
 */
var bracket = ( function(){
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
