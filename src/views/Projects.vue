<template>
    <div class="projects">

        <v-snackbar v-model="editSnackbar" top color="red" :timeout="4000">
            <span>Changes Saved!</span>
            <v-btn text color="white" @click="editSnackbar=false">Close</v-btn>
        </v-snackbar>

        <h1 class="subtitle-1 grey--text">Personal Tasks</h1>
        <v-container  class="my-5">
            <p v-if="myProjects.length==0" class="subtitle-1 grey--text">No personal projects yet</p>
            <v-expansion-panels popout>
                <v-expansion-panel
                        v-for="(project,i) in myProjects"
                        :key="i"
                >
                    <v-expansion-panel-header>
                        <div class="d-inline-flex">
                            <v-icon class="mr-5" :color="`${notifications[filterStatus(project)].color}`">{{notifications[filterStatus(project)].icon}}</v-icon>
                            <span>{{project.title}}</span>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="px-4 grey--text">
                        <h1 class="caption font-weight-bold">Due by {{ project.dueby }}</h1>
                            <v-divider class="mt-1 mb-3"></v-divider>
                        <p>{{project.content}}</p>
                            <v-layout v-if="project.status!=='complete'">
                                <v-spacer/>

                                <EditPopup :current_project="project" @projectEdited="projectEdited()"/>
                                <v-btn text x-small color="red" class="mt-1" @click="projectCompleted(project)">Mark as completed</v-btn>
                            </v-layout>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>


    </div>
</template>

<script>
    import db from '../fb';
    import firebase from 'firebase';
    import EditPopup from "../components/EditPopup";

    export default {
        name: "Projects",
        data: function () {
            return{
                user: null,
                projects: [],
                notifications:{
                    complete: {
                        color: '#3cd1c2',
                        icon: 'notifications'
                    },
                    ongoing:{
                        color: 'orange',
                        icon: 'notifications_active'
                    },
                    overdue:{
                        color: 'red',
                        icon: 'notification_important'
                    }
                },
                editSnackbar: false
            }
        },
        components:{
            EditPopup
        },
        methods:{
            formatDate (date) {
                if (!date) return null;
                const [day, month, year] = date.split('/');
                return `${month}/${day}/${year}`
            },
            filterStatus(project){
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
            projectCompleted(project){
                db.collection('projects').doc(project.id).update({
                    status: 'complete'
                }).then(()=>{
                    project.status='complete'
                    // eslint-disable-next-line no-console
                }).catch(err=>console.log(err.message));
            },
            projectEdited(){
                db.collection('projects').get().then(projects=> {
                    let len=this.projects.length;
                    this.projects=[];
                    for (let i = 0; i < len; i++) {
                        this.projects[i]=projects.docs[i].data();
                        this.projects[i].id=projects.docs[i].id
                    }
                    this.editSnackbar=true
                })
            },
        },
        computed: {
            myProjects(){
                return this.projects.filter(project=>{
                    if(this.user){return project.person_id === this.user.id}
                })

            },
        },
        created() {
            //START LISTENING TO USER AUTH CHANGES
            firebase.auth().onAuthStateChanged((current_user)=>{
                if(current_user) {
                    db.collection('users').doc(current_user.uid).get()
                        .then(user => {
                            if (user.exists) {
                                this.user = user.data();
                                this.user.id = user.id;
                            } else {
                                // eslint-disable-next-line no-console
                                console.log("User not found in Projects, contact admin");
                                this.$router.push({name: 'login'})
                            }
                        })
                        .catch(err => {
                            // eslint-disable-next-line no-console
                            console.log(err.message)
                        })
                }
            });
            db.collection('projects').onSnapshot(res=>{
                const changes = res.docChanges();
                changes.forEach(change=>{
                    if (change.type === 'added'){
                        this.projects.push({
                            ...change.doc.data(),
                            id: change.doc.id,
                        })
                    }
                    else if(change.type === 'modified'){
                        // // eslint-disable-next-line no-console
                        // console.log("edit event");
                        // // eslint-disable-next-line no-console
                        // console.log(this.projects, "BEFORE EDIT");
                        // // eslint-disable-next-line no-console
                        // console.log(change.doc.id);
                        // this.projects=this.projects.filter(project=>{
                        //     // eslint-disable-next-line no-console
                        //     return project.id !== change.doc.id
                        // });
                        // // eslint-disable-next-line no-console
                        // // change.doc.data().id=change.doc.id;
                        // this.projects.push(change.doc.data());
                        // this.projects[this.projects.length-1].id=change.doc.id;
                        // // eslint-disable-next-line no-console
                        // console.log(this.projects, "AFTER");
                    }
                })

            })
        }
    }
</script>

<style scoped>

</style>