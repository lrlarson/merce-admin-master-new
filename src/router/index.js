import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '@/components/SignIn'
import Home from '@/components/Home'
import Classes from '@/components/Classes'
import ClassRateMessage from "@/components/ClassRateMessage";
import PromoBar from "@/components/PromoBar";
import EventsEditor from "@/components/EventsEditor"
import People from "@/components/People";
import Media from "@/components/Media";
import Dances from "@/components/Dances";
import DanceDetail from "@/components/DanceDetail";
import PerformanceLicenses from "@/components/PerformanceLicenses";
import LicenseDetail from "@/components/LicenseDetail";
import WebVideos from "@/components/WebVideos";
import Workshops from "@/components/Workshops";
import Music from "@/components/Music";
import HomePageEditor from "@/components/HomePageEditor";
import store from "@/store";






Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Sign In',
    component: SignIn
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path:'/Classes',
    name:'Classes',
    component: Classes
  },
  {
    path:'/Classes/ClassRateMessage',
    name:'ClassRateMessage',
    component: ClassRateMessage
  },
  {
    path:'/Promobar',
    name:'PromoBar',
    component: PromoBar
  },
  {
    path:'/EventsEditor',
    name:'EventsEditor',
    component: EventsEditor

  },
  {
    path:'/People',
    name: 'People',
    component: People
  },
  {
    path: '/Media',
    name: 'Media',
    component: Media
  },
  {
    path: '/Dances',
    name: 'Dances',
    component: Dances
  },
  {
    path: '/dance-detail/:id',
    name:'dance-detail',
    component: DanceDetail
  },
  {
    path: '/PerformanceLicenses',
    name: 'Performances Licenses',
    component: PerformanceLicenses
  },
  {
    path:'/license-detail/:id',
    name:'license-detail',
    component:LicenseDetail
  },
  {
    path:'/WebVideos',
    name:'WebVideos',
    component:WebVideos
  },
  {
    path:'/Workshops',
    name:'Workshops',
    component:Workshops
  },
  {
    path:'/Music',
    name:'Music',
    component:Music
  },
  {
    path:'/HomePageEditor',
    name:'HomePageEditor',
    component: HomePageEditor
  }


]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {

  if (to.name !== 'Sign In' && !(store.state.authenticated)) next({ name: 'Sign In' })
  else next()
})
export default router
