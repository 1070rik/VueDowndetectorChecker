<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-subheader>Most reported</v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="top in top10" :key="top" v-on:click="checkStatus(i)">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ top }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Down detector</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex xs7>
            <v-card>
              <v-card-title>
                <h1>Search for an application</h1>
              </v-card-title>
              <v-card-text>
                <v-select
                  v-bind:items="applications"
                  v-model="application"
                  label="Select an application"
                  prepend-icon="dashboard"
                  autocomplete
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-dialog v-model="dialog" persistent max-width="290">
                  <v-btn color="darl" dark slot="activator" v-on:click="checkStatus(application)">Check status</v-btn>
                  <v-card>
                    <v-card-title class="headline">Status for {{ application }}</v-card-title>
                    <v-card-text>{{ result.text }}</v-card-text>
                    <CheckMark v-if="result.result == 0"></CheckMark>
                    <Cross v-if="result.result != 0"></Cross>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="dark" @click.native="dialog = false">Okay thanks!</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import CheckMark from '../components/CheckMark';
  import Cross from '../components/Cross';

  export default {
    components: {
      CheckMark,
      Cross
    },
    data: () => ({
      drawer: true,
      dialog: false,
      application: null,
      applications: [],
      top10: [],
      result: []
    }),
    props: {
      source: String
    },
    methods: {
      checkStatus: function(appName) {
        this.result = [];
        this.$http.get('http://localhost:3000/checkStatus/' + appName).then(response => {
          this.result = response.data;
        }, response => {

        });
      }
    },
    created: function(){
        this.$http.get('http://localhost:3000/getTop10').then(response => {
          this.top10 = response.data;
        }, response => {

        });
        this.$http.get('http://localhost:3000/getAll').then(response => {
          this.applications = response.data;
        }, response => {

        });
    }
  }
</script>