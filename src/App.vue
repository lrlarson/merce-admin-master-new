<template>
	<v-app id="inspire">
		<v-navigation-drawer
				v-model="drawer"
				app
		>
			<v-list dense v-if="authenticated">
				<v-list-item link>
					<v-list-item-action>
						<router-link  to="/Home">Home
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>MCT Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/Classes">Classes
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit/Add Classes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/Workshops">Workshops
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit/Add Workshops</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/PromoBar">Edit Promo Bar
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Web Promo Bar</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/EventsEditor">Events Editor
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Events</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/People">People
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit People</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/Media">Media
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Media</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/WebVideos">Web Videos
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Web Videos</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/Dances">Dances
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Dances</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/PerformanceLicenses">Licenses
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Licenses</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				<v-list-item link>
					<v-list-item-action>
						<router-link to="/Music">Music
						</router-link>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Edit Music</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
				
			</v-list>
		</v-navigation-drawer>
		
		<v-app-bar
				app
				color="indigo"
				dark
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>Merce Cunningham Trust -- App. Version: 1.5.2 Production</v-toolbar-title>
		</v-app-bar>
		
		<v-main>
			<v-container
					class="fill-height"
					fluid
			>
				<router-view></router-view>
			</v-container>
		</v-main>
		<v-footer
				color="indigo"
				app
		>
			<span class="white--text">&copy;  {{ currentYear }}</span>
		</v-footer>
	</v-app>
</template>

<script>
import {eventBus} from "./main";
import moment from "moment";

export default {
	props: {
		source: String,
	},
	data: () => ({
		drawer: null,
		authenticated: false,     // temp sent to true,
		currentYear: ''
	}),
	created() {
		eventBus.$on("signedIn", () => {
			//console.log("signin");
			this.authenticated = true;
		});
		eventBus.$on("signInFail", () => {
			this.authenticated = false;
		});
		this.currentYear = moment().year();
	}
}
</script>
