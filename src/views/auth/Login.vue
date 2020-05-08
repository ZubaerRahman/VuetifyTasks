<template>
    <div class="login">
        <h1 class="subtitle-1 grey--text">Login</h1>
        <v-layout class="my-5" justify-center>
            <v-card class="pa-3" width="600">
                <v-form>
                    <v-text-field label="email" prepend-icon="email" v-model="email" :rules="rules.emailRules" validate-on-blur></v-text-field>
                    <v-text-field
                            v-model="password"
                            prepend-icon="lock"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.pwd, rules.min]"
                            :type="show ? 'text' : 'password'"
                            name="input-10-1"
                            label="password"
                            @click:append="show = !show"
                            validate-on-blur
                    ></v-text-field>
                    <p id="feedback" class="ml-4 red--text text--lighten-1" v-if="feedback">{{feedback}}, <router-link to="signup" class="red--text" v-if="signupredirect">have you signed up yet?</router-link></p>
                    <v-btn text @click="login">Login</v-btn>
                </v-form>
            </v-card>
        </v-layout>
    </div>
</template>

<script>
    import firebase from 'firebase';
    export default {
        name: "Login",
        data:function(){return{
            email: "",
            password: "",
            show: false,
            rules: {
                min: v => v.length >= 8 || 'Password must contain at least 8 characters',
                pwd: v => !!v || 'Password is required.',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ]
            },
            feedback: "",
            signupredirect: false,
        }},
        methods: {
            login() {
                if (this.email && this.password) {
                    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                        .then(() => {
                            this.feedback = null;
                            this.signupredirect = null;
                            this.$router.push({name: 'dashboard'})
                        })
                        .catch(error => {
                            // eslint-disable-next-line no-console
                            console.log(error.message);
                            this.feedback = `User not found`;
                            this.signupredirect = true

                        })
                }
            }
        }
    }
</script>

<style scoped>

</style>