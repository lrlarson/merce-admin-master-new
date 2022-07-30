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
	<div class="selection-buttons">
	<v-card
			class="d-flex justify-center mb-6"
			outlined
			tile
	>
		<v-btn class="d-flex justify-center mb-6" style="margin: 5px 5px 5px 5px" @click="lettersMode=true;messageMode=false;videoMode=false;">Director's Letters</v-btn>
		<v-btn class="d-flex justify-center mb-6" style="margin: 5px 5px 5px 5px" @click="handleShowCaseButton">Home Page Showcase Video Link</v-btn>
		<v-btn class="d-flex justify-center mb-6" style="margin: 5px 5px 5px 5px" @click="handleMessagesButton">Special Announcements</v-btn>
	</v-card>
	</div>
	<div v-if="lettersMode">
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

	<div v-if="letterEditMode">
	<v-row>
		<v-col md2 sm12>
			<v-text-field v-model="letterObject.DATESTRING" label="Date String"></v-text-field>
		</v-col>
		<v-col md2 sm12>
			<v-checkbox v-model="letterObject.PUBLISH" label="Publish"></v-checkbox>
		</v-col>
		<v-col md2 sm12>
			<v-btn color="green" @click="saveLetterEdit">Save Edit</v-btn>
		</v-col>
		<v-col md2 sm12>
			<v-text-field disabled label="Pub.Date"></v-text-field>
			<v-date-picker style="margin-left: 10px;max-height: 50px;" v-model="picker" ></v-date-picker>
		</v-col>
		
	</v-row>
	<v-row>
		<v-col lg10 sm12>
			<v-textarea auto-grow v-model="letterObject.TEXT" label="Text -- Paste from https://wordhtml.com/"></v-textarea>
		</v-col>
		<v-col lg2>
		
		</v-col>
	</v-row>
	</div>
	<div v-if="letterAddMode">
		<v-row>
			<v-col md2 sm12>
				<v-text-field v-model="letterObject.DATESTRING" label="Date String"></v-text-field>
			</v-col>
			<v-col md2 sm12>
				<v-checkbox v-model="letterObject.PUBLISH" label="Publish"></v-checkbox>
			</v-col>
			<v-col md2 sm12>
				<v-btn color="green" @click="saveNewLetter">Save New Letter</v-btn>
			</v-col>
			<v-col md2 sm12>
				<v-text-field disabled label="Pub.Date"></v-text-field>
				<v-date-picker style="margin-left: 10px;max-height: 50px;" v-model="picker" ></v-date-picker>
			</v-col>
		
		</v-row>
		<v-row>
			<v-col lg10 sm12>
				<v-textarea auto-grow v-model="letterObject.TEXT" label="Text -- Paste from https://wordhtml.com/"></v-textarea>
			</v-col>
			<v-col lg2>
			
			</v-col>
		</v-row>
	</div>
	</div><!-- letters area --->
	<div v-if="videoMode">
		<v-row>
		<v-col lg10 sm12 >
			<v-textarea auto-grow v-model="showCaseObject.SHOWCASELINK" label="Vimeo Show Case Link -- Paste In"></v-textarea>
		</v-col>
			<v-col lg2 sm12>
				<v-btn color="green" disabled @click="saveShowCaseEdit">Save Edit</v-btn>
			</v-col>
			<v-col lg2 sm12>
				<div>For the moment, to change the showcase link, please ask Larry. There are issues with saving this link code.</div>
			</v-col>
		</v-row>
	</div>  <!-- video area --->
	<div v-if="messageMode">
		<v-row>
			<v-col md6 sm12>
				<ckeditor :editor="editor" v-model="messageObject.TEXT" :config="editorConfig"></ckeditor>
			</v-col>
		</v-row>
		<v-row>
			<v-col md-2 lg-2 sm-1>
				<v-date-picker v-model="picker2" label="Start Date">Start Date</v-date-picker>
			</v-col>
			<v-col md-2 lg-2 sm-1>
				<v-date-picker v-model="picker3" label="Start Date">End Date</v-date-picker>
			</v-col>
			<v-col md2 sm12>
				<v-checkbox v-model="messageObject.DISPLAY" label="Display"></v-checkbox>
			</v-col>
			<v-col md2 sm12>
				<v-btn color="green" @click="saveMessage">Save</v-btn>
			</v-col>
		</v-row>
	</div> <!-- message area --->
	
	
	
	
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
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default {
	name: "HomePageEditor",
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		letterArray:[],
		singleLetterArray:[],
		letterObject:{},
		headers: [
			{text: "Date String", value: "DATESTRING", sortable:true},
			{text:"Publish", value: 'PUBLISH', sortable: true}
		],
		letterEditMode:false,
		letterAddMode:false,
		picker:null,
		picker2:null,
		picker3:null,
		snackbar: false,
		text:'Saved',
		timeout: 100,
		lettersMode:false,
		videoMode:false,
		messageMode:false,
		showCaseArray:[],
		showCaseObject:{},
		messageAddMode:false,
		messageEditMode:false,
		messagesArray:[],
		messageArray:[],
		messageObject:{},
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		},
		
		
	}),
	methods:{
		getLetters(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getDirectorLetters')
					.then(function (result){
						vm.letterArray = result.data.RESULTS;
					})
		},
		handleMessagesButton(){
			this.lettersMode=false;
			this.messageMode=true;
			this.videoMode=false;
			this.getMessages();
		},
		getMessages(){
			let vm=this;
			axios.get(vm.dataURL + 'method=getAnnouncements')
					.then(function (result){
						vm.messageArray = result.data.RESULTS;
						vm.messageObject = vm.messageArray[0];
						vm.picker2 = vm.messageObject.PUBDATESTART;
						vm.picker3 = vm.messageObject.PUBDATEEND;
					})
		},
		handleShowCaseButton(){
			this.lettersMode=false;
			this.messageMode=false;
			this.videoMode=true;
			this.getShowCaseArray();
		} ,
		handleClick(value){
			console.log(value.ID);
			let vm=this;
			axios.get(vm.dataURL + 'method=getLetter&letterID=' + value.ID)
					.then(function (result){
						vm.singleLetterArray = result.data.RESULTS;
						vm.letterObject = vm.singleLetterArray[0];
						vm.picker = vm.letterObject.PUBDATE;
						vm.letterEditMode=true;
					})
		},
		addNewLetterForm(){
			this.letterAddMode=true;
			this.letterEditMode=false;
			this.letterObject.DATESTRING='';
			this.letterObject.ID = null;
			this.letterObject.PUBDATE = null;
			this.letterObject.PUBLISH = 0;
			this.letterObject.TEXT = '';
			this.picker = null;
			
		},
		saveMessage() {
			let vm=this;
			vm.messageObject.PUBDATESTART = vm.picker2;
			vm.messageObject.PUBDATEEND = vm.picker3;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "editMessage",
					messageObject: JSON.stringify(vm.messageObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.messageMode = false;
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
		saveLetterEdit(){
			let vm=this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "editLetter",
					letterObject: JSON.stringify(vm.letterObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.letterEditMode = false;
					vm.getLetters();
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
		saveNewLetter(){
			let vm=this;
			vm.letterObject.PUBDATE = vm.picker;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "saveNewLetter",
					letterObject: JSON.stringify(vm.letterObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.letterAddMode = false;
					vm.getLetters();
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
		saveShowCaseEdit(){
			let vm=this;
			console.log(vm.showCaseObject);
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateShowcaseLink",
					showCaseObject: JSON.stringify(vm.showCaseObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.videoMode = false;
					vm.showCaseObject.SHOWCASELINK = '';
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
		getShowCaseArray(){
			let vm=this;
			axios.get(vm.dataURL + 'method=getShowCaseLink')
					.then(function (result){
						vm.showCaseArray = result.data.RESULTS;
						vm.showCaseObject = vm.showCaseArray[0];
					})
		}
		
	},
	
	mounted() {
		this.getLetters();
		this.getShowCaseArray();
	}
	
	
}
</script>

<style scoped>

</style>
