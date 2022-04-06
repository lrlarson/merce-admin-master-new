<template>
	<v-container>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						DANCE WORKS  --- Click to Edit
					</v-card-title>
					<v-card-text class="justify-center" >
						<v-btn @click="addDance">
							Add New Dance
						</v-btn>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-container grid-list-md >
				<v-data-table
						:headers="headers"
						:items="dancesArray"
						:items-per-page="500"
						class="elevation-1"
						@click:row="handleClick"
						:dense="false"
						:search="search"
						:custom-filter="filterOnlyCapsText">
					<template v-slot:top>
						<v-text-field
								v-model="search"
								label="Search (UPPER CASE ONLY)"
								class="mx-4"
						></v-text-field>
					</template>
				</v-data-table>
			</v-container>
		</v-layout>
	</v-container>
</template>

<script>
import axios from 'axios';
import moment from "moment/moment";
import router from "@/router";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const Uppy = require("@uppy/core");
// const Dashboard = require("@uppy/dashboard");
// const XHRUpload = require("@uppy/xhr-upload");
// require('@uppy/core/dist/style.css')
// require('@uppy/dashboard/dist/style.css')
export default {
	name: "Dances",
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		dancesArray: [],
		snackbar: false,
		search:'',
		headers: [
			{text: "Work", value: "WORKTITLE", sortable:true},
			{text: "Premiere Date", value: "PREMIEREDATE",sortable:false},
		],
	}),
	methods:{
		getDances(){
			let vm = this;
			let index = 0;
			let arr = [];
			axios.get(vm.dataURL + 'method=getDances')
			.then(function (response){
				vm.dancesArray = response.data.RESULTS;
				vm.dancesArray.forEach(vm.datePresentation,index,arr)
			})
		},
		datePresentation(item,index,arr){
			this.dancesArray[index].PREMIEREDATE = moment(arr[index].PREMIEREDATE).format("MMMM Do, YYYY");
		},
		handleClick : function(value){
			router.push({ name: "dance-detail", params: { id: value.ID } });
		},
		addDance(){
			router.push({ name: "dance-detail", params: { id: 0 } });
		},
		filterOnlyCapsText (value, search) {
			return value != null &&
					search != null &&
					typeof value === 'string' &&
					value.toString().toLocaleUpperCase().indexOf(search) !== -1
		},
	},
	mounted() {
		this.getDances();
	}
}
</script>

<style scoped>

</style>
