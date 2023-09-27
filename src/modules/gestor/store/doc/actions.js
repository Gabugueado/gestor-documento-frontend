import docApi from "@/api/docApi";

// export const myAction = async ({ commit }) => {

// }


export const loadDocs = async ({ commit }) => {

  const access = localStorage.getItem('access')


  const { data } = await docApi.get('/list/', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })

  commit('setDocs', data)
}


export const addDoc = async ( { commit }, doc ) => {
  
  const access = localStorage.getItem('access')
  
  const { content, title, file } = doc
  
  const { data } = await docApi.post('/create/', {content, title, file},  {
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'multipart/form-data'
    }
  })


  commit('addDoc')

  return data.id

}

export const updateDoc = async ({ commit }, doc) => {

  const access = localStorage.getItem('access')
  const { id, content, title, file } = doc
  await docApi.put(`/update/${id}/`, { content, title, file },  {
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  commit('updateDoc', {...doc});

}


export const deleteDoc = async ({ commit }, doc) => {
  const access = localStorage.getItem('access')
  const { id } = doc

  await docApi.delete(`/delete/${id}/`,  {
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  
  commit('deleteDoc', {...doc});

}

export const loadFiles = async ({commit}, id) => {
  
  
  const access = localStorage.getItem('access')
  const { data } = await docApi.get(`/detail/${id}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  commit('loadFiles', data)
  return data
}