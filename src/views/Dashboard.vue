<template>
    <div class="dashboard">
        <h1 class="subtitle-1 grey--text">Team Projects</h1>
        <v-container class="my-5">
            <v-layout row class="mb-3">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn small text color="grey" @click="sortBy('title')" v-on="on">
                            <v-icon left small>folder</v-icon>
                            <span class="caption text-lowercase">by project name</span>
                        </v-btn>
                    </template>
                    <span>Sorts projects by name</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{on}">
                <v-btn small text color="grey" @click="sortBy('person')" v-on="on">
                    <v-icon left small>person</v-icon>
                    <span class="caption text-lowercase">by person</span>
                </v-btn>
                    </template>
                    <span>Sort projects by person name</span>
                </v-tooltip>
            </v-layout>
            <p v-if="noteam" class="my-8 subtitle-1 grey--text">Please join a team to view team projects</p>
            <div v-if="teamProjects.length==0" style="display: inline">
                <p class="my-8 subtitle-1 grey--text">No team projects to show</p>
                <Popup v-if="user" @projectAdded="snackbar=true"/>
            </div>
            <v-card flat class="pa3" v-for="project in teamProjects" :key="project.title">
                <v-layout row :class="`pa-3 project ${filterStatus(project)}`">
                    <v-flex xs12 md6>
                        <div class="caption grey--text">Project title</div>
                        <div>{{project.title}}</div>
                    </v-flex>
                    <v-flex xs6 sm4 md2>
                        <div class="caption grey--text">Person</div>
                        <div>{{project.person}}</div>
                    </v-flex>
                    <v-flex xs6 sm4 md2>
                        <div class="caption grey--text">Due by</div>
                        <div>{{project.dueby}}</div>
                    </v-flex>
                    <v-flex xs4 sm4 md2>
                        <div class="text-right pr-6">
                            <v-chip small :class="`${filterStatus(project)} white--text caption my-2`">{{filterStatus(project)}}</v-chip>
                        </div>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
            </v-card>
        </v-container>
    </div>
</template>

<script>
// @ is an alias to /src
import db from '../fb';
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase';
import Popup from "../components/Popup";

export default {
  name: 'home',
  data: function () {
      return{
          user: null,
          team:null,
          projects: [],
          noteam:null,
      }
  },
  components: {
      Popup

  },
  methods:{
      sortBy(by){
        this.projects.sort((a,b) => a[by] < b[by] ? -1 : 1)
      },
      // eslint-disable-next-line no-unused-vars
      showTeam(teamref){
          // eslint-disable-next-line no-console
          // console.log(this.team.members);
      },
      getTeamRef(){
          //GET TEAM
          if(this.user.team){
          db.collection('teams').doc(this.user.team).get()
              .then(teamref=>{
                  if(teamref.exists){
                      this.team = teamref.data();
                      this.showTeam(teamref.data());
                  }
                  else{
                          // eslint-disable-next-line no-console
                          // console.log("NO PROJECTS TO SHOW BECAUSE USER IS NOT IN A TEAM");
                          this.noteam= true;
                      }
              }).catch(err=>{
              // eslint-disable-next-line no-console
              console.log(err.message)
          })
          }
          else{
              // eslint-disable-next-line no-console
              // console.log("NO PROJECTS TO SHOW BECAUSE USER IS NOT IN A TEAM");
              this.noteam= true;
          }
          },
      formatDate (date) {
          if (!date) return null;
          const [day, month, year] = date.split('/');
          return `${month}/${day}/${year}`
      },
      filterStatus(project){
          // eslint-disable-next-line no-console
          // console.log(project.dueby)
          // project.dueby=new Date(project.dueby);
          if(project.status==='complete'){
              return 'complete'
          }
          else if(Date.parse(this.formatDate(project.dueby))>Date.now()){
              return 'ongoing'
          }
          else{
              return 'overdue'
          }
      },
  },

    computed: {
        teamProjects(){
            return this.projects.filter(project=>{
                if(this.team && this.team.members){
                    return this.team.members.includes(project.person_id)
                }
                // eslint-disable-next-line no-console
            })
        },
    },

    created() {
        //GET CURRENT USER
        //START LISTENING TO USER AUTH CHANGES
        firebase.auth().onAuthStateChanged((current_user)=>{
            if(current_user) {
                db.collection('users').doc(current_user.uid).get()
                    .then(user => {
                        if (user.exists) {
                            this.user = user.data();
                            this.getTeamRef(user.data());

                        } else {
                            // eslint-disable-next-line no-console
                            console.log("User not found in Dashboard, contact admin");
                            this.$router.push({name: 'login'})
                        }
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.log(err.message)
                    })
            }
        });


      //LISTEN FOR FIREBASE UPDATES
      db.collection('projects').onSnapshot(res=>{
          const changes = res.docChanges();
          changes.forEach(change=>{
              if(change.type==="added"){
                  this.projects.push({
                      ...change.doc.data(),
                      id: change.doc.id
                  })
              }
          })
      })
    }
}
</script>

<style scoped>
    .project.complete{
        border-left: 4px solid #3cd1c2;
    }
    .project.ongoing{
        border-left: 4px solid orange;
    }
    .project.overdue{
        border-left: 4px solid tomato;
    }
    .v-chip.complete{
        background: #3cd1c2 !important;
    }
    .v-chip.ongoing{
        background: orange !important;
    }
    .v-chip.overdue{
        background: tomato !important;
    }

</style>

