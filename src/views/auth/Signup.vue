<template>
    <div class="signup">
    <h1 class="subtitle-1 grey--text">Signup</h1>
    <v-layout class="my-5" justify-center>
        <v-card class="pa-3" width="600">
            <v-form ref="form">
                <v-text-field label="email" prepend-icon="email" v-model="email" :rules="rules.emailRules" validate-on-blur></v-text-field>
                <v-text-field
                        v-model="password"
                        prepend-icon="lock"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.pwd, rules.min]"
                        :type="show ? 'text' : 'password'"
                        name="input-10-1"
                        label="password"
                        hint=""
                        counter
                        @click:append="show = !show"
                        validate-on-blur
                ></v-text-field>
                <v-text-field label="username" prepend-icon="person" v-model="user_name" :rules="rules.usernameRules" validate-on-blur></v-text-field>


                <v-select
                        :items="roles"
                        label="Job role"
                        v-model="role"
                        prepend-icon="mdi-briefcase"
                ></v-select>

                <v-select
                        :items="avatars"
                        label="Avatar"
                        v-model="avatar"
                        prepend-icon="mdi-guy-fawkes-mask"
                ></v-select>

                <p class="ml-4 red--text text--lighten-1" v-if="feedback">{{feedback}}</p>
                <v-btn text :loading="loading" @click="signUp()">Signup</v-btn>
            </v-form>
        </v-card>
    </v-layout>
    </div>
</template>

<script>
    import slugify from 'slugify';
    import db from '../../fb';
    import firebase from 'firebase';

    export default {
        name: "Signup",
        data: function () {
            return{
                email: "",
                password: "",
                user_name: null,
                slug: null,
                roles:['Failure','Software Engineer','Data Analyst','Tech Support','Wasteman','Leech','Researcher','UX Researcher'],
                role: 'Failure',
                avatars:['Saitama','Goku','Naruto','Luffy','Superman','Spiderman','Elon Musk','Zenitsu'],
                avatarRef:[{name:'Saitama', ref:'https://media1.tenor.com/images/d539079ca9d9c9aa2f52ceaf38e82d3c/tenor.gif?itemid=12663090'},{name:'Goku', ref:'https://media3.giphy.com/media/zDAqUralC0HU4/giphy.gif'},{name:'Naruto',ref:'https://data.whicdn.com/images/338650292/original.gif'},{name:'Zenitsu', ref:'https://steamuserimages-a.akamaihd.net/ugc/788608432740368182/5AECEFD2A33E3187F8A91FAC7646B2D510753001/'},{name:'Luffy', ref:'https://i.pinimg.com/originals/69/d6/1c/69d61cdda58eb1176db7862cd104e1ee.gif'},{name:'Superman', ref:'https://i.ya-webdesign.com/images/superhero-gif-png-6.gif'},{name:'Spiderman', ref:'data:image/jpeg;base64,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'},{name:'Elon Musk', ref:'https://media.giphy.com/media/3jcgPn9fzfaXc1EHJC/giphy.gif'},],
                avatar: 'Goku',
                team:'Bnn3BH0ucX8Oe2n3UIX9',
                feedback: null,
                selectSlot: false,
                loading: false,

                show: false,
                rules: {
                    usernameRules: [
                        v => !!v || 'Username is required.',
                    ],
                    pwd: v => !!v || 'Password is required.',
                    min: v => (v.length >= 8 && v.length<=12) || 'Must contain between 8 to 12 characters',
                    emailRules: [
                        v => !!v || 'E-mail is required',
                        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                    ]
                },
            }
        },
        methods: {
            signUp() {
                if(this.$refs.form.validate()){
                if (this.email && this.password && this.user_name.length>=4 && this.user_name.length<=12) {
                    if(this.teams_full()){
                        this.loading=false;
                        this.feedback="All teams are currently full."
                    }
                    else{
                    this.loading = true;
                    this.slug = slugify(this.user_name, {
                        replacement: '-',
                        remove: /[$*_+~.()'"!\-:@]/g,
                        lower: true
                    });
                    this.user_name = this.slug;

                    db.collection('users').where('user_name', '==', this.user_name).get()
                        .then(snapshot => {
                            if (snapshot.docs.length > 0) {
                                this.feedback = "User already exists";
                                this.loading = false;
                            } else {
                                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                                    .then(cred => {
                                        let ref = db.collection('users').doc(cred.user.uid);
                                        ref.set({
                                            user_name: this.user_name,
                                            team:this.team,
                                            role:this.role,
                                            //get avatar link
                                            avatar: this.avatarRef.filter(ref=>{
                                                return ref.name===this.avatar
                                            })
                                        });
                                        //add new user to default team
                                        db.collection('teams').doc(this.team).update({
                                            members: firebase.firestore.FieldValue.arrayUnion(cred.user.uid)
                                        })
                                    })
                                    .then(() => {
                                        this.loading = false;
                                        this.$router.push({name: 'dashboard'})
                                    })
                                    .catch(err => {
                                        this.loading = false;
                                        this.feedback = err.message;
                                        // eslint-disable-next-line no-console
                                        console.log(err)
                                    })
                            }
                        });
                    }
                }
                else if(this.user_name.length<4 ){
                    this.feedback = "Username must contain between 4 to 12 characters";
                    }
                else {
                    this.feedback = "Please fill in all fields"
                }
                }else{
                    // eslint-disable-next-line no-console
                    // console.log("Validation failed")
                    }
            },
            teams_full(){
                this.loading=true;
                db.collection('teams').doc('Bnn3BH0ucX8Oe2n3UIX9').get()
                    .then(team=>{
                        return team.data().members.length > 10;
                    })
            },
        },
        watch: {
            multiple (val) {
                if (val) this.model = [this.model];
                else this.model = this.model[0] || 'Goku'
            },
        },
    }
</script>

<style scoped>

</style>