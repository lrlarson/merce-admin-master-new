<template>
<v-container>
		<div>
			<v-card
						class="d-flex justify-center mb-6"
						outlined
						tile
				>
					New Home Page Options
				</v-card>
		</div>
	<v-row style="margin-top: 15px;">
		<v-col sm12 lg4>
			<div>
				<b>Director's Letters</b>
				<v-btn @click="addNewLetterForm" style="margin-left: 15px;">Add New Letter</v-btn>
			</div>
		</v-col>
	<v-col sm12 lg8>
	
		<v-data-table
				:headers="headers"
				:items="letterArray"
				:items-per-page="500"
				class="elevation-1"
				@click:row="handleClick"
				:dense="false">
		</v-data-table>
	</v-col>
	</v-row>

</v-container>
</template>

<script>
import axios from 'axios';
export default {
	name: "HomePageEditor",
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		letterArray:[],
		singleLetterArray:[],
		letterObject:{},
		headers: [
			{text: "Month", value: "DATESTRING", sortable:true},
			{text:"Publish", value: 'PUBLISH', sortable: true}
		],
		letterEditMode:false,
		letterAddMode:false
	}),
	methods:{
		getLetters(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getDirectorLetters')
					.then(function (result){
						vm.letterArray = result.data.RESULTS;
					})
		},
		handleClick(value){
			console.log(value.ID);
			let vm=this;
			axios.get(vm.dataURL + 'method=getLetter&letterID=' + value.ID)
					.then(function (result){vm.singleLetterArray = result.data.RESULTS;
						vm.letterObject = vm.singleLetterArray[0];
					})
		}
	},
	addNewLetterForm(){
	
	},
	mounted() {
		this.getLetters();
	}
	
	
}
</script>

<style scoped>

</style>
