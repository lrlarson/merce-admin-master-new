<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					CLASSES
				</v-card-title>
				<v-card-text class="justify-center" >
					<v-btn @click="addNewClass">
						Add New Class
					</v-btn>
					<v-btn @click="getRateMessage" style="margin-left:10px;">
						Set/Edit Rate Message
					</v-btn>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-container grid-list-md >
			
			<v-data-table
					:headers="headers"
					:items="classes"
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
			<v-date-picker
			v-model="picker">
			</v-date-picker>
		</v-col>
		<v-col md-2 lg-2>
			<v-text-field
			v-model="classObject.CLASSDATETIMESTRING" label="Date/Time Text"></v-text-field>
		</v-col>
		<v-col md-2 lg-2>
			<v-text-field
					v-model="classObject.CLASSLOCATION" label="Location"></v-text-field>
		</v-col>
		<v-col md-2 lg-2>
			<v-text-field
					v-model="classObject.CLASSTEACHER" label="Teacher"></v-text-field>
		</v-col>
	</v-row>
	<v-row>
		<v-col md-2 lg-2>
		<v-select
				label="Class Type"
				v-model="classObject.CLASSTYPEID"
				:items="classTypes"
				item-text="CLASSTYPE"
				item-value="ID"
		></v-select>
		</v-col>
		<v-col md-2 lg-2>
			<v-text-field
					v-model="classObject.CLASSTITLE" label="Class Title"></v-text-field>
		</v-col>
		<v-col md-2 lg-2>
			<v-select
					label="Class Teacher"
					v-model="classObject.CLASSTEACHERID"
					:items="classTeachersArray"
					item-text="FELLOWNAME"
					item-value="ID"
			></v-select>
		</v-col>
	</v-row>
	<v-row>
		<v-col md-2 lg-2>
			<v-btn v-if="editMode" color="green" @click="saveClassEdits">Save Class Edits</v-btn>
		</v-col>
		<v-col md-2 lg-2>
			<v-btn v-if="newClassMode"  color="blue" @click="saveNewClass">Save New Class</v-btn>
		</v-col>
		<v-col md-2 lg-2>
			<v-btn color="red" v-if="editMode" @click="deleteClass">Delete Selected Class</v-btn>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import axios from 'axios'
import router from "@/router";
export default {
	name: "Classes",
	components: {

	},
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		classes: [],
		class:[],
		classObject:{},
		classTypes:[],
		editMode:false,
		newClassMode:false,
		classTeachersArray:[],
		picker: new Date().toISOString().substr(0, 10),
		headers: [
			{
				text: "Class Date",
				value: "CLASSDATE",
				sortable:true
			},
			
			{text: "Classe Teacher", value: "CLASSTEACHER"},
			{text: "Classe Type", value: "CLASSTYPE",sortable:true},
			{text:"Week", value:"WEEK"},
		
		
		],
	}),
	methods: {
		
		getRateMessage(){
			router.push({name:'ClassRateMessage'});
		},
		getClasses() {
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getClasses')
			.then(function (result){
				vm.classes = result.data.RESULTS;
			})
		},
		getClassTeachers(){
			var vm= this;
			vm.axios.get(vm.dataURL + 'method=getTeachers')
					.then(function(result){
						vm.classTeachersArray = result.data.RESULTS;
					})
		},
		getClassDetails(id){
			var vm= this;
			vm.axios.get(vm.dataURL + 'method=getClass&id=' + id)
			.then(function (result){
				vm.class = result.data.RESULTS;
				vm.classObject = vm.class[0];
				vm.picker = vm.classObject.CLASSDATE;
				vm.editMode = true;
				vm.newClassMode = false;
			})
		},
		handleClick: function(value) {
			this.getClassDetails(value.ID);
			this.editMode = true;
		},
		getClassTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getClassTypes')
			.then(function (result){
				vm.classTypes = result.data.RESULTS;
			})
		},
		addNewClass(){
			this.editMode = false;
			this.newClassMode = true;
			this.picker = new Date().toISOString().substr(0, 10);
			this.classObject.CLASSDATE = '';
			this.classObject.CLASSDATETIMESTRING='';
			this.classObject.CLASSLOCATION='';
			this.classObject.CLASSTEACHER='';
			this.classObject.CLASSTITLE='';
			this.classObject.CLASSTYPEID=0;
		},
		createClassObjects(){
			this.classObject.CLASSDATE='';
			this.classObject.CLASSDATETIMESTRING='';
			this.classObject.CLASSLOCATION='';
			this.classObject.CLASSTEACHER='';
			this.classObject.CLASSTITLE='';
		},
		clearClassObjects(){
			this.classObject.CLASSDATE='';
			this.classObject.CLASSDATETIMESTRING='';
			this.classObject.CLASSLOCATION='';
			this.classObject.CLASSTEACHER='';
			this.classObject.CLASSTITLE='';
			this.classObject.ID = '';
			this.picker = new Date().toISOString().substr(0, 10);
		},
		saveNewClass(){
			var vm = this;
			vm.classObject.CLASSDATE = vm.picker;
			window.$.ajax({
				type: "post",
				url: "https://johncage.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewClass",
					classObject: JSON.stringify(vm.classObject)
				},
				success: function () {
					console.log('success');
					vm.getClasses();
					vm.clearClassObjects();
					vm.newClassMode = false;
					
					
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
			
			window.$.ajax({
				type: "post",
				url: "https://johncage.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateClass",
					classObject: JSON.stringify(vm.classObject)
				},
				success: function () {
					console.log('success');
					vm.getClasses();
					vm.clearClassObjects();
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
		deleteClass(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=deleteClass&id=' + vm.classObject.ID)
					.then(function (){
						vm.getClasses();
						vm.clearClassObjects();
						vm.editMode = false;
					})
		}
	},
	mounted() {
		this.getClasses();
		this.getClassTypes();
		this.createClassObjects();
		this.getClassTeachers();
	}
}
</script>

<style scoped>

</style>
