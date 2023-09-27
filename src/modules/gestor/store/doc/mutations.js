
// export const myMutation = ( state ) => {

// }

export const setDocs = ( state, docs ) => {
    
    state.docs = [ ...state.docs, ...docs ]
        
    state.isLoading = false
}

export const updateDoc = ( state, doc  ) => { 
    
    const indice = state.docs.map( d => d.id ).indexOf( doc.id )
    
    state.docs[indice] = doc
    
}

export const addDoc = (state, doc ) => {
    // state -> docs  -> el nuevo documento es el primero
    state.docs = [ doc, ...state.docs  ]
}


export const deleteDoc = ( state, doc ) => {
    const { id } = doc
    state.docs = state.docs.filter( doc => doc.id !== id )
}

export const clearEntries = ( state ) => {
    state.entries = []
}

export const loadFiles = ( state, docFile ) => {

    state.file = docFile
    state.isLoading = false
    
}