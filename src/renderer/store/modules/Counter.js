const state = {
  nombre: "leo",
  toggledrawer: true,
  firebaseConfig: {
    apiKey: "AIzaSyBx9HYfNoMzkclTydv60oqKHywN4G7vNfo",
    authDomain: "remodesktop-9b704.firebaseapp.com",
    databaseURL: "https://remodesktop-9b704.firebaseio.com",
    projectId: "remodesktop-9b704",
    storageBucket: "",
    messagingSenderId: "450738698352",
    appId: "1:450738698352:web:1bcc2c00ab77337171dcb5",
    measurementId: "G-2Q69C2TFFR"
  }
}

const mutations = {
  ocultaDrawer (state) {
    state.toggledrawer = false
  },
  muestraDrawer (state) {
    state.toggledrawer = true
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  namespace:true,
  state,
  mutations,
  actions
}
