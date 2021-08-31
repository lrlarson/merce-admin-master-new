<template>
	<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					Performance Licenses  --- Click to Edit
				</v-card-title>
				<v-card-text class="justify-center" >
					<v-btn @click="addNewLicense(0)">
						Add New License
					</v-btn>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-container grid-list-md >
			<v-data-table
					:headers="headers"
					:items="licensesArray"
					:items-per-page="50"
					class="elevation-1"
					@click:row="handleClick"
					:dense="true"
					:search="search"
					:custom-filter="filterOnlyCapsText">
				
				<template v-slot:top>
					<v-text-field
							v-model="search"
							label="Search (UPPER CASE ONLY)"
							class="mx-4"
					></v-text-field>
				</template>
				<template v-slot:item.ACTIVE="{ item }">
					<v-simple-checkbox
							v-model="item.ACTIVE"
							disabled
					></v-simple-checkbox>
				</template>
			</v-data-table>
		</v-container>
	</v-layout>
	</v-container>
</template>

<script>
import axios from 'axios';
import router from "@/router";
export default {
	name: "PerformanceLicenses",
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		licensesArray: [],
		snackbar: false,
		search:'',
		editMode:false,
		addMode:false,
		headers: [
			{text: "Dances", value: "DANCENAME", sortable:true},
			{text: "Company", value: "COMPANY",sortable:true},
			{text:"Licenses Type", value:"LICTYPE",sortable: true},
			{text:"Year", value:"REFERENCEYEAR",sortable: true},
			{text:"active",value:"ACTIVE",sortable:true}
		],
		
	}),
	methods:{
		getLicenses(){
			let vm= this;
			axios.get(vm.dataURL + 'method=getLicenses')
					.then(function (response){
						vm.licensesArray = response.data.RESULTS;
						vm.licensesArray.forEach(function(lic){
							if (lic.ACTIVE == 1){
								lic.ACTIVE = true;
							}else{
								lic.ACTIVE = false;
							}
						})
					})
		},
		filterOnlyCapsText (value, search) {
			return value != null &&
					search != null &&
					typeof value === 'string' &&
					value.toString().toLocaleUpperCase().indexOf(search) !== -1
		},
		handleClick : function(value){
			
			router.push({ name: "license-detail", params: { id: value.ID } });
		},
		addNewLicense(flag){
			router.push({ name: "license-detail", params: { id: flag } });
		},
	},
	mounted(){
		this.getLicenses();
	}
	
}
</script>

<style scoped>

</style>
