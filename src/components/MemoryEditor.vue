<template>
<v-container>
	<div>
		<v-card
				class="d-flex justify-center mb-6"
				outlined
				tile
		>
			Memories Editor
		</v-card>
	</div>
	<v-row>
		<v-col md10 sm12>
			<v-data-table
					:headers="headers"
					:items="memoriesArray"
					:items-per-page="500"
					class="elevation-1"
					@click:row="handleClick"
					:dense="false">
				<template v-slot:item.PUBLISH="{ item }">
					<v-simple-checkbox
							v-model="item.PUBLISH"
							disabled
					></v-simple-checkbox>
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
	name: "MemoryEditor" ,
	data: () =>({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		memoriesArray:[],
		memoryArray:[],
		memoryObject:{},
		snackbar: false,
		memoryTypes:[],
		text:'Saved',
		timeout: 100,
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		},
		headers: [
			{text: "Title", value: "HEADLINE", sortable:true},
			{text: "Memory Type", value: "MEMORYTYPE", sortable:true},
			{text:"Publish", value: 'PUBLISH', sortable: true}
		],
		textMode:false,
		videoMode:false,
	}),
	methods:{
		getMemories(){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getMemories')
					.then(function (result){
						vm.memoriesArray = result.data.RESULTS;
					})
		},
		getMemory(id){
			let vm = this;
			vm.axios.get(vm.dataURL + 'method=getOneMemory&id=' + id)
					.then(function (result){
						vm.memoryArray = result.data.RESULTS;
						vm.memoryObject = vm.memoryArray[0];
					})
		},
		handleClick: function(value){
			if (value.TYPE == 1){
				this.textMode=false;
				this.videoMode=true;
			}else{
				this.textMode=true;
				this.videoMode=false;
			}
			this.getMemory(value.ID);
		},
		getMemoryTypes(){
			let vm = this;
			
			vm.axios.get(vm.dataURL + 'method=getMemoryTypes')
					.then(function (result){
						vm.memoryTypes = result.data.RESULTS;
					})
		}
	},
	mounted() {
		this.getMemories();
		this.getMemoryTypes();
	}
	
}
</script>

<style scoped>

</style>
