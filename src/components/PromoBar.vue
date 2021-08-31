<template>
<v-container>
	<v-layout row wrap align-center>
		<v-flex >
			<v-card>
				<v-card-title class="justify-center" >
					SET/EDIT PROMO BAR MESSAGE
				</v-card-title>
			</v-card>
		</v-flex>
	</v-layout>
	<v-row>
		<v-col md-6>
			<v-text-field label="Message" v-model="promoObject.MESSAGE"></v-text-field>
		</v-col>
		<v-col md-6>
			<v-text-field label="Link" v-model="promoObject.LINK"></v-text-field>
		</v-col>
	</v-row>
	<v-row>
		<v-col>
			<v-btn color="green" @click="savePromoMessage">
				Save Message Edit
			</v-btn>
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
import router from "@/router";
import Toast from 'vue-easy-toast'
export default {
	name: "PromoBar",
	data: () => ({
		dataURL: "https://mercecunningham.org/data/merce-data.cfc?",
		promoArray:[],
		promoObject:{},
		snackbar: false,
		text: `Saved`,
		timeout: 1000,
		
	}),
	methods: {
		getPromoBar(){
			var vm = this;
			vm.axios.get(vm.dataURL + 'method=getPromoPost')
			.then(function(response) {
				vm.promoArray = response.data.RESULTS;
				vm.promoObject = vm.promoArray[0];
			} )
		},
		savePromoMessage(){
			var vm = this;
			window.$.ajax({
				type: "post",
				url: "https://johncage.org/data/merce-data.cfc",
				dataType: "json",
				data: {
					method: "editPromo",
					promoObject: JSON.stringify(vm.promoObject)
				},
				success: function () {
					vm.snackbar = true;
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
	mounted(){
		this.getPromoBar();
	}
}
</script>

<style scoped>

</style>
