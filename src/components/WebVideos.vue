<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					Web Videos
				</v-card-title>
				<v-card-text class="justify-center" >
					<v-btn @click="addNewWebVideo">
						Add New Video
					</v-btn>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-container grid-list-md >
			
			<v-data-table
					:headers="headers"
					:items="webVideosArray"
					:items-per-page="500"
					class="elevation-1"
					@click:row="handleClick"
					:dense="true"
			>
				<template v-slot:item.PUBLISH="{ item }">
					<v-simple-checkbox
							v-model="item.PUBLISH"
							disabled
					></v-simple-checkbox>
				</template>
			</v-data-table>
		</v-container>
	</v-layout>
	<v-row>
		<v-col md3 sm12>
			<div class="DashboardContainer hideUPPY" id="uppyHolder" >Add Work Image</div>
		</v-col>
		<v-col md3 sm12>
			<v-text-field v-model="webVideoObject.THUMB" disabled></v-text-field>
		</v-col>
	</v-row><v-row>
	<v-col md3 sm12>
		<div class="DashboardContainer2 hideUPPY" id="uppyHolder2" >Add Video</div>
	</v-col>
	<v-col md3 sm12>
		<v-text-field v-model="webVideoObject.FILENAME" disabled></v-text-field>
	</v-col>
</v-row>
	
	<v-container v-if="editMode">
		<v-layout row>
			<v-flex md3 sm12>
				<v-text-field  label="File Name" v-model="webVideoObject.FILENAME"></v-text-field>
			</v-flex>
			<v-flex md3 sm12 style="margin-left: 10px;">
				<v-text-field  label="Video Label" v-model="webVideoObject.DESCRIPTION"></v-text-field>
			</v-flex>
			<v-flex md2 sm12 style="margin-left: 10px;">
				<v-checkbox label="Publish" v-model="webVideoObject.PUBLISH"></v-checkbox>
			</v-flex>
			<v-flex md2 sm12 style="margin-left: 10px;">
				<v-img style="width:400px;" :src="'https://www.mercecunningham.org/videos/' + webVideoObject.THUMB "></v-img>
			</v-flex>
		</v-layout>
		<v-row>
			<v-col md3 sm12>
				<v-btn @click="saveEdits">Save Edits</v-btn>
			</v-col>
		</v-row>
	</v-container>
	<v-container v-if="addMode">
		<v-layout row>
			<v-flex md3 sm12>
				<v-text-field  label="File Name" v-model="webVideoObject.FILENAME"></v-text-field>
			</v-flex>
			<v-flex md3 sm12 style="margin-left: 10px;">
				<v-text-field  label="Video Label" v-model="webVideoObject.DESCRIPTION"></v-text-field>
			</v-flex>
			<v-flex md2 sm12 style="margin-left: 10px;">
				<v-checkbox label="Publish" v-model="webVideoObject.PUBLISH"></v-checkbox>
			</v-flex>
			<v-flex md2 sm12 style="margin-left: 10px;">
				<v-img style="width:400px;" :src="'https://www.mercecunningham.org/videos/' + webVideoObject.THUMB "></v-img>
			</v-flex>
		</v-layout>
		<v-row>
			<v-col md3 sm12>
				<v-btn @click="saveNewVideo">Save New Video</v-btn>
			</v-col>
		</v-row>
	</v-container>
</v-container>
</template>

<script>
import axios from 'axios'
import router from "@/router";
const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
const XHRUpload = require("@uppy/xhr-upload");
require('@uppy/core/dist/style.css') ;
require('@uppy/dashboard/dist/style.css');


export default {
	name: "WebVideos",
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		webVideosArray: [],
		webVideoArray:[],
		webVideoObject: {},
		editMode:false,
		addMode: false,
		newVideoMode:false,
		headers: [
			{text: "FILENAME", value: "FILENAME",sortable:true},
			{text: "Thumb Image", value: "THUMB",sortable:true},
			{text:"Publish", value:"PUBLISH",sortable:true},
		],
	}),
	methods: {
		saveEdits(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateHomePageVideo",
					webVideoObject: JSON.stringify(vm.webVideoObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.getWebVideos();
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
		saveNewVideo(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewHomePageVideo",
					webVideoObject: JSON.stringify(vm.webVideoObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.getWebVideos();
					vm.addMode = false;
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
		
		getWebVideos(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getWebVideos')
			.then(function(response){
				vm.webVideosArray = response.data.RESULTS;
				vm.webVideosArray.forEach(function(lic){
					if (lic.PUBLISH == 1){
						lic.PUBLISH = true;
					}else{
						lic.PUBLISH = false;
					}
				})
			})
		},
		handleClick : function(value){
			let vm = this;
			axios.get(vm.dataURL + 'method=getSpecificWebVideo&id=' + value.ID)
			.then(function(response){
				vm.editMode = true;
				vm.webVideoArray = response.data.RESULTS;
				vm.webVideoObject = vm.webVideoArray[0];
				var element = document.getElementById("uppyHolder");
				element.classList.remove("hideUPPY")
				element.classList.add("showUPPY");
				var element2 = document.getElementById("uppyHolder2");
				element2 .classList.remove("hideUPPY")
				element2 .classList.add("showUPPY");
			})
		},
		addNewWebVideo(){
			this.addMode = true;
			this.editMode = false;
			this.initWebVideoObject();
			var element = document.getElementById("uppyHolder");
			element.classList.remove("hideUPPY")
			element.classList.add("showUPPY");
			var element2 = document.getElementById("uppyHolder2");
			element2.classList.remove("hideUPPY")
			element2.classList.add("showUPPY");
		},
		initUppy(){
			const uppyLarge = Uppy({ debug: true })
					.use(Dashboard, {
						trigger: ".UppyModalOpenerBtn",
						inline: true,
						target: ".DashboardContainer",
						height: 300
					})
					.use(XHRUpload, {
						endpoint: "/uploadHomePageImages.cfm",
						formData: true,
						fieldName: "fileData"
					});
			
			uppyLarge.on("complete", result => {
				// eslint-disable-next-line
				console.log(
						"Upload complete! We’ve uploaded these files:",
						result.successful
				);
				this.webVideoObject.THUMB = result.successful[0].name;
			});
		},
		initUppy2(){
			const uppyLarge = Uppy({ debug: true })
					.use(Dashboard, {
						trigger: ".UppyModalOpenerBtn",
						inline: true,
						target: ".DashboardContainer2",
						height: 300
					})
					.use(XHRUpload, {
						endpoint: "/uploadHomePageImages.cfm",
						formData: true,
						fieldName: "fileData"
					});
			
			uppyLarge.on("complete", result => {
				// eslint-disable-next-line
				console.log(
						"Upload complete! We’ve uploaded these files:",
						result.successful
				);
				this.webVideoObject.FILENAME = result.successful[0].name;
			});
		},
		initWebVideoObject(){
			this.webVideoObject.THUMB = '';
			this.webVideoObject.PUBLISH = 0;
			this.webVideoObject.FILENAME= '';
			this.webVideoObject.DESCRIPTION = '';
			
		}
	},
	mounted(){
		this.getWebVideos();
		this.initUppy();
		this.initUppy2();
		
	}
}
</script>

<style scoped>
.hideUPPY{display: none;}  .showUPPY{display: inline;}
</style>
