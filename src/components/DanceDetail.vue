<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					{{ danceObject.WORKTITLE }}
				</v-card-title>
			</v-card>
		</v-flex>
	</v-layout>
	<v-layout row>
		<v-flex md4 sm12>
			<v-text-field disabled label="Work Description"></v-text-field>
			<ckeditor :editor="editor" v-model="danceObject.DESCRIPTION" :config="editorConfig"></ckeditor>
		</v-flex>
		<v-flex md3 sm12 style="margin-left: 10px;">
			<v-text-field disabled label="Work Collaborators Detail"></v-text-field>
			<ckeditor :editor="editor" v-model="danceObject.WORKCOLLAB" :config="editorConfig"></ckeditor>
		</v-flex>
		<v-flex md3 sm12 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.WORKCOLLABSUMMARY"  label="Work Collaborators Summary" ></v-text-field>
		</v-flex>
	</v-layout>
	<v-layout row>
		<v-flex md2 sm12>
			<v-text-field  label="Length in Minutes" v-model="danceObject.LENGTH"></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field  label="Work Length String" v-model="danceObject.WORKLENGTHSTRING"></v-text-field>
		</v-flex>
		<v-flex md3 sm12 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.MEDIALINK"  label="Media Link" ></v-text-field>
		</v-flex>
		<v-flex md2 sm1 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.CAPSULEURL"  label="Capsule ID" ></v-text-field>
		</v-flex>
	</v-layout>
	<v-layout row>
		<v-flex md3 sm12>
			<v-text-field disabled label="Premiere Date"></v-text-field>
			<v-date-picker v-model="picker" ></v-date-picker>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field disabled label="Premiere Details"></v-text-field>
			<ckeditor :editor="editor" v-model="danceObject.PREMIERESTRING" :config="editorConfig"></ckeditor>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.PREMIEREVENUE"  label="Premiere Venue" ></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.PREMIERECITY"  label="Premiere City" ></v-text-field>
		</v-flex>
		<v-flex md2 sm12 style="margin-left: 10px;">
			<v-text-field v-model="danceObject.PREMIERECOUNTRY"  label="Premiere Country" ></v-text-field>
		</v-flex>
	</v-layout>
	<v-row>
		
		<v-col md2 sm12>
			<div class="DashboardContainer" id="uppyHolder" >Add Work Image</div>
		</v-col>
		<v-col md1 sm12>
			<v-text-field v-model="danceObject.WORKIMAGE" disabled></v-text-field>
		</v-col>
		<v-col md3 sm12 >
			<v-img :src="'https://www.mercecunningham.org/images/danceimagesupload/smallDanceImages/' + danceObject.WORKIMAGE "></v-img>
		</v-col>
	</v-row>
	<v-row>
		<v-col md2 sm12>
			<v-checkbox v-model="danceObject.HASREVIVAL" label="Has Revival Information"></v-checkbox>
		</v-col>
		<v-col md3 sm12>
			<v-btn color="green" @click="updateDance">Save General Dance Edits</v-btn>
		</v-col>
		<v-col md3 sm12>
		</v-col>
	</v-row>
	
	
	<v-container>
		<v-card>
			<v-tabs>
				<v-tab style="font-size: large" ripple key="1" @click="dancerTabClick" >Dancers</v-tab>
				<v-tab style="font-size: large" ripple key="2" @click="costumerTabClick" >Costumers</v-tab>
				<v-tab style="font-size: large" ripple key="3" @click="decorTabClick" >Set Designers</v-tab>
				<v-tab style="font-size: large" ripple key="4" @click="lightingTabClick" >Lighting Designers</v-tab>
				<v-tab style="font-size: large" ripple key="5" @click="MusicTabClick" >Music</v-tab>
				<v-tab style="font-size: large" ripple key="6" @click="revivalTabClick" >Revivals</v-tab>
				<v-tab-item key="1">
					<v-row>
						<v-col md4 style="margin-left: 10px;">
							<v-simple-table>
								<template v-slot:default>
									<tbody>
									<tr>
										<td><em>Associated Dancer</em></td>
										<td><em>Original</em></td>
									</tr>
									<tr
											v-for="item in associatedDancersArray"
											:key="item.ID"
											@click="associatedDancerClick(item.ID)"
									>
										<td>{{ item.LABEL }}</td>
										<td>{{ item.ORIGINALDANCER}}</td>
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
						<v-col md4>
							<v-text-field disabled v-model="dancerFullName"></v-text-field>
							<v-text-field v-if="editMode" label="Cast Initials" v-model="associatedDancerObject.CASTINITITIALS"></v-text-field>
							<v-text-field v-if="addMode" label="Cast Initials" v-model="associatedDancerObject.CASTINITITIALS"></v-text-field>
							<v-checkbox v-if="editMode" label="Original Dancer" v-model="associatedDancerObject.ORIGINALDANCER"></v-checkbox>
							<v-checkbox v-if="addMode" label="Original Dancer" v-model="associatedDancerObject.ORIGINALDANCER"></v-checkbox>
							<v-btn v-if="editMode" color="blue" @click="updateDancerAssocRecord">Update Association Record</v-btn>
							<v-btn v-if="editMode" color="red" @click="deleteAssociatedDancer" style="margin-left: 10px;">Delete Association Record</v-btn>
							<v-btn v-if="addMode" color="blue" @click="insertNewDancerAssocRecord">Add New Association Record</v-btn>
						</v-col>
						<v-col md4>
							<v-select
									v-model="selectedNewDancer"
									label="Available Dancers"
									:items="availableDancersArray"
									item-text="LABEL"
									item-value="DATA"
									return-object
									placeholder="Available Dancers"
									@change="handleAvailableDancersClick()"
							></v-select>
						</v-col>
						
					</v-row>
					
				</v-tab-item>
				<v-tab-item key="2">
				<v-row>
					<v-col md4 style="margin-left: 10px;">
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
									<td><em>Associated Costumers</em></td>
								
								</tr>
								<tr
										v-for="item in associatedCostumersArray"
										:key="item.ID"
										@click="associatedCostumerClick(item.ID)"
								>
									<td>{{ item.LABEL }}</td>
									<td>{{ item.ORIGINALDANCER}}</td>
								</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-col>
					<v-col md4>
						<v-text-field  v-model="costumerFullName"></v-text-field>
						<v-text-field v-if="editMode" disabled label="Notes"></v-text-field>
						<v-text-field v-if="addMode" disabled label="Notes"></v-text-field>
						<ckeditor v-if="editMode" :editor="editor" v-model="associatedCostumerObject.NOTES" :config="editorConfig"></ckeditor>
						<ckeditor v-if="addMode" :editor="editor" v-model="associatedCostumerObject.NOTES" :config="editorConfig"></ckeditor>
						<v-btn v-if="editMode" color="blue" @click="updateCostumerAssocRecord">Update Association Record</v-btn>
						<v-btn v-if="editMode" color="red" @click="deleteAssociatedCostumer" style="margin-left: 10px;">Delete Association Record</v-btn>
						<v-btn v-if="addMode" color="blue" @click="insertNewCostumerAssocRecord">Add New Association Record</v-btn>
					</v-col>
					<v-col md4>
						<v-select
								v-model="selectedNewCostumer"
								label="Available Costumers"
								:items="availableCostumersArray"
								item-text="LABEL"
								item-value="DATA"
								return-object
								placeholder="Available Costumers"
								@change="handleAvailableCostumersClick()"
						></v-select>
					</v-col>
				
				</v-row>
			
			</v-tab-item>
				<v-tab-item key="3">
					<v-row>
						<v-col md4 style="margin-left: 10px;">
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
										<td><em>Associated Designers</em></td>
									
									</tr>
									<tr
											v-for="item in associatedDecorArray"
											:key="item.ID"
											@click="associatedDecorClick(item.DATA)"
									>
										<td>{{ item.DECOR_FULLNAME }}</td>
										
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
						<v-col md4>
							<v-text-field  v-model="decorFullName"></v-text-field>
							<v-text-field v-if="editMode" disabled label="Notes"></v-text-field>
							<v-text-field v-if="addMode" disabled label="Notes"></v-text-field>
							<ckeditor v-if="editMode" :editor="editor" v-model="associatedDecorObject.NOTES" :config="editorConfig"></ckeditor>
							<ckeditor v-if="addMode" :editor="editor" v-model="associatedDecorObject.NOTES" :config="editorConfig"></ckeditor>
							<v-btn v-if="editMode" color="blue" @click="updateDecorAssocRecord">Update Association Record</v-btn>
							<v-btn v-if="editMode" color="red" @click="deleteDecorAssociation" style="margin-left: 10px;">Delete Association Record</v-btn>
							<v-btn v-if="addMode" color="blue" @click="insertNewDecorAssocRecord">Add New Association Record</v-btn>
						</v-col>
						<v-col md4>
							<v-select
									v-model="selectedNewDecor"
									label="Available Designers"
									:items="availableDecorArray"
									item-text="LABEL"
									item-value="DATA"
									return-object
									placeholder="Available Designers"
									@change="handleAvailableDecorClick()"
							></v-select>
						</v-col>
					
					</v-row>
				
				</v-tab-item>
				<v-tab-item key="4">
					<v-row>
						<v-col md4 style="margin-left: 10px;">
							<v-simple-table>
								<template v-slot:default>
									<tbody>
									<tr>
										<td><em>Associated Lighting Designers</em></td>
									
									</tr>
									<tr
											v-for="item in associatedLightingArray"
											:key="item.ID"
											@click="associatedLightingClick(item.ID)"
									>
										<td>{{ item.LIGHTINGFULLNAME }}</td>
									
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
						<v-col md4>
							<v-text-field  v-model="lightingFullName"></v-text-field>
							<v-text-field v-if="editMode" disabled label="Notes"></v-text-field>
							<v-text-field v-if="addMode" disabled label="Notes"></v-text-field>
							<ckeditor v-if="editMode" :editor="editor" v-model="associatedLightingObject.NOTES" :config="editorConfig"></ckeditor>
							<ckeditor v-if="addMode" :editor="editor" v-model="associatedLightingObject.NOTES" :config="editorConfig"></ckeditor>
							<v-btn v-if="editMode" color="blue" @click="updateLightingAssocRecord">Update Association Record</v-btn>
							<v-btn v-if="editMode" color="red" @click="deleteLightingAssociation" style="margin-left: 10px;">Delete Association Record</v-btn>
							<v-btn v-if="addMode" color="blue" @click="insertNewLightingAssocRecord">Add New Association Record</v-btn>
						</v-col>
						<v-col md4>
							<v-select
									v-model="selectedNewLightingObject"
									label="Available Lighting Designers"
									:items="availableLightingArray"
									item-text="LABEL"
									item-value="DATA"
									return-object
									placeholder="Available Lighting Designers"
									@change="handleAvailableLightingClick()"
							></v-select>
						</v-col>
					
					</v-row>
				
				</v-tab-item>
				<v-tab-item key="5">
					<v-row>
						<v-col md4 style="margin-left: 10px;">
							<v-simple-table>
								<template v-slot:default>
									<tbody>
									<tr>
										<td><em>Associated Music</em></td>
									
									</tr>
									<tr
											v-for="item in associatedMusicsArray"
											:key="item.ID"
											@click="associatedMusicClick(item.ID)"
									>
										<td>{{ item.LABEL}}</td>
									
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
						<v-col md4>
							<v-text-field  v-model="musicName"></v-text-field>

							<v-text-field v-if="editMode" v-model="associatedMusicObject.COMPOSER_FN" disabled label="Composer FN"></v-text-field>
							<v-text-field v-if="addMode" v-model="associatedMusicObject.COMPOSER_FN" disabled label="Composer FN"></v-text-field>
							<v-text-field v-if="editMode" v-model="associatedMusicObject.COMPOSER_LN" disabled label="Composer LN"></v-text-field>
							<v-text-field v-if="addMode" v-model="associatedMusicObject.COMPOSER_LN" disabled label="Composer LN"></v-text-field>
							<v-text-field v-if="editMode" disabled label="Notes"></v-text-field>
							<v-text-field v-if="addMode" disabled label="Notes"></v-text-field>
							<ckeditor v-if="editMode" :editor="editor" v-model="associatedMusicObject.NOTES" :config="editorConfig"></ckeditor>
							<ckeditor v-if="addMode" :editor="editor" v-model="associatedMusicObject.NOTES" :config="editorConfig"></ckeditor>
							<v-btn v-if="editMode" color="blue" @click="updateMusicAssociation">Update Association Record</v-btn>
							<v-btn v-if="editMode" color="red" @click="deleteMusicAssociation" style="margin-left: 10px;">Delete Association Record</v-btn>
							<v-btn v-if="addMode" color="blue" @click="createMusicAssociation">Add New Association Record</v-btn>
						</v-col>
						<v-col md4>
							<v-select
									v-model="selectedNewMusicObject"
									label="Available Music"
									:items="availableMusicArray"
									item-text="LABEL"
									item-value="DATA"
									return-object
									placeholder="Available Music"
									@change="handleAvailableMusicClick()"
							></v-select>
						</v-col>
					
					</v-row>
				
				</v-tab-item>
				<v-tab-item key="6">
					<v-row>
						<v-col md4 style="margin-left: 10px;">
							<v-simple-table>
								<template v-slot:default>
									<tbody>
									<tr>
										<td><em>Revivals</em></td>
									
									</tr>
									<tr
											v-for="item in revivalArray"
											:key="item.ID"
											@click="handleRevivalClick(item.ID)"
									>
										<td>{{ item.CITY}}</td>
									
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
						<v-col md4 style="margin-left: 10px;" v-if="editMode">
							<v-text-field label="City" v-model="revivalObject.CITY"></v-text-field>
							<v-text-field label="Revivals Year" v-model="revivalObject.REVIVALYEAR"></v-text-field>
							<ckeditor :editor="editor" v-model="revivalObject.REVIVALNOTES" :config="editorConfig"></ckeditor>
							<v-btn color="blue" @click="updateRevival">Save Revival Edits</v-btn>
							<v-btn color="red" @click="deleteRevival">Delete Revival Data</v-btn>
						</v-col>
						<v-col md4 style="margin-left: 10px;" v-if="addMode">
							<v-text-field label="City" v-model="revivalObject.CITY"></v-text-field>
							<v-text-field label="Revivals Year" v-model="revivalObject.REVIVALYEAR"></v-text-field>
							<ckeditor :editor="editor" v-model="revivalObject.REVIVALNOTES" :config="editorConfig"></ckeditor>
							<v-btn color="blue" @click="saveNewRevival">Save New Revival</v-btn>
							
						</v-col>
					</v-row>
					<v-row>
						<v-col md4 style="margin-left: 10px;">
							<v-btn color="blue" @click="prepareNewRevival">Add New Revival</v-btn>
						</v-col>
					</v-row>
				</v-tab-item>
			</v-tabs>
		</v-card>
	</v-container>
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
import router from "@/router";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
const XHRUpload = require("@uppy/xhr-upload");
require('@uppy/core/dist/style.css') ;
require('@uppy/dashboard/dist/style.css');
export default {
	name: "DanceDetail",
	data:() =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		danceArray: [],
		danceObject:{},
		revivalArray:[],
		revivalArrayTemp:[],
		revivalObject:{},
		selectedRevivalObject:{},
		snackbar: false,
		text:'Saved',
		timeout: 1000,
		picker: '',
		editor: ClassicEditor,
		editorData: '',
		editMode:false,
		addMode:false,
		availableDancersArray:[],
		associatedDancersArray:[],
		associatedDancerArray:[],
		associatedDancerObject:{},
		newDecorID:'',
		availableCostumersArray:[],
		associatedCostumersArray:[],
		associatedCostumerArray:[],
		associatedCostumerObject:{},
		selectedNewCostumer:null,
		availableMusicArray:[],
		associatedMusicArray:[],
		associatedMusicsArray:[],
		associatedMusicObject:{},
		selectedNewMusicObject:{},
		selectedNewMusic:null,
		musicName:'',
		availableDecorArray:[],
		associatedDecorArray:[],
		associatedDecorObject:{},
		selectedNewDecorObject:{},
		selectedNewDecor:null,
		decorFullName:'',
		associatedLightingArray:[],
		associatedLightingObject:{},
		selectedNewLightingObject:{},
		availableLightingArray:[],
		lightingFullName:'',
		danceID:'',
		dancerFName:'',
		dancerLName:'',
		dancerFullName:'',
		costumerFullName:'',
		selectedNewDancer:null,
		newDancerID:null,
		newCostumerID:null,
		selectedNewCostumerObject:{},
		editorConfig: {
		},
	
		
	}),
	methods:{
		dancerTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.associatedDancerObject.CASTINITITIALS= '';
			this.dancerFullName ='';
			this.associatedDancerObject.ORIGINALDANCER = false;
			this.selectedNewDancer = null;
			
		},
		costumerTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.selectedNewCostumer = null;
			this.getAssociatedCostumers();
			this.getAvailableCostumers();
			this.costumerFullName = '';
			
		},
		decorTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.selectedNewDecor = null;
			this.getAssociatedDecor(this.danceID);
			this.getAvailableDecor(this.danceID);
			this.decorFullName = '';
			
		},
		lightingTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.selectedNewLightingObject = null;
			this.getAssociatedLighting(this.danceID);
			this.getAvailableLighting(this.danceID);
			this.lightingFullName = '';
			
		},
		MusicTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.selectedNewMusicObject = null;
			this.getAssociatedMusic(this.danceID);
			this.getAvailableMusic(this.danceID);
			this.musicName = '';
		},
		revivalTabClick(){
			this.editMode = false;
			this.addMode = false;
			this.getRevivalsForWork(this.danceID);
		},
		getDanceDetails(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getDanceDetails&danceID=' + id)
			.then(function (response){
				vm.danceArray = response.data.RESULTS;
				vm.danceObject = vm.danceArray[0];
				vm.picker = vm.danceObject.PREMIEREDATE;
				vm.danceObject.DESCRIPTION = vm.danceObject.DESCRIPTION.replace(/[\u2018\u2019]/g, "'")
						.replace(/[\u201C\u201D]/g, '"');
			})
		},
		deleteRevival(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteRevival&revival_ID=' + vm.revivalObject.ID)
			.then(function (response){
				vm.snackbar = true;
				vm.revivalTabClick();
				vm.getRevivalsForWork(vm.danceID);
				vm.editMode = false;
			})
		},
		saveNewRevival(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewRevival",
					revivalObject: JSON.stringify(vm.revivalObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.revivalTabClick();
					vm.getRevivalsForWork(vm.danceID);
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
		
		updateRevival(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateRevival",
					revivalObject: JSON.stringify(vm.revivalObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.revivalTabClick();
					vm.getRevivalsForWork(vm.danceID);
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
		prepareNewRevival(){
			this.revivalObject.CITY='';
			this.revivalObject.DANCE=this.danceID;
			this.revivalObject.REVIVALNOTES='';
			this.revivalObject.REVIVALYEAR='';
			this.editMode = false
			this.addMode = true;
		},
		
		getRevivalsForWork(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getRevivalsForWork&dance_ID=' + vm.danceID)
			.then(function (result){
				vm.revivalArray = result.data.RESULTS;
			})
		},
		handleRevivalClick(id){
			let vm = this;
			vm.editMode = true;
			axios.get(vm.dataURL + 'method=getRevivalsDetails&revival_ID=' + id)
			.then(function (response) {
				vm.revivalArrayTemp = response.data.RESULTS;
				vm.revivalObject = vm.revivalArrayTemp[0];
			})
			
			},

		handleAvailableMusicClick(){
			let vm = this;
			vm.addMode = true;
			vm.newMusicID =  vm.selectedNewMusicObject.DATA;
			vm.editMode = false;
			vm.musicName = vm.selectedNewMusicObject.TITLE;
			vm.selectedNewMusicObject.ID = vm.newMusicID;
			vm.selectedNewMusicObject.danceID = vm.danceID;
			vm.associatedMusicObject.NOTES = '';
			vm.selectedNewMusicObject.NOTES = vm.associatedMusicObject.NOTES
			vm.associatedMusicObject.COMPOSER_LN = vm.selectedNewMusicObject.COMPOSER_LN;
			vm.associatedMusicObject.COMPOSER_FN = vm.selectedNewMusicObject.COMPOSER_FN;
		} ,
		updateMusicAssociation(){
			let vm = this;
			axios.get(vm.dataURL + 'method=updateMusicAssociation&id=' + vm.associatedMusicObject.ID + '&notes=' + vm.associatedMusicObject.NOTES)
			.then(function (response){
				vm.snackbar = true;
				vm.MusicTabClick();
				vm.getAssociatedMusic(vm.danceID);
			})
		},
		createMusicAssociation(){
			let vm = this;
			axios.get(vm.dataURL + 'method=createAssocRecordForMusic&danceID=' + vm.danceID + '&notes=' + vm.associatedMusicObject.NOTES + '&musicID=' + vm.newMusicID)
					.then(function (response){
						vm.snackbar = true;
						vm.MusicTabClick();
						vm.getAssociatedMusic(vm.danceID);
					})
		},
		getAvailableMusic(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAvailableMusic&danceID=' + id)
					.then(function (response){
						vm.availableMusicArray = response.data.RESULTS;
					})
		},
		getAssociatedMusic(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getMusicForWork&danceID=' + id)
					.then(function (response){
						vm.associatedMusicsArray = response.data.RESULTS;
					})
		},
		associatedMusicClick(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAssociationMusic&id=' + id)
					.then(function (response){
						vm.associatedMusicArray = response.data.RESULTS;
						vm.associatedMusicObject = vm.associatedMusicArray[0];
						vm.musicName = vm.associatedMusicObject.TITLE;
						vm.editMode = true;
						vm.addMode = false;
						vm.selectedNewMusic = null;
						vm.associatedMusicObject.NOTES = vm.associatedMusicObject.NOTES.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		deleteMusicAssociation(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteMusicAssociation&id=' + vm.associatedMusicObject.ID)
					.then(function (response){
						vm.snackbar = true;
						vm.getAssociatedMusic(vm.danceID);
						vm.MusicTabClick();
					})
		},
		deleteDecorAssociation(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteDecorAssociation&id=' + vm.associatedDecorObject.ID)
					.then(function (response){
						vm.snackbar = true;
						vm.getAssociatedDecor(vm.danceID);
						vm.decorTabClick();
					})
		},
		getAssociatedDecor(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAssociatedDecor&danceID=' + id)
					.then(function (response){
						vm.associatedDecorArray = response.data.RESULTS;
					})
		},
		getAvailableDecor(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAvailableDecor&danceID=' + vm.danceID)
					.then(function (response){
						vm.availableDecorArray = response.data.RESULTS;
					})
		},
		handleAvailableDecorClick(){
			let vm = this;
			vm.addMode = true;
			vm.newDecorID =  vm.selectedNewDecor.DATA;
			vm.editMode = false;
			vm.decorFullName = vm.selectedNewDecor.LABEL;
			vm.selectedNewDecorObject.ID = vm.newDecorID;
			vm.selectedNewDecorObject.danceID = vm.danceID;
			vm.associatedDecorObject.NOTES = '';
			vm.selectedNewDecorObject.NOTES = vm.associatedDecorObject.NOTES
		} ,
		associatedDecorClick(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAssociationDecor&id=' + id)
					.then(function (response){
						vm.associatedDecorArray = response.data.RESULTS;
						vm.associatedDecorObject = vm.associatedDecorArray[0];
						vm.decorFullName = vm.associatedDecorObject.DECORFULLNAME;
						vm.editMode = true;
						vm.addMode = false;
						vm.selectedNewDecor = null;
						vm.associatedDecorObject.NOTES = vm.associatedDecorObject.NOTES.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		updateDecorAssocRecord(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateDecorAssociation",
					associatedDecorObject: JSON.stringify(vm.associatedDecorObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.decorTabClick();
					vm.getAssociatedDecor(vm.danceID);
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
		insertNewDecorAssocRecord(){
			let vm = this;
			vm.selectedNewDecorObject.NOTES = vm.associatedDecorObject.NOTES;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewDecorAssociation",
					selectedNewDecorObject: JSON.stringify(vm.selectedNewDecorObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.decorTabClick();
					vm.getAssociatedDecor(vm.danceID);
					vm.editMode = false;
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
		deleteLightingAssociation(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteLightingAssociation&id=' + vm.associatedLightingObject.ID)
					.then(function (response){
						vm.snackbar = true;
						vm.getAssociatedDecor(vm.danceID);
						vm.decorTabClick();
					})
		},
		getAssociatedLighting(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getLightingForWork&danceID=' + id)
					.then(function (response){
						vm.associatedLightingArray = response.data.RESULTS;
					})
		},
		getAvailableLighting(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAvailableLighting&danceID=' + vm.danceID)
					.then(function (response){
						vm.availableLightingArray = response.data.RESULTS;
					})
		},
		handleAvailableLightingClick(){
			let vm = this;
			vm.addMode = true;
			vm.newLightingID =  vm.selectedNewLightingObject.DATA;
			vm.editMode = false;
			vm.lightingFullName = vm.selectedNewLightingObject.LABEL;
			vm.selectedNewLightingObject.ID = vm.newLightingID;
			
			vm.selectedNewLightingObject.danceID = vm.danceID;
			vm.associatedLightingObject.NOTES = '';
			vm.selectedNewLightingObject.NOTES = vm.associatedLightingObject.NOTES
		} ,
		associatedLightingClick(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAssociationLighting&id=' + id)
					.then(function (response){
						vm.associatedLightingArray = response.data.RESULTS;
						vm.associatedLightingObject = vm.associatedLightingArray[0];
						vm.lightingFullName = vm.associatedLightingObject.LIGHTINGFULLNAME;
						vm.editMode = true;
						vm.addMode = false;
						vm.selectedNewLighting = null;
						vm.associatedLightingObject.NOTES = vm.associatedLightingObject.NOTES.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		updateLightingAssocRecord(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updatelightingDesignerDetails",
					associatedLightingObject: JSON.stringify(vm.associatedLightingObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.lightingTabClick();
					vm.getAssociatedLighting(vm.danceID);
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
		insertNewLightingAssocRecord(){
			let vm = this;
			vm.selectedNewLightingObject.NOTES = vm.associatedLightingObject.NOTES;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "insertNewlightingDesigner",
					selectedNewLightingObject: JSON.stringify(vm.selectedNewLightingObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.lightingTabClick();
					vm.getAssociatedLighting(vm.danceID);
					vm.editMode = false;
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
		handleAvailableDancersClick(){
			let vm = this;
			vm.addMode = true;
			vm.newDancerID =  vm.selectedNewDancer.DATA;
			vm.editMode = false;
			vm.dancerFullName = vm.selectedNewDancer.DANCER_FN;
			vm.dancerFullName += ' ';
			vm.dancerFullName += vm.selectedNewDancer.DANCER_LN;
			vm.associatedDancerObject.CASTINITITIALS = '';
			vm.associatedDancerObject.ORIGINALDANCER = false;
			vm.associatedDancerObject.DANCER = vm.newDancerID;
			vm.associatedDancerObject.WORK = vm.danceID;
		} ,
		getAvailableDancers(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAvailableDancers&danceID=' + id)
			.then(function (response){
				vm.availableDancersArray = response.data.RESULTS;
			})
		},
		getAssociatedDancers(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getDancersForWork&danceID=' + id)
					.then(function (response){
						vm.associatedDancersArray = response.data.RESULTS;
					})
		},
		deleteAssociatedDancer(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteDancerAssociation&id=' + vm.associatedDancerObject.ID)
			.then(function (response){
				vm.snackbar = true;
				vm.getAssociatedDancers(vm.danceID);
				vm.dancerTabClick();
			})
		},
		associatedDancerClick(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAssocRecordForDancer&id=' + id)
			.then(function (response){
				vm.associatedDancerArray = response.data.RESULTS;
				vm.associatedDancerObject = vm.associatedDancerArray[0];
				vm.dancerFullName = vm.associatedDancerObject.DANCER_FN;
				vm.dancerFullName += ' ';
				vm.dancerFullName += vm.associatedDancerObject.DANCER_LN;
				vm.editMode = true;
				vm.addMode = false;
				vm.selectedNewDancer = null;
				
				
			})
		},
		insertNewDancerAssocRecord(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "createAssocRecordForDancer",
					associatedDancerObject: JSON.stringify(vm.associatedDancerObject)
				},
				success: function () {
					vm.dancerTabClick();
					vm.snackbar = true;
					vm.getAssociatedDancers(vm.danceID);

					
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
		updateDancerAssocRecord(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "editAssociationForDancer",
					associatedDancerObject: JSON.stringify(vm.associatedDancerObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.dancerTabClick();
					vm.getAssociatedDancers(vm.danceID);
				
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
		
		getAssociatedCostumers(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getCostumersForWork&danceID=' + vm.danceID)
			.then(function (result){
				vm.associatedCostumersArray = result.data.RESULTS;
			})
		},
		getAvailableCostumers(){
			let vm = this;
			axios.get(vm.dataURL + 'method=getAvailableCostumers&danceID=' + vm.danceID)
			.then(function (response){
				vm.availableCostumersArray = response.data.RESULTS;
			})
		},
		handleAvailableCostumersClick(){
			let vm = this;
			vm.addMode = true;
			vm.newCostumerID =  vm.selectedNewCostumer.DATA;
			vm.editMode = false;
			vm.costumerFullName = vm.selectedNewCostumer.LABEL;
			vm.selectedNewCostumerObject.ID = vm.newCostumerID;
			vm.selectedNewCostumerObject.danceID = vm.danceID;
			vm.associatedCostumerObject.NOTES = '';
			vm.selectedNewCostumerObject.notes= vm.associatedCostumerObject.NOTES
		} ,
		associatedCostumerClick(id){
			let vm = this;
			axios.get(vm.dataURL + 'method=getCostumerAssociation&id=' + id)
					.then(function (response){
						vm.associatedCostumerArray = response.data.RESULTS;
						vm.associatedCostumerObject = vm.associatedCostumerArray[0];
						vm.costumerFullName = vm.associatedCostumerObject.COSTUMERFULLNAME;
						vm.editMode = true;
						vm.addMode = false;
						vm.selectedNewDancer = null;
						vm.associatedCostumerObject.NOTES = vm.associatedCostumerObject.NOTES.replace(/[\u2018\u2019]/g, "'")
								.replace(/[\u201C\u201D]/g, '"');
					})
		},
		updateCostumerAssocRecord(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateCostumerAssociation",
					associatedCostumerObject: JSON.stringify(vm.associatedCostumerObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.costumerTabClick();
					vm.getAssociatedCostumers(vm.danceID);
					
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
		insertNewCostumerAssocRecord(){
			let vm = this;
			vm.selectedNewCostumerObject.NOTES = vm.associatedCostumerObject.NOTES;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "createAssocRecordForCostumer",
					selectedNewCostumerObject: JSON.stringify(vm.selectedNewCostumerObject)
				},
				success: function () {
					vm.snackbar = true;
					vm.costumerTabClick();
					vm.getAssociatedCostumers(vm.danceID);
					
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
		deleteAssociatedCostumer(){
			let vm = this;
			axios.get(vm.dataURL + 'method=deleteCostumerAssociation&id=' + vm.associatedCostumerObject.ID)
					.then(function (response){
						vm.snackbar = true;
						vm.getAssociatedCostumers(vm.danceID);
						vm.costumerTabClick();
					})
		},
		updateDance(){
			let vm = this;
			window.$.ajax({
				type: "post",
				url: "https://mercecunningham.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "updateDanceDetails",
					danceObject: JSON.stringify(vm.danceObject)
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
		initUppy(){
			const uppyLarge = Uppy({ debug: true })
					.use(Dashboard, {
						trigger: ".UppyModalOpenerBtn",
						inline: true,
						target: "#uppyHolder",
						height: 300
					})
					.use(XHRUpload, {
						endpoint: "/images/danceImagesUpload/uploadSmallDanceImages.cfm",
						formData: true,
						fieldName: "fileData"
					});
			
			uppyLarge.on("complete", result => {
				// eslint-disable-next-line
				console.log(
						"Upload complete! We’ve uploaded these files:",
						result.successful
				);
				this.danceObject.DANCEIMAGE = result.successful[0].name;
			});
		}
	},
	created() {
		this.danceID =  this.$route.params.id;
		this.getDanceDetails(this.danceID);
		this.getAvailableDancers(this.danceID);
		this.getAssociatedDancers(this.danceID);
	},
	mounted() {
		this.initUppy();
	}
}
</script>

<style scoped>

</style>
