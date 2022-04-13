<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					EVENTS
				</v-card-title>
				<v-card-text class="justify-center" >
					<v-btn @click="addEvent">
						Add New Event
					</v-btn>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-container grid-list-md >
			
			<v-data-table
					:headers="headers"
					:items="eventArray"
					:items-per-page="500"
					class="elevation-1"
					@click:row="handleClick"
					:dense="false"
			>
			</v-data-table>
		</v-container>
	</v-layout>
	<v-row>
		<v-col md-2 lg-2 sm-1>
			<v-date-picker v-model="picker" label="Start Date">Start Date</v-date-picker>
		</v-col>
		<v-col md-2 lg-2 sm-1>
			<v-date-picker v-model="picker2" label="Start Date">End Date</v-date-picker>
		</v-col>
		<v-col md-4 sm-1>
			<ckeditor :editor="editor" v-model="eventObject.EVENTDESCRIPTION" :config="editorConfig"></ckeditor>
		</v-col>
	</v-row>
	<v-row>
		<v-col md-3>
			<v-text-field v-model="eventObject.EVENTNAME" label="Event Name"></v-text-field>
		</v-col>
		<v-col md-3>
			<v-text-field v-model="eventObject.EVENTWEB" label="Events URL"></v-text-field>
		</v-col>
		<v-col md-3>
			<v-text-field v-model="eventObject.EVENTLOCATION" label="Location"></v-text-field>
		</v-col>
	</v-row>
	<v-row>
		<v-col md-3>
			<v-text-field v-model="eventObject.EVENTDATESTRING" label="DateTime String"></v-text-field>
		</v-col>
		<v-col md-3>
			<v-select
					label="Event Type"
					:items="eventTypes"
					item-text="LABEL"
					item-value="DATA"
					placeholder="Event Type"
					v-model="eventObject.EVENTTYPE"
			></v-select>
		</v-col>
		<v-col md-2>
			<v-text-field v-model="eventObject.DISPLAYORDER" label="HP Display Order"></v-text-field>
		</v-col>
		<v-col md-2>
			<v-checkbox v-model="eventObject.EVENTPUBLISH" label="Publish"></v-checkbox>
		</v-col>
	</v-row>
	<v-row>
		<v-col md-2>
			<div class="DashboardContainer">Event Image</div>
		</v-col>
		<v-col m-2>
			<v-text-field v-model="eventObject.EVENTIMAGE" disabled></v-text-field>
			<v-text-field v-model="eventObject.EVENTIMAGECREDIT" label="Image Credit"></v-text-field>
			<v-btn v-if="editMode" color="green" @click="updateEvent" > Save Edits </v-btn> <br />
			<v-btn v-if="newEventMode" color="grey" @click="saveNewEvent" style="margin-top: 5px;" > Save New Event </v-btn>  <br />
			<v-btn v-if="editMode"  color="red" style="margin-top: 5px;" @click="deleteEvent(eventObject.ID)" > Delete Event</v-btn>  <br />
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
//import router from "@/router";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
const XHRUpload = require("@uppy/xhr-upload");
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
export default {
	name: "EventsEditor",
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		eventArray:[],
		specificEventArray:[],
		eventObject:{},
		snackbar: false,
		text: `Saved`,
		timeout: 1000,
		picker: new Date().toISOString().substring(0,10),
		picker2: new Date().toISOString().substring(0,10),
		eventTypes:[],
		editMode:false,
		newEventMode:false,
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		},
		headers: [
			{text: "Event Location", value: "EVENTLOCATION", sortable:true},
			{text: "Start Date", value: "EVENTSTARTDATE",sortable:true},
			{text: "End Date", value: "EVENTENDDATE"},
			{text:"Date String", value:"EVENTDATESTRING"},
			{text:"Event Name", value:"EVENTNAME"},
			{text:"HP Display Order", value: "DISPLAYORDER"}
		],
	}),
	methods: {
		getEventsCurrent(){
			console.log('in get events')
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getCurrentEvents')
					.then(function(response){
						vm.eventArray = response.data.RESULTS;
					})
		},
		addEvent(){
			var vm = this;
			vm.clearEventObject();
			vm.newEventMode = true;
			vm.editMode = false;
		},
		handleClick: function(value) {
			this.getEventDetails(value.ID);
			this.editMode = true;
		},
		getEventsTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getEventTypes')
			.then(function(response){
				vm.eventTypes = response.data.RESULTS;
			})
		},
		getEventDetails(event_ID){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getSpecificEvent&event_ID=' + event_ID)
			.then(function(response){
				vm.specificEventArray = response.data.RESULTS;
				vm.eventObject = vm.specificEventArray[0];
				vm.picker = vm.eventObject.EVENTSTARTDATE;
				vm.picker2 = vm.eventObject.EVENTENDDATE;
			})
		},
		updateEvent() {
			let vm = this;
			vm.eventObject.EVENTSTARTDATE = vm.picker;
			vm.eventObject.EVENTENDDATE = vm.picker2;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateEvent",
					eventObject: JSON.stringify(vm.eventObject)
				},
				success: function () {
					//vm.editsSaved = true;
					vm.snackbar = true;
					vm.getEventsCurrent();
					vm.editMode = false;
					vm.clearEventObject();
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
		saveNewEvent(){
			let vm = this;
			vm.eventObject.EVENTSTARTDATE = vm.picker;
			vm.eventObject.EVENTENDDATE = vm.picker2;
			if (!vm.eventObject.DISPLAYORDER){
				vm.eventObject.DISPLAYORDER = 0;
			}
			if (!vm.eventObject.EVENTTYPE) {
				alert('Must Select an Event Type');
				return;
			}
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "createNewEvent",
					eventObject: JSON.stringify(vm.eventObject)
				},
				success: function () {
					//vm.editsSaved = true;
					console.log('in success')
					vm.getEventsCurrent();
					vm.newEventMode = false;
					vm.clearEventObject();
					vm.snackbar = true;
					//vm.picker = new Date().toISOString().substring(0,10);
					//vm.picker2 = new Date().toISOString().substring(0,10);
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
		deleteEvent(ID){
			var vm = this;
			vm.axios(vm.dataURL + 'method=deleteEvent&ID=' + ID)
			.then(function (response){
				vm.getEventsCurrent();
				vm.editMode = false;
				vm.clearEventObject();
				vm.picker = new Date().toISOString().substring(0,10);
				vm.picker2 = new Date().toISOString().substring(0,10);
			})
		},
		clearEventObject(){
			console.log('in clearEventObject ')
			this.eventObject.EVENTNAME = '';
			this.eventObject.EVENTTYPE = '';
			this.eventObject.EVENTSTARTDATE = null;
			this.eventObject.EVENTENDDATE = null;
			this.eventObject.EVENTDATESTRING = '';
			this.eventObject.EVENTDESCRIPTION = '';
			this.eventObject.EVENTLOCATION = '';
			this.eventObject.EVENTPUBLISH = false;
			this.eventObject.EVENTWEB = '';
			this.eventObject.EVENTIMAGECREDIT = '';
			this.eventObject.EVENTIMAGE = '';
			this.eventObject.DISPLAYORDER = '';
			console.log('finish clearEventObject ')
		}
	},
	mounted() {
		this.clearEventObject();
		this.getEventsCurrent();
		this.getEventsTypes();
		const uppyLarge = Uppy({ debug: true })
				.use(Dashboard, {
					trigger: ".UppyModalOpenerBtn",
					inline: true,
					target: ".DashboardContainer",
					height: 300
				})
				.use(XHRUpload, {
					endpoint: "/images/danceImagesUpload/uploadeventimages.cfm",
					formData: true,
					fieldName: "fileData"
				});
		
		uppyLarge.on("complete", result => {
			// eslint-disable-next-line
			console.log(
					"Upload complete! We’ve uploaded these files:",
					result.successful
			);
			this.eventObject.EVENTIMAGE = result.successful[0].name;
		});
	}
}
</script>

<style scoped>

</style>
