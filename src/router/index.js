import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Team from "../views/Team";
import Projects from "../views/Projects";
import Signup from "../views/auth/Signup";
import Login from "../views/auth/Login";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {requiresAuth:true}
  },
  {
    path: '/team',
    name: 'team',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Team,
    meta: {requiresAuth:true}
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: {requiresAuth:true}
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  }

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


//route guard
router.beforeEach((to, from, next) =>{
  //check to see if route requires auth
  if(to.matched.some(rec=>rec.meta.requiresAuth)){
    //check auth state of user GETTING CURRENT USER WITH FIREBASE RETURNS NULL
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        //user signed in, proceed to route
        // eslint-disable-next-line no-console
        // console.log("user logged in");
        next();
      }else{
        //no user signed in, redirect to login
        // eslint-disable-next-line no-console
        // console.log("no user logged in")
        next({name:'login'})
      }
    })
  }else{
    next()
  }
});

export default router
