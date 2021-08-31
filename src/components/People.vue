<template>
	<v-container>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						People
					</v-card-title>
						<v-card-text class="justify-center" >
							<v-col  class="d-flex"
											cols="12"
											sm="6">
							<v-select
									label="Select Person Type"
									:items="peopleTypes"
									item-text="LABEL"
									item-value="DATA"
									placeholder="Event Type"
									v-model="selectedPersonType"
									@change="registerPersonType"
							></v-select>
							<v-btn style="margin-left: 15px;" @click="addNewPerson" v-if="personTypeSelected" >
								Add New Person
							</v-btn>
							</v-col>
						</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-row>
			<v-col>
				<v-data-table
						:headers="headers"
						:items="peopleTypeArray"
						:items-per-page="500"
						class="elevation-1"
						@click:row="handleClick"
						:dense="false">
					<template v-slot:item.ACTIVE="{ item }">
					<v-simple-checkbox
							v-model="item.ACTIVE"
							disabled
					></v-simple-checkbox>
				</template>
				</v-data-table>
			</v-col>
		</v-row>
		<v-layout row wrap>
			<v-flex md2 xs12 v-if="selectedPersonType>0">
				<v-text-field v-model="personObject.FELLOWNAME" label="Name" ></v-text-field>
			</v-flex>
			<v-flex md1 xs12 v-if="selectedPersonType>0">
				<v-checkbox v-model="personObject.ACTIVE" label="Active" >Active</v-checkbox>
			</v-flex>
			<v-flex md9 xs12 v-if="selectedPersonType > 1">
				<v-text-field v-model="personObject.STATUS" label="Status Line" ></v-text-field>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-flex md4 xs12 v-if="selectedPersonType > 0">
				<v-text-field label="Main Bio" disabled></v-text-field>
				<ckeditor :editor="editor" v-model="personObject.TEXT" :config="editorConfig" Label="Main Bio"></ckeditor>
			</v-flex>
			<v-flex md3 xs12 v-if="selectedPersonType > 1" style="margin-left: 10px;" >
				<v-text-field label="Additional Bio" disabled></v-text-field>
				<ckeditor :editor="editor" v-model="personObject.MOREBIO" :config="editorConfig"></ckeditor>
			</v-flex>
			<v-flex md3 xs12 v-if="selectedPersonType===1" >
				<v-text-field v-model="personObject.YEARSSTRING" label="Fellowship Years, comma separated"></v-text-field>
			</v-flex>
			<v-flex md4 v-if="selectedPersonType===1" >
				<v-simple-table>
					<template v-slot:default>
						<thead>
						<tr>
							<th class="text-left">
								Fellowship Experience - Click to Edit  -- when adding a new Fellow, save the Fellow before adding here.
							</th>
						
						</tr>
						</thead>
						<tbody>
						<tr
								v-for="item in fellowExperienceArray"
								:key="item.ID"
								@click="experienceClick(item.ID)"
						>
							<td>{{ item.EXPERIENCETEXT }}</td>
							<td>{{ item.EXPERIENCEYEAR}}</td>
						</tr>
						</tbody>
					</template>
				</v-simple-table>
				<v-layout row v-if="experienceEdit" >
					<v-flex md-2 offset-3 style="margin-top: 30px;">
						<v-text-field v-model="selectedExperienceObject.EXPERIENCETEXT" style="max-width: 200px;" label="Edit Work"></v-text-field>
						<v-text-field v-model="selectedExperienceObject.EXPERIENCEYEAR" style="max-width: 200px;" label="Edit Year"></v-text-field>
						<v-btn color="blue" @click="updateSelectedExperience">Save Edit</v-btn>
						<v-btn color="red" style="margin-left: 10px;" @click="deleteExperience(selectedExperienceID)">Delete Selected</v-btn>
						<v-btn color="green" style="margin-left: 10px;" @click="clearExperience">Clear</v-btn>
					</v-flex>
				</v-layout>
				<v-layout row v-if="!experienceEdit" >
					<v-flex md-2 offset-3 style="margin-top: 30px;">
						<v-text-field v-model="selectedExperienceObject.EXPERIENCETEXT" style="max-width: 200px;" label="Add Work"></v-text-field>
						<v-text-field v-model="selectedExperienceObject.EXPERIENCEYEAR" style="max-width: 200px;" label="Add Year"></v-text-field>
						<v-btn @click="saveNewExperience()">Save New</v-btn>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-flex md-2>
				<v-btn @click="updatePerson" v-if="editMode" style="margin-top: 15px;" >Save Edits</v-btn>
				<v-btn @click="saveNewPerson" v-if="addMode" style="margin-top: 15px;" >Save New Person</v-btn>
			</v-flex>
		</v-layout>
		
	</v-container>
</template>

<script>

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
	name: "People",
	data: () => ({
		peopleTypes:[],
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		selectedPersonType:0,
		peopleTypeArray:[],
		personArray:[],
		personObject:{},
		fellowExperienceArray:[],
		staffTrusteeFlag:false,
		selectedExperienceArray:[],
		selectedExperienceObject:{},
		experienceEdit:false,
		selectedExperienceID:0,
		personTypeSelected:false,
		addMode:false,
		editMode:false,
		headers: [
			{text: "Name", value: "FELLOWNAME", sortable:true},
			{text: "Type", value: "TYPE",sortable:true},
			{text: "Active", value: "ACTIVE"}
		],
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		},
		
	}),
	methods:{
		addNewPerson(){
			let vm = this;
			vm.addMode = true;
			vm.editMode = false;
			vm.clearPersonObject();
		},
		getPeopleTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getPeopleTypes')
			.then(function (response){
				vm.peopleTypes = response.data.RESULTS;
			})
		},
		registerPersonType(){
			console.log(this.selectedPersonType);
			this.getPeopleTypeArray(this.selectedPersonType);
			this.personTypeSelected = true;
			//this.clearPersonObject();
			
		},
		deleteExperience(experienceID){
			console.log(experienceID);
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=deleteExperience&id=' + experienceID)
			.then(function (response){
				vm.getFellowExperience(vm.personObject.ID);
				vm.experienceEdit = false;
				vm.clearExperience();
			})
			
		},
		
		updateSelectedExperience(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateExperience",
					experienceObject: JSON.stringify(vm.selectedExperienceObject)
				},
				success: function () {
					//vm.editsSaved = true;
					// vm.snackbar = true;
					// vm.getEventsCurrent();
					// vm.editMode = false;
					// vm.clearEventObject();
					vm.getFellowExperience(vm.personObject.ID);
					vm.clearExperience();
					vm.experienceEdit = false;
					// vm.getPeopleTypeArray(vm.selectedPersonType);
					// vm.clearPersonObject();
					
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
		saveNewPerson(){
			let vm = this;
			vm.personObject.PERSONTYPE = vm.selectedPersonType;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewPerson",
					person: JSON.stringify(vm.personObject)
				},
				success: function () {
					//vm.editsSaved = true;
					// vm.snackbar = true;
					// vm.getEventsCurrent();
					// vm.editMode = false;
					// vm.clearEventObject();
					// vm.getFellowExperience(vm.personObject.ID);
					// vm.experienceEdit = false;
					vm.getPeopleTypeArray(vm.selectedPersonType);
					vm.clearPersonObject();
					
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
		experienceClick(id){
			var vm = this;
			vm.selectedExperienceID = id;
			vm.axios.get(vm.dataURL + 'method=getSelectedExperience&id=' + id)
			.then(function (results){
				vm.selectedExperienceArray = results.data.RESULTS;
				vm.selectedExperienceObject = vm.selectedExperienceArray[0];
				vm.experienceEdit = true;
			})
		},
		saveNewExperience(){
			var vm = this;
			vm.selectedExperienceObject.FELLOWID = vm.personObject.ID;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewExperience",
					experienceObject: JSON.stringify(vm.selectedExperienceObject)
				},
				success: function () {
					//vm.editsSaved = true;
					// vm.snackbar = true;
					// vm.getEventsCurrent();
					// vm.editMode = false;
					// vm.clearEventObject();
					vm.getFellowExperience(vm.personObject.ID);
					vm.experienceEdit = false;
					vm.clearExperience();
					
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
		updatePerson(){
			var vm = this;
			vm.personObject.TEXT = vm.personObject.TEXT.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updatePerson",
					person: JSON.stringify(vm.personObject)
				},
				success: function () {
					//vm.editsSaved = true;
					// vm.snackbar = true;
					// vm.getEventsCurrent();
					// vm.editMode = false;
					// vm.clearEventObject();
					// vm.getFellowExperience(vm.personObject.ID);
					// vm.experienceEdit = false;
					vm.getPeopleTypeArray(vm.selectedPersonType);
					vm.clearPersonObject();
					
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
		getPeopleTypeArray(personType){
			let vm = this;
			vm.axios.get(vm.dataURL+ 'method=getPeople&personType=' + personType)
					.then(function (response){
						vm.peopleTypeArray = response.data.RESULTS;
						vm.peopleTypeArray.forEach(function(person){
							if (person.ACTIVE == 1){
								person.ACTIVE = true;
							}else{
								person.ACTIVE = false;
							}
						})
						vm.clearPersonObject();
				})
			
		},
		getFellowExperience(fellowID){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getExperience&id=' + fellowID)
			.then(function (response){
				vm.fellowExperienceArray = response.data.RESULTS;
			})
		},
			handleClick: function(value) {
				var vm = this;
				vm.editMode = true;
				vm.addMode = false;
				vm.experienceEdit = false;
				vm.axios.get(vm.dataURL + 'method=getFellow&id=' + value.ID)
				.then(function (response){
					vm.personArray = response.data.RESULTS;
					vm.personObject = vm.personArray[0];
					vm.personObject.TEXT = vm.personObject.TEXT.replace(/[\u2018\u2019]/g, "'")
							.replace(/[\u201C\u201D]/g, '"');
					if (vm.selectedPersonType === 1){
						vm.getFellowExperience(value.ID);
					}
				})
			},
		clearExperience(){
			this.experienceEdit = false;
			this.selectedExperienceObject.ID = null;
			this.selectedExperienceObject.EXPERIENCEYEAR = '';
			this.selectedExperienceObject.EXPERIENCETEXT = '';
		},
		clearPersonObject(){
			this.personObject.TEXT = '';
			this.personObject.FELLOWNAME = '';
			this.personObject.STATUS = '';
			this.personObject.MOREBIO = '';
			this.personObject.YEARSSTRING = '';
			this.personObject.ACTIVE = false;
			this.personObject.ID = '';
			// this.editMode = false;
			// this.addMode = false;
			this.fellowExperienceArray = [];
			this.selectedExperienceID = {};
		}
	},
	mounted() {
		this.getPeopleTypes();
	}
}
</script>

<style scoped>



</style>
