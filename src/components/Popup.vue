<template>
    <div>
        <v-btn
                color="black"
                dark
                @click.stop="dialog = true"
                small
        >
            Add project
        </v-btn>

        <v-dialog
                v-model="dialog"
                max-width="600"
        >
            <v-card>
                <v-card-title class="headline">Add new project</v-card-title>
                <v-card-text>
                    <v-form class="px-3" ref="form">
                        <v-text-field label="Title" v-model="title" prepend-icon="folder" :rules="input_rules" validate-on-blur></v-text-field>
                        <v-textarea label="Information" v-model="content" prepend-icon="edit" :rules="input_rules" validate-on-blur></v-textarea>

                        <v-menu max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-text-field :value="formattedDate" label="Due date" prepend-icon="mdi-calendar-range" v-on="on" readonly :rules="input_rules"></v-text-field>
                            </template>
                            <v-date-picker v-model="due"></v-date-picker>
                        </v-menu>

                        <v-btn text color="red" class="mx-0 mt-3" @click="submit()" :loading="loading">Add Project</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
    import db from '../fb'
    import firebase from 'firebase'
    // eslint-disable-next-line no-unused-vars
    import format from 'date-fns/format';
    // eslint-disable-next-line no-unused-vars
    import parseISO from 'date-fns/parseISO'

    export default {
        name: "Popup",
        data: function () {
            return{
                dialog: null,
                title: "",
                content: "",
                user: null,
                due: new Date().toISOString().substr(0, 10),
                dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
                input_rules: [
                    v => v.length >= 4 || "Minimum length is 4 characters"
                ],
                loading: false
            }
        },
        methods:{
            submit(){
                if(this.$refs.form.validate()){
                    this.loading = true;
                    const project = {
                        title: this.title,
                        content: this.content,
                        dueby: this.formatDate(this.due).toString(),
                        person: this.user.user_name,
                        person_id: this.user.uid,
                        status: '',
                    };
                    db.collection('projects').add(project)
                        .then(()=>{
                            this.loading = false;
                            this.dialog = false;
                            this.$emit('projectAdded');
                        })
                }
            },
            formatDate (date) {
                if (!date) return null;

                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null;

                const [month, day, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
        },

        watch: {
            date () {
                this.dateFormatted = this.formatDate(this.date)
            },
        },

        computed:{
            formattedDate(){
                return this.due ? this.formatDate(this.due) : ''
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
                                this.user.uid = current_user.uid
                            } else {
                                // eslint-disable-next-line no-console
                                console.log("User not found, contact admin");
                                this.$router.push({name: 'login'})
                            }
                        })
                        .catch(err => {
                            // eslint-disable-next-line no-console
                            console.log(err.message)
                        })
                }
            })
        }//created close
    }

</script>

<style scoped>

</style>