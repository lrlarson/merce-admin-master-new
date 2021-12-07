<template>
	<v-container>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						Music
					</v-card-title>
					<v-card-text class="justify-center" >
						<v-btn @click="addMusic">
							Add New Music
						</v-btn>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-container grid-list-md >
				
				<v-data-table
						:headers="headers"
						:items="musicArray"
						:items-per-page="500"
						class="elevation-1"
						@click:row="handleClick"
						:dense="true"
				>
				</v-data-table>
			</v-container>
		</v-layout>
		<v-row v-if="editMode">
			<v-col md3 sm12>
				<v-text-field label="Title" v-model="musicObject.TITLE"></v-text-field>
			</v-col>
			<v-col md3>
				<v-select
						label="Composer"
						v-model="musicObject.COMPOSERID"
						:items="composersArray"
						item-text="COMPOSERFULLNAME"
						item-value="ID"
				></v-select>
			</v-col>
		</v-row>
		<v-row v-if="editMode">
			<v-col md3 sm12>
				<v-btn @click="updateMusic" color="blue">Save Music Edits</v-btn>
			</v-col>
		</v-row>
		<v-snackbar v-model="snackbar">
			{{ text }}
			<template v-slot:action="{ attrs }">
				<v-btn
						color="pink"
						text
						v-bind="attrs"
						@click="snackbar = false"
						:timeout="timeout"
				>
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>

<script>
import axios from 'axios'

export default {
	name: "Music" ,
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		musicArray: [],
		musicSingleArray:[],
		musicObject:{},
		composersArray:[],
		workShopTypes:[],
		editMode:false,
		addMode:false,
		snackbar: false,
		text:'Saved',
		timeout: 1000,
		headers: [
			{
				text: "Title",
				value: "TITLE",
				sortable:true
			},
			{
				text: "Composer",
				value: "FULLNAME",
				sortable:true
			},
		],
	}),
	methods: {
		addMusic(){
		
		},
		getAllMusic(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAllMusic')
			.then(function(response){
				vm.musicArray = response.data.RESULTS;
			})
		},
		getMusicDetails(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getMusicDetails&id=' + id)
			.then(function(response){
				vm.musicSingleArray = response.data.RESULTS;
				vm.musicObject = vm.musicSingleArray[0];
			})
		},
		handleClick: function(value) {
			this.getMusicDetails(value.ID);
			this.editMode = true;
			this.$vuetify.goTo(this.pageHeight);
		},
		getAllComposers(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getComposersNew')
			.then(function(response){
				vm.composersArray = response.data.RESULTS;
			})
		},
		updateMusic(){
			let vm=this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateMusic",
					MusicObject: JSON.stringify(vm.musicObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.editMode = false;
				},
				error: function (jqXHR, exception) {
					var msg = "";
					if (jqXHR.status === 0) {
						msg = "Not connect.\n Verify Network.";
					} else if (jqXHR.status == 404) {
						msg = "Requested page not found. [404]";
					} else if (jqXHR.status == 500) {
						msg = "Internal Server Error [500].";
					} else if (exception === "parsererror") {
						msg = "Requested JSON parse failed.";
					} else if (exception === "timeout") {
						msg = "Time out error.";
					} else if (exception === "abort") {
						msg = "Ajax request aborted.";
					} else {
						msg = "Uncaught Error.\n" + jqXHR.responseText;
					}
					alert(msg);
				}
			});
		},
	},
	mounted() {
		this.getAllMusic();
		this.getAllComposers();
	},
	computed: {
		pageHeight () {
			return document.body.scrollHeight
		}
	}
}
</script>

<style scoped>

</style>
