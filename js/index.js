var CELSIUSDEGREES = 0, FAHRENHEIT = 1;

var vm = new Vue({
  el: '#weatherApp',
  data: {
    latitude: 0.0,
    longitude: 0.0,
    city: 'AKL Weather',
    curTemp: null,
    displayMode: CELSIUSDEGREES,
    dataObj: null,
    weatherMain: 'Fine day',
    weatherDesc: 'Clear day',
    errorMsg: '',
  },
  computed: {
    classWI: function() {
      if (this.dataObj != null){
        var weatherID = this.dataObj.weather[0].id;
        if (weatherID >= 200 && weatherID <= 232) {
          return 'wi-thunderstorm';
        } else if (weatherID >= 300 && weatherID <= 321) {
          return 'wi-sprinkle';
        } else if (weatherID >= 500 && weatherID <= 531) {
          return 'wi-rain';
        } else if (weatherID >= 600 && weatherID <= 622) {
          return 'wi-snow';
        } else if (weatherID >= 701 && weatherID <= 781) {
          return 'wi-train';
        } else if(weatherID == 800) {
          return 'wi-moon-alt-new';
        } else if (weatherID >= 801 && weatherID <= 804) {
          return 'wi-cloud';
        } else if (weatherID >= 900 && weatherID <= 962) {
          return 'wi-small-craft-advisory';
        }
      }
      return '';
    },
    curTempDisplay: function() {
      if (this.curTemp != null) {
        if (this.displayMode == CELSIUSDEGREES) {
          return (this.curTemp - 273.15).toFixed(1);
        } else {
          return (this.curTemp * 9/5 - 459.67).toFixed(1);
        }
      } else {
        return null;
      }      
    },
  },
  ready: function() {
    this.getLocation();
    console.log('App ready!');
  },
  methods: {
    getTemp: function(option) {
      this.displayMode = option;
    },
    getLocation: function() {
      if (!navigator.geolocation) {
        this.errorMsg = "Geolocation is not supported by your browser";
        this.city = this.errorMsg;
        console.warn(this.errorMsg);
        return;
      }
      console.log('Get current position..');
      var options = {timeout:60000};
      navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    },
    success: function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.latitude = parseFloat(this.latitude).toFixed(2);
      this.longitude = parseFloat(this.longitude).toFixed(2);

      this.getWeather();
    },
    error: function(err) {
      this.errorMsg = "Unable to retrieve your location";
      this.city = this.errorMsg;
      
      console.warn(`ERROR(${err.code}): ${err.message}`);
      console.warn(this.errorMsg);
    },
    getWeather: function() {
      var reqURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + this.latitude + '&lon=' + this.longitude + '&APPID=69d3cf86b46f19cf3e049339355533aa';
      
      this.$http.get(reqURL).then(function(response) {
        this.dataObj = response.data;
        this.curTemp = this.dataObj.main.temp;
        this.city = this.dataObj.name;
        this.weatherMain = this.dataObj.weather[0].main;
        this.weatherDesc = this.dataObj.weather[0].description;
      }, function(response) {
        console.log(response);
      });
    }
  }
});