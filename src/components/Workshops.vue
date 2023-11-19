<template>

	<v-container>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						Workshops
					</v-card-title>
					<v-card-text class="justify-center" >
						<v-btn @click="addNewClass">
							Add New New Workshop
						</v-btn>
<!--						<v-btn @click="getRateMessage" style="margin-left:10px;">-->
<!--							Set/Edit Rate Message-->
<!--						</v-btn>-->
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-container grid-list-md >
				
				<v-data-table
						:headers="headers"
						:items="workShops"
						:items-per-page="500"
						class="elevation-1"
						@click:row="handleClick"
						:dense="true"
				>
				</v-data-table>
			</v-container>
		</v-layout>
		<v-row>
			<v-col md-2 lg-2>
				<v-text-field disabled label="Start Date"></v-text-field>
				<v-date-picker
						v-model="picker">
				</v-date-picker>
			</v-col>
			<v-col md-2 lg-2>
				
				<v-text-field disabled label="End Date"></v-text-field>
				<v-date-picker
						v-model="picker2">
				</v-date-picker>
			</v-col>
			</v-row>
		<v-row>
			<v-col md-2 lg-2>
				<v-text-field
						v-model="workShopObject.DATESTRING" label="Date/Time Text"></v-text-field>
			</v-col>
			<v-col md-2 lg-2>
				<v-text-field
						v-model="workShopObject.LOCATION" label="Location"></v-text-field>
			</v-col>
			<v-col md-2 lg-2>
				<v-text-field
						v-model="workShopObject.LEADER" label="Leader"></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col md-2 lg-2>
				<v-select
						label="Workshop Type"
						v-model="workShopObject.WORKSHOPTYPE"
						:items="workShopTypes"
						item-text="LABEL"
						item-value="DATA"
				></v-select>
			</v-col>
			<v-col md-2 lg-2>
				<v-text-field
						v-model="workShopObject.TITLE" label="Class Title"></v-text-field>
			</v-col>
			<v-col md-2 lg-2>
				<v-text-field
						v-model="workShopObject.DANCE" label="Dance"></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col md-2 lg-2>
				<v-btn v-if="editMode" color="green" @click="saveClassEdits">Save Workshop Edits</v-btn>
			</v-col>
			<v-col md-2 lg-2>
				<v-btn v-if="newClassMode"  color="blue" @click="saveNewClass">Save New Workshop</v-btn>
			</v-col>
			<v-col md-2 lg-2>
				<v-btn color="red" v-if="editMode" @click="deleteWorkshop">Delete Selected Workshop</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>


<script>
import axios from 'axios'
import router from "@/router";
export default {
	name: "Workshops",
	components: {
	
	},
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		workShops: [],
		workShopArray:[],
		workShopObject:{},
		workShopTypes:[],
		editMode:false,
		newClassMode:false,
		picker: new Date().toISOString().substring(0,10),
		picker2: new Date().toISOString().substring(0,10),
		headers: [
			{
				text: "Title",
				value: "TITLE",
				sortable:true
			},
			{
				text: "Workshop Date",
				value: "DATESTRING",
				sortable:true
			},
			
			{text: "Leader", value: "LEADER"},
			{text: "Workshop Type", value: "WORKSHOPTYPESTRING",sortable:true},
		],
	}),
	methods: {
		
		getRateMessage(){
			router.push({name:'ClassRateMessage'});
		},
		getWorkShops() {
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getAllWorkshops')
					.then(function (result){
						vm.workShops = result.data.RESULTS;
					})
		},
		getWorkShopDetails(id){
			var vm= this;
			vm.axios.get(vm.dataURL + 'method=getWorkshop&id=' + id)
					.then(function (result){
						vm.workShopArray = result.data.RESULTS;
						vm.workShopObject = vm.workShopArray[0];
						vm.picker = vm.workShopObject.STARTDATE;
						vm.picker2 = vm.workShopObject.ENDDATE;
						vm.editMode = true;
						vm.newClassMode = false;
					})
		},
		handleClick: function(value) {
			this.getWorkShopDetails(value.ID);
			this.editMode = true;
			this.$vuetify.goTo(this.pageHeight);
		},
		getWorkshopTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getWorkShopTypes')
					.then(function (result){
						vm.workShopTypes = result.data.RESULTS;
					})
		},
		addNewClass(){
			this.editMode = false;
			this.newClassMode = true;
			this.picker = new Date().toISOString().substring(0,10);
			this.picker2 = new Date().toISOString().substring(0,10);
			this.workShopObject.DATESTRING='';
			this.workShopObject.LOCATION='';
			this.workShopObject.LEADER='';
			this.workShopObject.TITLE='';
			this.workShopObject.DANCE = '';
			this.workShopObject.WORKSHOPTYPE = 0;
		},
		createClassObjects(){
			this.workShopObject.STARTDATE='';
			this.workShopObject.ENDDATE='';
			this.workShopObject.DATESTRING='';
			this.workShopObject.LOCATION='';
			this.workShopObject.LEADER='';
			this.workShopObject.TITLE='';
			this.workShopObject.DANCE = '';
			this.workShopObject.WORKSHOPTYPE = 0;
		},
		clearClassObjects(){
			this.workShopObject.STARTDATE='';
			this.workShopObject.DANCE = '';
			this.workShopObject.ENDDATE='';
			this.workShopObject.DATESTRING='';
			this.workShopObject.LOCATION='';
			this.workShopObject.LEADER='';
			this.workShopObject.TITLE='';
			this.workShopObject.WORKSHOPTYPE = 0;
			this.workShopObject.ID = 0;
			this.picker = new Date().toISOString().substring(0,10);
			this.picker2 = new Date().toISOString().substring(0,10);
		},
		saveNewClass(){
			var vm = this;
			vm.workShopObject.STARTDATE= vm.picker;
			vm.workShopObject.ENDDATE= vm.picker2;
			window.$.ajax({
				type: "post",
				url: vm.dataURL,
				dataType: "json",
				data: {
					method: "insertNewWorkshop",
					workshop: JSON.stringify(vm.workShopObject)
				},
				success: function () {
					console.log('success');
					vm.getWorkShops();
					vm.clearClassObjects();
					vm.newClassMode = false;
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
		saveClassEdits(){
			var vm = this;
			vm.workShopObject.STARTDATE = vm.picker;
			vm.workShopObject.ENDDATE = vm.picker2;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateWorkshop",
					workshop: JSON.stringify(vm.workShopObject)
				},
				success: function () {
					vm.getWorkShops();
					vm.clearClassObjects();
					vm.newClassMode = false;
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
				},
			});
		},
		deleteWorkshop(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=deleteWorkshop&id=' + vm.workShopObject.ID)
					.then(function (){
						vm.getWorkShops();
						vm.clearClassObjects();
						vm.newClassMode = false;
						vm.editMode = false;
					})
		}
	},
	mounted() {
		this.getWorkShops();
		this.getWorkshopTypes();
		this.createClassObjects();
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
