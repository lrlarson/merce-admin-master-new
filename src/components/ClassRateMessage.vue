<template>
	<v-container>
		<v-layout row wrap align-center>
			<v-flex >
				<v-card>
					<v-card-title class="justify-center" >
						SET/EDIT CLASSES RATE MESSAGE
					</v-card-title>
				</v-card>
			</v-flex>
		</v-layout>
		<v-row>
			<v-col>
				<ckeditor :editor="editor" v-model="messageObject.RATE" :config="editorConfig"></ckeditor>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<v-btn color="green" @click="saveRateMessage">
					Save Message Edit
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import router from "@/router";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {

	name: "ClassRateMessage",
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		messageArray:[],
		messageObject:{},
		editor: ClassicEditor,
		editorData: '',
		editorConfig: {
			// The configuration of the editor.
		}
	}),
	methods: {
		getRateMessage() {
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getClassMessages')
			.then(function (response){
				vm.messageArray = response.data.RESULTS;
				vm.messageObject = vm.messageArray[0];
				console.log(response);
			})
		},
		saveRateMessage(){
			var vm = this;
			window.$.ajax({
				type: "post",
				url: "https://johncage.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "saveMessageEdits",
					messageObject: JSON.stringify(vm.messageObject)
				},
				success: function () {
					console.log('success');
					router.push({name:'Classes'});
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
	},
	mounted() {
		this.getRateMessage();
	}
}
</script>

<style scoped>
</style>
