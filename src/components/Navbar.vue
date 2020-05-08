<template>
    <nav>
        <v-snackbar v-model="snackbar" top color="red" :timeout="4000">
            <span>Project added!</span>
            <v-btn text color="white" @click="snackbar=false">Close</v-btn>
        </v-snackbar>

        <v-app-bar flat app>
            <v-app-bar-nav-icon class="grey--text" @click="drawer=!drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-uppercase grey--text">
                <span class="font-weight-light">to</span>
                <span class="">do</span>
            </v-toolbar-title>
            <v-spacer/>

            <v-menu
                    origin="center center"
                    transition="scale-transition"
                    offset-y
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                            text
                            color="grey"
                            dark
                            v-on="on"
                            class=""
                    >
                        Menu
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                            v-for="(link, i) in links"
                            :key="i"
                            router :to="link.route"
                    >
                        <v-list-item-title>{{ link.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>


            <v-btn v-if="user" text color="grey" @click="signOut()" class="mx-2">
                <span>Sign out</span>
                <v-icon right>exit_to_app</v-icon>
            </v-btn>
            <v-btn text v-if="!user" to="login" class="ml-1">
                <span>Login</span>
                <v-icon right>mdi-account-arrow-right</v-icon>
            </v-btn>
            <v-btn text v-if="!user" to="signup" class="ml-1 mr-2">
                <span>Signup</span>
                <v-icon right>mdi-account-plus</v-icon>
            </v-btn>

        </v-app-bar>
        <v-navigation-drawer color="red" v-model="drawer" app>
            <v-layout column align-center>
                <v-flex class="mt-5">
                    <v-avatar size="100">
                        <img v-if="user" :src="user.avatar[0].ref" alt="">
                    </v-avatar>
                </v-flex>
                <v-flex>
                    <p v-if="user" class="black--text font-weight-bold mt-4 mb-0">{{computed_user}}</p>
                </v-flex>
                <v-flex class="mt-4 mb-3">
                    <Popup v-if="user" @projectAdded="snackbar=true"/>
                </v-flex>

            </v-layout>
            <v-list dense>
                <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-action>
                        <v-icon>{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-navigation-drawer>
    </nav>
</template>

<script>
    import firebase from 'firebase';
    import db from '../fb'

    import Popup from "./Popup";
    // eslint-disable-next-line no-unused-vars
    import router from "../router";

    export default {
        name: "Navbar",
        data: function () {
            return {
                drawer: false,
                links: [
                    {icon: 'folder', text: 'My Projects', route: '/projects'},
                    {icon: 'person', text: 'Team', route: '/team'},
                    {icon: 'dashboard', text: 'Team Projects', route: '/'},
                ],
                snackbar: false,
                editSnackbar: false,
                user: null
            }
        },
        methods: {
            signOut() {
                this.user=!this.user;
                firebase.auth().signOut()
                    .then(() => {
                        this.$router.push({name: 'login'})
                    })
                    .catch(err => {
                        // eslint-disable-next-line no-console
                        console.log(err.message)
                    })
            },
        },
        computed:{
            computed_user(){
                if(firebase.auth().currentUser){
                    return this.user.user_name
                }
                else {
                    return ""
                }
            }
        },
        components:{
            Popup,
        },
        created() {
            //START LISTENING TO USER AUTH CHANGES
            firebase.auth().onAuthStateChanged((current_user)=>{
                if(current_user) {
                    db.collection('users').doc(current_user.uid).get()
                        .then(user => {
                            if (user.exists) {
                                // eslint-disable-next-line no-console
                                this.user = user.data()
                            } else {
                                // eslint-disable-next-line no-console
                                this.$router.push({name: 'login'})
                            }
                        })
                        .catch(err => {
                            // eslint-disable-next-line no-console
                            console.log(err.message)
                        })
                }
            })
        }
    }
</script>

<style scoped>
/*p{*/
/*    color: #9dcde6;*/
/*}*/
</style>