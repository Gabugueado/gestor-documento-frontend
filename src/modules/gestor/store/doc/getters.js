
// export const myGetter = ( state ) => {
//  return state
// }

export const getDocsByTerm = ( state ) => ( term = '' ) => {


    if ( term.length === 0 ) return state.docs
    
    return state.docs.filter( doc => doc.content.toLowerCase().includes( term.toLocaleLowerCase() ) )
    
}

// id
export const getDocById = ( state ) => ( id = '' ) => {
    
    const doc = state.docs.find( doc => doc.id == id )

    if ( !doc ) return

    return { ...doc } // TODO: prueben
    
}



