<template>
	<v-container >
		<v-row >
			<v-col  >
				<v-btn block elevation="14" color="accent"  x-large @click="goToClasses">Classes</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToPeople">Edit People</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToEvent">Events</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToMedia">Media</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToPromo">Promo Bar</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToDances">Dances</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToLicenses">Licenses</v-btn>
			</v-col>
			<v-col>
				<v-btn block elevation="14" color="accent"  x-large @click="goToWebVideos">Home Page Videos</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import router from "../router";

export default {
	name: "Home",
	methods: {
		goToClasses(){
			router.push({name:'Classes'});
		},
		goToPeople(){
			router.push({name:'People'});
		},
		goToEvent(){
			router.push({name:'EventsEditor'});
		},
		goToMedia(){
			router.push({name:'Media'});
		},
		goToPromo(){
			router.push({name:'PromoBar'});
		},
		goToDances(){
			router.push({name:'Dances'});
		},
		goToLicenses(){
			router.push({name:'Performances Licenses'});
		},
		goToWebVideos(){
			router.push({name:'WebVideos'});
		}
	}
}
</script>

<style scoped>

</style>
