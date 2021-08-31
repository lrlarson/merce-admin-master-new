<template>
<v-container>
	<v-container v-if="editMode">
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					Performance License: {{ licenseObject.DANCENAME }} ---   Company: {{ licenseObject.COMPANY }}
				</v-card-title>
			</v-card>
		</v-flex>
	</v-layout>
	
	<v-layout row>
		<v-flex md3 sm12>
			<v-text-field  label="Dance Name" v-model="licenseObject.DANCENAME"></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field  label="Year as Text" v-model="licenseObject.YEARSTRING"></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field v-model="licenseObject.REFERENCEYEAR"  label="Year as Number" ></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-select
					label="License Type"
					:items="licenseTypes"
					item-text="LABEL"
					item-value="DATA"
					placeholder="License Type"
					v-model="licenseObject.LICTYPE"
			></v-select>
		</v-flex>
	</v-layout>
	<v-layout row>
		<v-flex md3 sm12>
			<v-text-field  label="Stager" v-model="licenseObject.STAGER"></v-text-field>
		</v-flex>
		<v-flex md3 sm12 style="margin-left: 10px;">
			<v-text-field  label="Company" v-model="licenseObject.COMPANY"></v-text-field>
		</v-flex>
		<v-flex md3 sm12 style="margin-left: 10px;">
			<v-text-field v-model="licenseObject.LOCATION"  label="Location" ></v-text-field>
		</v-flex>
		<v-flex md1 sm12 style="margin-left: 10px;">
			<v-checkbox v-model="licenseObject.ACTIVE" label="Active"></v-checkbox>
		</v-flex>
	</v-layout>
	<v-layout row>
		<v-flex md3 sm12>
			<v-text-field  disabled label="Description"></v-text-field>
			<ckeditor  :editor="editor" v-model="licenseObject.DESCRIPTION" :config="editorConfig"></ckeditor>
		</v-flex>
		<v-row>
			<v-col md4 sm12 style="margin-left: 10px;">
				<v-simple-table style="max-width: 30%;">
					<template v-slot:default>
						<tbody>
						<tr>
							<td><em>Associated Dances (click to edit)</em></td>
						
						</tr>
						<tr
								v-for="item in relatedDances"
								:key="item.WORKID"
								@click="setEditDanceMode(item)"
						>
							<td>{{ item.WORKTITLE}}</td>
						
						</tr>
						</tbody>
					</template>
				</v-simple-table>
				
				<v-btn v-if="editDanceMode" color="red" @click="deleteRelatedDance">Delete {{danceName}}</v-btn>
				
			</v-col>
			<v-col md4 sm12 style="margin-left: 10px;">
				<v-select
									label="Select Dance to Add"
									:items="dances"
									item-text="LABEL"
									item-value="DATA"
									placeholder="Selected Dance"
									v-model="selectedDance"
									@change="enterAddDanceMode"
									return-object
									style="margin-left:10px;max-width:30%"
				></v-select>
				<v-btn v-if="addDanceMode" color="green" @click="saveNewRelatedDance">Add Selected Dance</v-btn>
			</v-col>
		</v-row>
	</v-layout>
		<v-layout row>
			<v-col >

						<v-btn @click="saveLicenseEdits" color="green" style="display:block;margin-left: auto;margin-right: auto;">Save License Edits</v-btn>
				<v-btn @click="deleteLicense" color="red" style="display:block;margin-left: auto;margin-right: auto;margin-top: 20px;">Delete License</v-btn>
			</v-col>
		</v-layout>
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
	
	<v-container v-else>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						{{ licenseObject.DANCENAME }}
					</v-card-title>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex md4 sm1>
				<v-text-field  label="Dance Name" v-model="licenseObject.DANCENAME"></v-text-field>
			</v-flex>
			<v-flex md2 sm1 style="margin-left: 10px;">
				<v-text-field  label="Year as Text" v-model="licenseObject.YEARSTRING"></v-text-field>
			</v-flex>
			<v-flex md2 sm1 style="margin-left: 10px;">
				<v-text-field v-model="licenseObject.REFERENCEYEAR"  label="Year as Number" ></v-text-field>
			</v-flex>
			<v-flex md2 sm1 style="margin-left: 10px;">
				<v-select
						label="License Type"
						:items="licenseTypes"
						item-text="LABEL"
						item-value="DATA"
						placeholder="License Type"
						v-model="licenseObject.LICTYPE"
				></v-select>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex md3 sm1>
				<v-text-field  label="Stager" v-model="licenseObject.STAGER"></v-text-field>
			</v-flex>
			<v-flex md3 sm1 style="margin-left: 10px;">
				<v-text-field  label="Company" v-model="licenseObject.COMPANY"></v-text-field>
			</v-flex>
			<v-flex md3 sm1 style="margin-left: 10px;">
				<v-text-field v-model="licenseObject.LOCATION"  label="Location" ></v-text-field>
			</v-flex>
			<v-flex md1 sm1 style="margin-left: 10px;">
				<v-checkbox v-model="licenseObject.ACTIVE" label="Active"></v-checkbox>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex md3 sm1>
				<v-text-field  disabled label="Description"></v-text-field>
				<ckeditor  :editor="editor" v-model="licenseObject.DESCRIPTION" :config="editorConfig"></ckeditor>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-col >
				
				<v-btn @click="saveNewLicense" color="green" style="display:block;margin-left: auto;margin-right: auto;">Save New License</v-btn>
			
			</v-col>
		</v-layout>
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
</v-container>
</template>

<script>
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import router from "@/router";

export default {
	name: "LicenseDetail" ,
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		licenseArray: [],
		licenseObject:{},
		newLicenseObject:{},
		relatedDances:[],
		editMode:false,
		addMode:false,
		snackbar: false,
		text:'Saved',
		search:'',
		timeout: 1000,
		licID:null,
		licenseTypes:[],
		editor: ClassicEditor,
		editorData: '',
		dances:[],
		selectedDance:{},
		editDanceMode:false,
		addDanceMode:false,
		danceName:'',
		relatedDanceID:'',
		headers: [
			{text: "Work", value: "WORKTITLE", sortable:true},
			{text: "Premiere Date", value: "PREMIEREDATE",sortable:false},
		],
		editorConfig: {
		},
	}),
	methods: {
		getLicenseDetail(licID){
			let vm=this;
			axios.get(vm.dataURL + 'method=getLicenseDetails&licID=' + licID)
			.then(function (response){
				vm.licenseArray = response.data.RESULTS;
				vm.licenseObject = vm.licenseArray[0];
				vm.editMode = true;
			})
		},
		getLicenseTypes(){
			let vm=this;
			axios.get(vm.dataURL + 'method=getLicTypes')
			.then(function (response){
				vm.licenseTypes = response.data.RESULTS;
			})
		},
		getRelatedDances(id){
			let vm=this;
			axios.get(vm.dataURL + 'method=getRelatedDancesForLic&licID=' + id)
					.then(function (response){
						vm.relatedDances = response.data.RESULTS;
					})
		},
		getDances(){
			let vm=this;
			axios.get(vm.dataURL + 'method=getDanceNames')
			.then(function (response){
				vm.dances = response.data.RESULTS;
			})
		},
		setEditDanceMode(item){
			this.danceName = item.WORKTITLE;
			this.relatedDanceID = item.RELATEDID;
			this.editDanceMode = true;
		},
		deleteRelatedDance(){
			let vm=this;
			axios.get(vm.dataURL + 'method=deleteRelatedDance&relatedID=' + vm.relatedDanceID)
			.then(function (response){
				vm.getRelatedDances(vm.licID);
				vm.snackbar = true;
				vm.editDanceMode = false;
			})
		},
		enterAddDanceMode(){
			this.editDanceMode = false;
			this.addDanceMode = true;
		},
		saveLicenseEdits(){
			let vm=this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "saveLicEdit",
					LICENSEOBJECT: JSON.stringify(vm.licenseObject)
				},
				success: function () {
					vm.snackbar = true;
					// router.push({name:'Performances Licenses'});
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
		saveNewLicense(){
			let vm=this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewLicense",
					LICENSEOBJECT: JSON.stringify(vm.licenseObject)
				},
				success: function () {
					vm.snackbar = true;
					router.push({name:'Performances Licenses'});
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
		clearLicenseObject(){
			this.licenseObject.ACTIVE = 0;
			this.licenseObject.COMPANY='';
			this.licenseObject.DANCENAME='';
			this.licenseObject.DESCRIPTION='';
			this.licenseObject.LICTYPE=null;
			this.licenseObject.LOCATION='';
			this.licenseObject.REFERENCEYEAR=null;
			this.licenseObject.STAGER='';
			this.licenseObject.YEARSSTRING='';
		},
		saveNewRelatedDance(){
			let vm=this;
			vm.selectedDance.LICID = vm.licID;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "addRelatedDance",
					selectedDance: JSON.stringify(vm.selectedDance)
				},
				success: function () {
					vm.snackbar = true;
					vm.addDanceMode = false;
					vm.getRelatedDances(vm.licID);
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
		deleteLicense(){
			let vm=this;
			axios.get(vm.dataURL + 'method=deleteLicense&id=' + vm.licenseObject.ID)
			.then(function (response){
				vm.snackbar = true;
				router.push({name:'Performances Licenses'});
			})
		},
	},

	created() {
		this.licID =  this.$route.params.id;
		if (this.licID > 0) {
			this.getLicenseDetail(this.licID);
			this.getRelatedDances(this.licID);
			this.editMode = true;
		}else{
			this.editMode=false;
			this.addMode=true;
			this.clearLicenseObject();
		}
		this.getLicenseTypes();
		this.getDances();
	}
}
</script>

<style scoped>

</style>
