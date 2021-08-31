<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					MEDIA
				</v-card-title>
				<v-card-text class="justify-center" >
					<v-col  class="d-flex"
									cols="12"
									sm="6">
						<v-select
								label="Select Media Type"
								:items="mediaTypeArray"
								item-text="MEDIATYPE"
								item-value="ID"
								placeholder="Media Type"
								v-model="selectedMediaType"
								@change="registerMediaType"
						></v-select>
						<div v-if="mediaTypeSelected">
						<v-btn style="margin-left: 15px;"  v-if="!newMediaElement" @click="addNewMediaElement">
							Add New Media Element
						</v-btn>
						<v-btn style="margin-left: 15px;"  v-if="newMediaElement" @click="exitNewMediaElement">
							Exit New Media Element Mode
						</v-btn>
						</div>
					</v-col>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	<v-row>
		<v-col>
			<v-data-table
					:headers="headers"
					:items="mediaOverviewArray"
					:items-per-page="500"
					class="elevation-1"
					@click:row="handleClick"
					:dense="true"
			>  <template v-slot:item.PUBLISH="{ item }">
				<v-simple-checkbox
						v-model="item.PUBLISH"
						disabled
				></v-simple-checkbox>
			</template>
			</v-data-table>
		</v-col>
	</v-row>
	<div v-if="editMode">
	<v-layout row wrap>
		<v-flex class="d-flex justify-center mb-6" style="font-size: x-large;margin-top: 10px;">
			Common Media Data
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-flex md5 xs12>
			<v-text-field v-model="mediaOverviewDetailObject.TITLE" label="Title"></v-text-field>
		</v-flex>
<!--		<v-flex md2 xs12 style="margin-left: 10px;">-->
<!--			<v-select-->
<!--					label="Media Type"-->
<!--					:items="mediaTypeArray"-->
<!--					item-text="MEDIATYPE"-->
<!--					item-value="ID"-->
<!--					placeholder="Media Type"-->
<!--					v-model="mediaOverviewDetailObject.MEDIATYPE"-->
<!--			></v-select>-->
<!--		</v-flex>-->
			<v-flex md2 xs12>
				<v-checkbox v-model="mediaOverviewDetailObject.PUBLISH" label="Show on Web"></v-checkbox>
			</v-flex>
	</v-layout>
	
	
	<v-layout row wrap>
		<v-flex md4 xs12 >
			<v-text-field label="Short Description" disabled></v-text-field>
			<ckeditor :editor="editor" v-model="mediaOverviewDetailObject.SHORTDESCRIPTION" :config="editorConfig" Label="Short Description"></ckeditor>
		</v-flex>
		<v-flex  md1 xs12 >
			<v-text-field label="Year" v-model="mediaOverviewDetailObject.YEARTEXT">
			</v-text-field>
		</v-flex>
<!--		<v-flex md4 xs12 style="margin-left: 10px;">-->
<!--			<div class="DashboardContainer">Add Thumb Image</div>-->
<!--		</v-flex>-->
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-text-field label="Current Thumb" v-model="mediaOverviewDetailObject.THUMBNAIL" disabled>
			</v-text-field>
		</v-flex>
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-img :src="'https://www.mercecunningham.org/images/danceimagesupload/mediaimages/' + mediaOverviewDetailObject.THUMBNAIL ">
			</v-img>
		</v-flex>
	</v-layout>
	</div>
		<v-layout row wrap>
			<v-flex md4 offset-md4 xs12 style="margin-left: 10px; margin-top: 10px; margin-bottom: 10px;">
				<div class="DashboardContainer hideUPPY" id="uppyHolder" >Add Thumb Image</div>
			</v-flex>
		</v-layout>
	<div v-if="editMode">
	<v-layout row wrap>
		<v-flex md3 xs1>
			<v-text-field label="Media Link" v-model="mediaOverviewDetailObject.ASSETURL"></v-text-field>
		</v-flex>
		</v-layout>
		<v-layout row wrap>
		<v-flex v-if="!newMediaElement" md5 xs12>
			<v-simple-table>
				<template v-slot:default>
<!--					<thead>-->
<!--					<tr>-->
<!--						<th class="text-left">-->
<!--							Distributors-->
<!--						</th>-->
<!--					-->
<!--					</tr>-->
<!--					</thead>-->
					<tbody>
					<tr>
						<td><em>Distributor</em></td>
						<td><em>Link</em></td>
					</tr>
					<tr
							v-for="item in distributorArray"
							:key="item.ID"
							@click="distributorClick(item.ID)"
					>
						<td>{{ item.DISTRIBUTORNAME }}</td>
						<td>{{ item.DISTIBUTORLINK}}</td>
					</tr>
					</tbody>
				</template>
			</v-simple-table>
				<v-layout row v-if="editDistributor">
					<v-flex md-2 offset-3 style="margin-top: 30px;">
						<v-text-field v-model="selectedDistributorObject.DISTRIBUTORNAME" style="max-width: 200px;" label="Edit Name"></v-text-field>
						<v-text-field v-model="selectedDistributorObject.DISTIBUTORLINK" style="max-width: 500px;" label="Edit Link"></v-text-field>
						
						
						<v-btn color="blue" @click="updateSelectedDistributor">Save Distributor Edit</v-btn>
						<v-btn color="red" style="margin-left: 10px;" @click="deleteSelectedDistributor" >Delete Selected</v-btn>
						<v-btn color="green" style="margin-left: 10px;" @click="clearDistributor">Clear</v-btn>
	<!--				-->
					</v-flex>
				</v-layout>
			<v-layout row v-else>
				<v-flex md-2 offset-3 style="margin-top: 30px;">
					<v-text-field v-model="selectedDistributorObject.DISTRIBUTORNAME" style="max-width: 200px;" label="Edit Name"></v-text-field>
					<v-text-field v-model="selectedDistributorObject.DISTIBUTORLINK" style="max-width: 500px;" label="Edit Link"></v-text-field>
					
					<v-btn color="blue" @click="createDistributor">Save New Distributor</v-btn>
					<!--				-->
				</v-flex>
			</v-layout>
		</v-flex>
	</v-layout>
	<v-layout row wrap>
		<v-flex md-2 offset-3 style="margin-top: 30px;">
			<div v-if="!newMediaElement">
			<v-btn color="green" v-if="editMode" @click="updateMediaOverview">Save Media Overview Edits</v-btn>
			</div>
			<v-btn color="blue" v-if="newMediaElement" @click="insertNewMediaOverview">Save New Media Overview</v-btn>
		</v-flex>
	</v-layout>
	<v-layout row wrap align-center v-if="mediaTypeSelected">
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" style="font-size: x-large;margin-top: 5px; margin-bottom: 5px;" >
				{{ mediaTypeLabel}} Details
			</v-card-title>
		</v-card>
		</v-flex>
	</v-layout>
		<div v-if="!newMediaElement">
<!--	BEGIN VIDEO DETAIL-->
	<div v-if="selectedMediaType===1">
	<v-layout row wrap  style="margin-top: 10px;">
		<v-flex md2 xs12 style="margin-left: 10px;">
			<v-select label="Color-BW"
								:items="colorTypes"
								item-text="LABEL"
								item-value="DATA"
								placeholder="Media Type"
								v-model="videoDetailsObject.COLORCODE">
			</v-select>
	</v-flex >
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-text-field v-model="videoDetailsObject.DIRECTOR" label="Director"></v-text-field>
		</v-flex>
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-text-field v-model="videoDetailsObject.LENGTHSTRING" label="LengthString"></v-text-field>
		</v-flex>
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-text-field v-model="videoDetailsObject.LENGTH" label="Length as Integer"></v-text-field>
		</v-flex>
		<v-flex  md2 xs12 style="margin-left: 10px;">
			<v-text-field v-model="videoDetailsObject.PRODUCER" label="Producer"></v-text-field>
		</v-flex>
</v-layout>
		<v-layout row wrap  style="margin-top: 10px;">
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-select label="Video Type"
									:items="videoTypes"
									item-text="LABEL"
									item-value="DATA"
									placeholder="Video Type"
									v-model="videoDetailsObject.VIDEOTYPE">
				</v-select>
			</v-flex >
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-text-field v-model="videoDetailsObject.DISTRIBUTOR" label="Distributor"></v-text-field>
			</v-flex>
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-text-field v-model="videoDetailsObject.MUSIC" label="Music"></v-text-field>
			</v-flex>
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-text-field v-model="videoDetailsObject.MUSICIANS" label="Musicians"></v-text-field>
			</v-flex>
		</v-layout>
		<v-layout row wrap  style="margin-top: 10px;">
			<v-flex md4 xs12 style="margin-left: 10px;">
				<v-text-field label="Description" disabled></v-text-field>
				<ckeditor :editor="editor" v-model="videoDetailsObject.DESCRIPTION" :config="editorConfig" Label="Short Description"></ckeditor>
			</v-flex>
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-btn color="green" @click="updateVideoDetails">Save Video Detail Edits</v-btn>
			</v-flex>
		</v-layout>
	</div>
<!--	END VIDEO DETAIL-->
	<!--	BEGIN BOOK DETAIL-->
	<div v-if="selectedMediaType===2">
		<v-layout row wrap  style="margin-top: 10px;">
			<v-flex md3 xs12 style="margin-left: 10px;">
				<v-text-field v-model="bookDetailObject.AUTHOR" label="Author"></v-text-field>
			</v-flex>
			<v-flex md3 xs12 style="margin-left: 10px;">
				<v-text-field v-model="bookDetailObject.PUBLISHER" label="Publisher"></v-text-field>
			</v-flex>
			
		</v-layout>
		<v-layout row wrap  style="margin-top: 10px;">
			<v-flex md6 xs12 style="margin-left: 10px;">
				<v-text-field label="Description" disabled></v-text-field>
				<ckeditor :editor="editor" v-model="bookDetailObject.DESCRIPTIONS" :config="editorConfig" Label="Description"></ckeditor>
			</v-flex>
			<v-flex md2 xs12 style="margin-left: 10px;">
				<v-btn color="green" @click="updateBookDetails">Save Book Detail Edits</v-btn>
			</v-flex>
		</v-layout>
	</div>
	<!--	END BOOK DETAIL-->
		<!--	BEGIN ARTICLE DETAIL-->
		<div v-if="selectedMediaType===3">
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md3 xs12 style="margin-left: 10px;">
					<v-text-field v-model="articleDetailObject.AUTHOR" label="Author"></v-text-field>
				</v-flex>
				<v-flex md3 xs12 style="margin-left: 10px;">
					<v-text-field v-model="articleDetailObject.PUBLICATION" label="Publication"></v-text-field>
				</v-flex>
			
			</v-layout>
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md6 xs12 style="margin-left: 10px;">
					<v-text-field label="Description" disabled></v-text-field>
					<ckeditor :editor="editor" v-model="articleDetailObject.DESCRIPTION" :config="editorConfig" Label="Description"></ckeditor>
				</v-flex>
				<v-flex md2 xs12 style="margin-left: 10px;">
					<v-btn color="green" @click="updateArticleDetails">Save Article Detail Edits</v-btn>
				</v-flex>
			</v-layout>
		</div>
		<!--	END ARTICLE DETAIL-->
		<!--	BEGIN WRITING DETAIL-->
		<div v-if="selectedMediaType===5">
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field label="Text" disabled></v-text-field>
					<ckeditor :editor="editor" v-model="writingDetailsObject.TEXT" :config="editorConfig" Label="Text"></ckeditor>
				</v-flex>
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field label="Description" disabled></v-text-field>
					<ckeditor :editor="editor" v-model="writingDetailsObject.DESCRIPTION" :config="editorConfig" Label="Description"></ckeditor>
				</v-flex>
			</v-layout>
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md6 xs12 style="margin-left: 10px;">
					<v-text-field v-model="writingDetailsObject.PUBLICATION" label="Publication"></v-text-field>
				</v-flex>
				<v-flex md2 xs12 style="margin-left: 10px;">
					<v-btn color="green" @click="updateWritingDetails">Save Writing Detail Edits</v-btn>
				</v-flex>
			</v-layout>
		</div>
		<!--	END WRITING DETAIL-->
		<!--	BEGIN OTHER DETAIL-->
		<div v-if="selectedMediaType===6">
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field label="Text" disabled></v-text-field>
					<ckeditor :editor="editor" v-model="otherDetailsObject.TEXT" :config="editorConfig" Label="Text"></ckeditor>
				</v-flex>
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field label="Description" disabled></v-text-field>
					<ckeditor :editor="editor" v-model="otherDetailsObject.DESCRIPTION" :config="editorConfig" Label="Description"></ckeditor>
				</v-flex>
			</v-layout>
			<v-layout row wrap  style="margin-top: 10px;">
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field v-model="otherDetailsObject.AUTHOR" label="Author"></v-text-field>
				</v-flex>
				<v-flex md4 xs12 style="margin-left: 10px;">
					<v-text-field v-model="otherDetailsObject.PUBLICATION" label="Publication"></v-text-field>
				</v-flex>
				<v-flex md2 xs12 style="margin-left: 10px;">
					<v-btn color="green" @click="updateOtherDetails">Save Other Detail Edits</v-btn>
				</v-flex>
			</v-layout>
		</div>
		<!--	END OTHER DETAIL-->
		</div>
	</div>
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

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
// import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
// import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
const XHRUpload = require("@uppy/xhr-upload");
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
export default {
	name: "Media",
	data:() => ({
		
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		mediaOverviewArray: [],
		mediaOverviewDetailArray: [],
		mediaOverviewDetailObject: {},
		mediaTypeArray:[],
		selectedMediaType:0,
		mediaTypeSelected:false,
		editMode:false,
		addMode:false,
		distributorArray:[],
		selectedDistributorObject:{},
		editDistributor:false,
		mediaTypeLabel:'',
		videoDetailsArray:[],
		videoDetailsObject:{},
		colorTypes:[],
		snackbar: false,
		text:'Saved',
		timeout: 1000,
		videoTypes:[],
		bookDetailArray:[],
		bookDetailObject:{},
		articleDetailArray:[],
		articleDetailObject:{},
		writingDetailsArray:[],
		writingDetailsObject:{},
		otherDetailsArray:[],
		otherDetailsObject:{},
		newMediaElement:false,
		
		headers: [
			{
				text: "Media Title",
				value: "TITLE",
				sortable:true
			},
			
			{text: "Media Type", value: "MEDIATYPE"},
			{text: "Publish", value: "PUBLISH"},
		
		],
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		},
		plugins:{

		},
		
	}),
	methods: {
		getMediaOverview(mediaType){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getMediaOverview&media=' + mediaType)
			.then(function (result){
				vm.mediaOverviewArray = result.data.RESULTS;
				vm.mediaOverviewArray.forEach(function(mediaElement){
					if (mediaElement.PUBLISH == 1){
						mediaElement.PUBLISH = true;
					}else{
						mediaElement.PUBLISH = false;
					}
				})
			})
		},
		clearMediaObject(){
			this.mediaOverviewDetailObject.TITLE = '';
			this.mediaOverviewDetailObject.ASSETURL = '';
			this.mediaOverviewDetailObject.PUBLISH = 0;
			this.mediaOverviewDetailObject.SHORTDESCRIPTION = '';
			this.mediaOverviewDetailObject.THUMBNAIL = '';
			this.mediaOverviewDetailObject.YEARTEXT = '';
			this.mediaOverviewDetailObject.ID = 0;
			this.mediaOverviewDetailObject.LINK_STATUS = '';
		},
		exitNewMediaElement(){
			this.newMediaElement = false;
		},
		addNewMediaElement(){
			this.newMediaElement = true;
			this.clearMediaObject();
			this.handleClick();
		},
		updateMediaOverview(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateMediaOverview",
					mediaOverview: JSON.stringify(vm.mediaOverviewDetailObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.editMode = false;
					// vm.clearMediaObject();
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
		insertNewMediaOverview(){
			let vm = this;
			vm.mediaOverviewDetailObject.MEDIATYPE = vm.selectedMediaType;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewMediaOverview",
					mediaOverview: JSON.stringify(vm.mediaOverviewDetailObject)
				},
				success: function (data) {
					console.log(data["DATA"][0]);
					vm.snackbar = true;
					vm.editMode = false;
					vm.newMediaElement = false;
					vm.registerMediaType();
					// Prepare Each Detail Section by creating stub     //
					switch (vm.selectedMediaType) {
						case 1: {
							vm.axios.get(vm.dataURL + 'method=insertVideoOverviewStub&mediaSummary_ID=' + data["DATA"][0] + '&mediaType_ID=' + vm.selectedMediaType);
							break;
						}
						case 2: {
							vm.axios.get(vm.dataURL + 'method=insertBookOverviewStub&mediaSummary_ID=' + data["DATA"][0] + '&mediaType_ID=' + vm.selectedMediaType);
							break;
						}
						case 3: {
							vm.axios.get(vm.dataURL + 'method=insertArticleOverviewStub&mediaSummary_ID=' + data["DATA"][0] + '&mediaType_ID=' + vm.selectedMediaType);
							break;
						}
						case 5: {
							vm.axios.get(vm.dataURL + 'method=insertWritingOverviewStub&mediaSummary_ID=' + data["DATA"][0] + '&mediaType_ID=' + vm.selectedMediaType);
							break;
						}
						case 6: {
							vm.axios.get(vm.dataURL + 'method=insertOtherOverviewStub&mediaSummary_ID=' + data["DATA"][0] + '&mediaType_ID=' + vm.selectedMediaType);
							break;
						}
					}
					
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
		updateVideoDetails(){
			let vm = this;
			vm.videoDetailsObject.DESCRIPTION = vm.videoDetailsObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateVideoDetails",
					videoDetailObject: JSON.stringify(vm.videoDetailsObject)
				},
				success: function () {
					vm.snackbar = true;
					//vm.editMode = false;
					// vm.clearMediaObject();
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
		updateBookDetails(){
			let vm = this;
			vm.bookDetailObject.DESCRIPTION = vm.bookDetailObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateBookDetails",
					bookDetailObject: JSON.stringify(vm.bookDetailObject)

				},
				success: function () {
					vm.snackbar = true;
					//vm.editMode = false;
					// vm.clearMediaObject();
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
		updateArticleDetails(){
			let vm = this;
			vm.articleDetailObject.DESCRIPTION = vm.articleDetailObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateArticleDetails",
					articleDetailObject: JSON.stringify(vm.articleDetailObject)
				},
				success: function () {
					vm.snackbar = true;
					//vm.editMode = false;
					// vm.clearMediaObject();
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
		updateWritingDetails(){
			let vm = this;
			// alert(vm.writingDetailsObject.TEXT) ;
			vm.writingDetailsObject.TEXT = vm.writingDetailsObject.TEXT.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			vm.writingDetailsObject.DESCRIPTION = vm.writingDetailsObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
					.replace(/[\u201C\u201D]/g, '"');
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateWritingDetails",
					writingDetailObject: JSON.stringify(vm.writingDetailsObject)
				},
				success: function () {
					vm.snackbar = true;
					//vm.editMode = false;
					// vm.clearMediaObject();
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
		updateOtherDetails(){
			let vm = this;
			// alert(vm.writingDetailsObject.TEXT) ;
			
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateOtherDetails",
					otherDetailsObject: JSON.stringify(vm.otherDetailsObject)
				},
				success: function () {
					vm.snackbar = true;
					//vm.editMode = false;
					// vm.clearMediaObject();
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
		getMediaTypes(){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getMediaTypes')
			.then(function (result){
				vm.mediaTypeArray = result.data.RESULTS;
			})
		},
		updateSelectedDistributor(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateDistributorRecord",
					selectedDistributorObject: JSON.stringify(vm.selectedDistributorObject)
				},
				success: function () {
					vm.getDistibutorsForMedia();
					vm.editDistributor = false;
					vm.clearDistributor();
					
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
		createDistributor(){
			let vm = this;
			vm.selectedDistributorObject.MEDIAOBJECT = vm.mediaOverviewDetailObject.ID;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "addDistributorRecord",
					selectedDistributorObject: JSON.stringify(vm.selectedDistributorObject)
				},
				success: function () {
					vm.getDistibutorsForMedia();
					vm.editDistributor = false;
					vm.clearDistributor();
					
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
		deleteSelectedDistributor(){
			let vm = this;
			vm.axios.get(vm.dataURL +'method=deleteDistRecord&id=' + vm.selectedDistributorObject.ID )
			.then(function (result){
				vm.getDistibutorsForMedia();
				vm.clearDistributor();
			})
		},
		registerMediaType(){
			console.log(this.selectedMediaType);
			this.getMediaOverview(this.selectedMediaType);
			this.mediaTypeSelected = true;
			this.editMode = false;
			this.getMediaLabel();
			var element = document.getElementById("uppyHolder");
			element.classList.remove("showUPPY")
			element.classList.add("hideUPPY");
		},
		getMediaLabel(){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getMediaLabel&id=' + vm.selectedMediaType)
			.then(function (result){
				console.log(result.data.RESULTS[0].MEDIATYPE);
				vm.mediaTypeLabel = result.data.RESULTS[0].MEDIATYPE;
			})
		},
		getDistibutorsForMedia(){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getDistributorsForMedia&mediaID=' + vm.mediaOverviewDetailObject.ID)
			.then(function (response) {
				vm.distributorArray = response.data.RESULTS;
				if (vm.distributorArray.length == 0){
					vm.clearDistributor();
				}
			})
		},
		handleClick: function(value) {
			var vm = this;
			vm.editMode = true;
			var element = document.getElementById("uppyHolder");
			element.classList.remove("hideUPPY")
			element.classList.add("showUPPY");
			if (vm.newMediaElement == true){
				
				return;
			}
			vm.addMode = false;
			// vm.initUppy();
			vm.axios.get(vm.dataURL + 'method=getMediaOverviewDetail&id=' + value.ID)
					.then(function (response){
						// vm.initUppy();
						vm.mediaOverviewDetailArray = response.data.RESULTS;
						vm.mediaOverviewDetailObject = vm.mediaOverviewDetailArray[0];
						vm.getDistibutorsForMedia();
						
						vm.setUpMediaDetails(vm.selectedMediaType);
						
					})
			

		},
		setUpUppy(){
			var element = document.getElementById("uppyHolder");
			element.classList.remove("hideUPPY")
			element.classList.add("showUPPY");
		},
		setUpMediaDetails(mediaType){
			switch (mediaType){
				case 1:{
					this.getVideoDetails();
					break;
				}
				case 2:{
					this.getBookDetails();
					break;
				}
				case 3:{
					this.getArticleDetails();
					break;
				}
				case 5:{
					this.getWritingDetails();
					break;
				}
				case 6:{
					this.getOtherDetails();
					break;
				}
			}
		},
		
		getVideoDetails(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getVideoDetails&summary_ID=' + vm.mediaOverviewDetailObject.ID)
			.then(function (result){
				vm.videoDetailsArray = result.data.RESULTS;
				vm.videoDetailsObject = vm.videoDetailsArray[0];
			})
		},
		getBookDetails(){
			var vm = this;
			// vm.bookDetailObject.AUTHOR = '';
			// vm.bookDetailObject.PUBLISHER = '';
			// vm.bookDetailObject.DESCRIPTIONS = '';
			// vm.bookDetailObject.MEDIATYPE = null;
			vm.axios.get(vm.dataURL + 'method=getBookDetails&summaryID=' + vm.mediaOverviewDetailObject.ID)
			.then(function (result){
				vm.bookDetailArray = result.data.RESULTS;
				vm.bookDetailObject = vm.bookDetailArray[0];
				vm.bookDetailObject.DESCRIPTION = vm.bookDetailObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
						.replace(/[\u201C\u201D]/g, '"');
			})
		},
		getArticleDetails(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getArticleDetails&summaryID=' + vm.mediaOverviewDetailObject.ID)
					.then(function (result){
						vm.articleDetailArray = result.data.RESULTS;
						vm.articleDetailObject = vm.articleDetailArray[0];
						vm.articleDetailObject.DESCRIPTION = vm.articleDetailObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		getWritingDetails(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getWritingDetails&summaryID=' + vm.mediaOverviewDetailObject.ID)
					.then(function (result){
						vm.writingDetailsArray = result.data.RESULTS;
						vm.writingDetailsObject = vm.writingDetailsArray[0];
						vm.writingDetailsObject.DESCRIPTION = vm.writingDetailsObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		getOtherDetails(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getOtherDetails&summaryID=' + vm.mediaOverviewDetailObject.ID)
					.then(function (result){
						vm.otherDetailsArray = result.data.RESULTS;
						vm.otherDetailsObject = vm.otherDetailsArray[0];
					})
		},
		distributorClick(ID){
			var vm = this;
			vm.editDistributor = true;
			vm.axios.get(vm.dataURL + "method=getDistributorObject&id=" + ID)
			.then(function (response){
				vm.selectedDistributorObject = response.data.RESULTS[0];
			})
		},
		clearDistributor(){
			this.selectedDistributorObject.DISTRIBUTORNAME='';
			this.selectedDistributorObject.DISTIBUTORLINK='';
			this.editDistributor = false;
		},
		getColorTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getColorTypes')
			.then(function (result){
				vm.colorTypes = result.data.RESULTS;
			})
		},
		getVideoTypes(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getVideoTypes')
					.then(function (result){
						vm.videoTypes = result.data.RESULTS;
					})
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
						endpoint: "/images/danceImagesUpload/uploadMediaImages.cfm",
						formData: true,
						fieldName: "fileData"
					});
			
			uppyLarge.on("complete", result => {
				// eslint-disable-next-line
				console.log(
						"Upload complete! We’ve uploaded these files:",
						result.successful
				);
				this.mediaOverviewDetailObject.THUMBNAIL = result.successful[0].name;
			});
		}
	},

	
	mounted() {
		this.getMediaTypes();
		this.getVideoTypes();
		this.getColorTypes();
		this.initUppy();
		// const uppyLarge = Uppy({ debug: true })
		// 		.use(Dashboard, {
		// 			trigger: ".UppyModalOpenerBtn",
		// 			inline: true,
		// 			target: ".DashboardContainer",
		// 			height: 300
		// 		})
		// 		.use(XHRUpload, {
		// 			endpoint: "/images/danceImagesUpload/uploadMediaImages.cfm",
		// 			formData: true,
		// 			fieldName: "fileData"
		// 		});
		//
		// uppyLarge.on("complete", result => {
		// 	// eslint-disable-next-line
		// 	console.log(
		// 			"Upload complete! We’ve uploaded these files:",
		// 			result.successful
		// 	);
		// 	this.mediaOverviewDetailObject.THUMBNAIL = result.successful[0].name;
		// });
	}
}
</script>

<style scoped>
   .hideUPPY{display: none;}  .showUPPY{display: inline;}
</style>
