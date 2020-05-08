<template>
    <div class="team">
        <h1 class="subtitle-1 grey--text">Team</h1>
        <v-container fluid class="my-5">
            <v-layout row class="mb-10">
                <v-flex xs12 sm6 md4 lg3 v-for="person in this.team" :key="person.name">
                    <v-card class="text-xs-center ma-3">
                        <v-card-title class="pt-4 justify-center">
                            <v-avatar size="100" class="grey lighten-2">
                                <img :src="person.avatar[0].ref" alt="suck pants">
                            </v-avatar>
                        </v-card-title>
                        <v-card-title class="justify-center mb-2 pb-1">
                            <div class="v-subheader">{{person.user_name}}</div>
                        </v-card-title>
                        <v-card-title class="justify-center py-1">
                            <div class="v-subheader grey--text">{{person.role}}</div>
                        </v-card-title>
                        <v-card-actions class="justify-center">
<!--                            <v-btn text color="grey">-->
<!--                                <v-icon small left>message</v-icon>-->
<!--                                <span>Message</span>-->
<!--                            </v-btn>-->
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
            <v-spacer/>
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-btn disabled v-if="!noteam" small text color="grey" v-on="on" @click="leaveTeam()" class="my-3">
                        <v-icon left small>mdi-exit-run</v-icon>
                        <span class="caption text-lowercase">Leave team</span>
                    </v-btn>
                </template>
                <span>Exit your current team: please notify project manager prior doing so</span>
            </v-tooltip>
            <p v-if="noteam" class="subtitle-1 grey--text">User not in team</p>
            </v-layout>
        </v-container>
    </div>

</template>

<script>
    import db from '../fb';
    import firebase from 'firebase';

    export default {
        name: "Team",
        data: function () {
            return{
                teamId:null,
                teamref:null,
                team:[],
                noteam:null,
                // team: [
                //     { user_name: 'Goku', role: 'Personal trainer', avatar: 'https://media3.giphy.com/media/zDAqUralC0HU4/giphy.gif' },
                //     { user_name: 'Zenitsu Agatsuma', role: 'Paid actor', avatar: 'https://steamuserimages-a.akamaihd.net/ugc/788608432740368182/5AECEFD2A33E3187F8A91FAC7646B2D510753001/' },
                //     { user_name: 'Itachi Uchiha', role: 'Web developer', avatar: 'https://media2.giphy.com/media/JZ3sDHgd48Dao/giphy.gif' },
                //     { user_name: 'Monkey D. Luffy', role: 'Explorer', avatar: 'https://i.pinimg.com/originals/69/d6/1c/69d61cdda58eb1176db7862cd104e1ee.gif'}
                // ],
                user: null,
            }
        },
        computed:{
            // // eslint-disable-next-line vue/return-in-computed-property
            // teamLive(){
            //     if(this.team){
            //         return this.team
            //     }
            // }
        },
        methods:{
            showTeam(teamref){
                teamref.members.forEach((memberid)=>{
                    this.fetchMember(memberid)
                });
            },
            fetchMember(memberid){
                db.collection('users').doc(memberid).get()
                    .then(user=>{
                        if (user.exists){
                        this.team.push(user.data())
                        // eslint-disable-next-line no-console
                        }else{console.log("following team member not found in db: " + memberid)}
                    })
                    // eslint-disable-next-line no-console
                    .catch(err=>console.log(err.message))
            },
            getTeamRef(){
                //GET TEAM
                if(this.user.team){
                db.collection('teams').doc(this.user.team).get()
                    .then(teamref=>{
                        if(teamref.exists){
                            // eslint-disable-next-line no-console
                            // console.log("TEAM EXISTS ", teamref);
                            this.teamref = teamref.data();
                            this.teamId= teamref.id;
                            this.showTeam(teamref.data());
                        }
                        else {
                            // eslint-disable-next-line no-console
                            console.log("error retrieving team, please contact admin (user has team assigned locally but doesn't actually have one)");
                            this.$router.push({name:'login'})
                        }
                    })
                }//if user has a team
                else{
                    // eslint-disable-next-line no-console
                    // console.log("USER DOESN'T HAVE TEAM");
                    this.team= [this.user];
                    this.noteam=true;

                }
            },
            leaveTeam(){
                //GET TEAM
                db.collection('teams').doc(this.teamId).update({
                    members: this.teamref.members.filter(member => member !== this.user.uid)
                }).then(()=>{
                    //remove team from current user
                    db.collection('users').doc(this.user.uid).update({
                        team: firebase.firestore.FieldValue.delete()
                    })
                })
                .catch(function(error) {
                    // eslint-disable-next-line no-console
                    console.error("Error removing document: ", error);
                });
            }
        },
        created() {
            //START LISTENING TO USER AUTH CHANGES
            firebase.auth().onAuthStateChanged((current_user) => {
                if (current_user) {
                    db.collection('users').doc(current_user.uid).get()
                        .then(user => {
                            if (user.exists) {
                                this.user = user.data();
                                this.user.uid = current_user.uid;

                                //call method to get current user's team reference from db
                                this.getTeamRef()
                            } else {
                                // eslint-disable-next-line no-console
                                console.log("User not found, contact admin");
                                this.$router.push({name: 'login'})
                            }
                        })
                        .catch(err => {
                            // eslint-disable-next-line no-console
                            console.log(err.message, "CAUGHT CREATED ERROR")
                        })
                }
            });
        }
    }
</script>

<style scoped>
    .v-subheader{
        height: 0.5em;
    }
</style>