
<template>
  <v-app class="grey lighten-4">
    <Navbar/>

    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import db from './fb'
  // eslint-disable-next-line no-unused-vars
  import firebase from 'firebase'
  import Navbar from './components/Navbar'

  export default {
    components: { Navbar },
    name: 'App',
    data () {
      return {
        user:null,
      }
    },
    mounted() {
      let current_user = firebase.auth().currentUser;
      if(current_user){
        db.collection('users').doc(current_user.uid).get()
              .then(user=>{
                if (user.exists) {
                  // eslint-disable-next-line no-console
                  this.user = user.data()
                }
                else{
                  // eslint-disable-next-line no-console
                  console.log("User not found, contact admin");
                  if(this.$route.path != '/login'){this.$router.push({name:'login'})}
                }
              })
              .catch(err=>{
                // eslint-disable-next-line no-console
                console.log(err.message)
              })
    }
     else{
        // eslint-disable-next-line no-console
        // console.log("User not logged in");
        if(this.$route.path != '/login'){this.$router.push({name:'login'})}
      }
    }
  }
</script>

<style>
  .v-application--wrap{
     background: #f5f5f5;
  }
</style>